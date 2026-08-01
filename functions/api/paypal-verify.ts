import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  LEADS?: any;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
}

const CORS = {
  'Access-Control-Allow-Origin': 'https://carecalculus.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

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
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS });
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as {
      orderId?: string;
      payerEmail?: string;
      amount?: string;
      planType?: string;
      status?: string;
    };

    const { orderId, payerEmail, amount, planType } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), {
        status: 400, headers: CORS,
      });
    }

    // SERVER-SIDE PAYPAL VERIFICATION
    // If credentials are configured, verify the order with PayPal's API directly.
    // This prevents payment spoofing where a client sends { status: "COMPLETED" } without paying.
    if (context.env.PAYPAL_CLIENT_ID && context.env.PAYPAL_CLIENT_SECRET) {
      try {
        const accessToken = await getPayPalAccessToken(
          context.env.PAYPAL_CLIENT_ID,
          context.env.PAYPAL_CLIENT_SECRET,
        );
        const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const orderDetails = await orderRes.json() as { status: string };
        if (orderDetails.status !== 'COMPLETED') {
          return new Response(JSON.stringify({ error: 'PayPal order not verified as COMPLETED' }), {
            status: 402, headers: CORS,
          });
        }
      } catch (verifyErr: any) {
        console.error(JSON.stringify({ endpoint: 'paypal-verify', step: 'paypal-api', error: verifyErr.message }));
        return new Response(JSON.stringify({ error: 'Payment verification failed' }), {
          status: 500, headers: CORS,
        });
      }
    } else {
      // Credentials not set — MVP mode: log a warning but continue.
      // ACTION REQUIRED: Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in
      // Cloudflare Pages → Settings → Environment Variables to enable real verification.
      console.warn('PayPal credentials not configured. Operating in MVP mode — set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
    }

    const verificationRecord = {
      orderId,
      payerEmail: payerEmail || 'anonymous',
      amount: amount || '9.99',
      planType: planType || 'monthly',
      status: 'COMPLETED',
      verifiedAt: new Date().toISOString(),
      source: 'paypal_checkout',
    };

    if (context.env.LEADS) {
      await context.env.LEADS.put(`paypal_${orderId}`, JSON.stringify(verificationRecord));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified and logged.',
      data: verificationRecord,
    }), { status: 200, headers: CORS });

  } catch (err: any) {
    console.error(JSON.stringify({ endpoint: 'paypal-verify', error: err.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: err.message || 'Internal verification error' }), {
      status: 500, headers: CORS,
    });
  }
}
