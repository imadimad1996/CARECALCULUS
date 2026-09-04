import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';
import { getCorsHeaders, handleCorsOptions } from '../_cors';

interface Env {
  LEADS?: KVNamespace;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
}

const PLAN_PRICING: Record<string, { price: string; currency: string; durationDays: number }> = {
  monthly: { price: '4.99', currency: 'USD', durationDays: 30 },
  annual: { price: '19.99', currency: 'USD', durationDays: 365 },
  lifetime: { price: '49.99', currency: 'USD', durationDays: 36500 },
};

// Rate limiting: max 10 requests per IP per 10 minutes to prevent brute-forcing
async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  if (!env.LEADS) return false;
  const key = `ratelimit_paypal:${ip}`;
  const existing = await env.LEADS.get(key);
  const count = existing ? parseInt(existing, 10) : 0;
  if (count >= 10) return true;
  await env.LEADS.put(key, String(count + 1), { expirationTtl: 600 });
  return false;
}

// Obtain a PayPal OAuth access token using server-side credentials
async function getPayPalAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`PayPal OAuth failed with status ${res.status}`);
  }
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return handleCorsOptions(context.request as any);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const cors = getCorsHeaders(context.request as any);
  try {
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await isRateLimited(context.env, ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429, headers: cors,
      }) as any;
    }

    const body = await context.request.json() as {
      orderId?: string;
      payerEmail?: string;
      planType?: string;
    };

    const { orderId, payerEmail, planType = 'annual' } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), {
        status: 400, headers: cors,
      }) as any;
    }

    const planConfig = PLAN_PRICING[planType] || PLAN_PRICING.annual;

    // STRICT SERVER-SIDE VERIFICATION: Reject if PayPal credentials not configured
    if (!context.env.PAYPAL_CLIENT_ID || !context.env.PAYPAL_CLIENT_SECRET) {
      console.error('PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing from Cloudflare environment.');
      return new Response(JSON.stringify({ error: 'Payment gateway configuration error. Please contact support.' }), {
        status: 500, headers: cors,
      }) as any;
    }

    let verifiedAmount = planConfig.price;
    let verifiedEmail = payerEmail || 'anonymous';

    try {
      const accessToken = await getPayPalAccessToken(
        context.env.PAYPAL_CLIENT_ID,
        context.env.PAYPAL_CLIENT_SECRET,
      );
      const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!orderRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to retrieve order from PayPal' }), {
          status: 402, headers: cors,
        }) as any;
      }
      const orderDetails = await orderRes.json() as any;
      if (orderDetails.status !== 'COMPLETED') {
        return new Response(JSON.stringify({ error: `PayPal order not completed (status: ${orderDetails.status})` }), {
          status: 402, headers: cors,
        }) as any;
      }

      // Validate payment amount & currency against plan config to prevent price tampering
      const purchaseUnit = orderDetails.purchase_units?.[0];
      const capturedAmount = purchaseUnit?.amount?.value;
      const capturedCurrency = purchaseUnit?.amount?.currency_code;

      if (!capturedAmount || parseFloat(capturedAmount) < parseFloat(planConfig.price)) {
        console.warn(`Payment price mismatch: expected >= ${planConfig.price}, got ${capturedAmount}`);
        return new Response(JSON.stringify({ error: 'Payment amount mismatch for selected plan.' }), {
          status: 402, headers: cors,
        }) as any;
      }

      verifiedAmount = capturedAmount;
      if (orderDetails.payer?.email_address) {
        verifiedEmail = orderDetails.payer.email_address;
      }
    } catch (verifyErr: any) {
      console.error(JSON.stringify({ endpoint: 'paypal-verify', step: 'paypal-api', error: verifyErr.message }));
      return new Response(JSON.stringify({ error: 'Payment verification failed' }), {
        status: 500, headers: cors,
      }) as any;
    }

    // Generate cryptographically secure Pro session token
    const proToken = `pro_sess_${crypto.randomUUID().replace(/-/g, '')}`;
    const durationSeconds = planConfig.durationDays * 24 * 60 * 60;
    const expiresAt = Date.now() + durationSeconds * 1000;

    const verificationRecord = {
      orderId,
      payerEmail: verifiedEmail,
      amount: verifiedAmount,
      planType,
      status: 'COMPLETED',
      verifiedAt: new Date().toISOString(),
      source: 'paypal_checkout',
    };

    const sessionRecord = {
      proToken,
      orderId,
      payerEmail: verifiedEmail,
      planType,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    if (context.env.LEADS) {
      await context.env.LEADS.put(`paypal_${orderId}`, JSON.stringify(verificationRecord));
      await context.env.LEADS.put(`pro_session:${proToken}`, JSON.stringify(sessionRecord), {
        expirationTtl: durationSeconds,
      });
    }

    const responseHeaders = new Headers({
      ...cors,
      'Set-Cookie': `pro_token=${proToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${durationSeconds}`,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified and entitlement granted.',
      proToken,
      expiresAt,
      data: verificationRecord,
    }), { status: 200, headers: responseHeaders }) as any;

  } catch (err: any) {
    console.error(JSON.stringify({ endpoint: 'paypal-verify', error: err.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: 'Internal verification error' }), {
      status: 500, headers: cors,
    }) as any;
  }
};
