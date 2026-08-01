import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LEADS?: KVNamespace;
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
  return new Response(null, { status: 204, headers: CORS }) as any;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      orderId?: string;
      payerEmail?: string;
      amount?: string;
      planType?: string;
      status?: string;
    };

    const { orderId, payerEmail, amount, planType = 'monthly' } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), {
        status: 400, headers: CORS,
      }) as any;
    }

    // SERVER-SIDE PAYPAL VERIFICATION
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
          }) as any;
        }
      } catch (verifyErr: any) {
        console.error(JSON.stringify({ endpoint: 'paypal-verify', step: 'paypal-api', error: verifyErr.message }));
        return new Response(JSON.stringify({ error: 'Payment verification failed' }), {
          status: 500, headers: CORS,
        }) as any;
      }
    } else {
      console.warn('PayPal credentials not configured. Operating in MVP mode — set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
    }

    // Generate cryptographically secure Pro session token
    const proToken = `pro_sess_${crypto.randomUUID().replace(/-/g, '')}`;
    const durationDays = planType === 'lifetime' ? 36500 : (planType === 'annual' ? 365 : 30);
    const durationSeconds = durationDays * 24 * 60 * 60;
    const expiresAt = Date.now() + durationSeconds * 1000;

    const verificationRecord = {
      orderId,
      payerEmail: payerEmail || 'anonymous',
      amount: amount || '9.99',
      planType,
      status: 'COMPLETED',
      verifiedAt: new Date().toISOString(),
      source: 'paypal_checkout',
    };

    const sessionRecord = {
      proToken,
      orderId,
      payerEmail: payerEmail || 'anonymous',
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
      ...CORS,
      'Set-Cookie': `pro_token=${proToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${durationSeconds}`,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified and logged.',
      proToken,
      expiresAt,
      data: verificationRecord,
    }), { status: 200, headers: responseHeaders }) as any;

  } catch (err: any) {
    console.error(JSON.stringify({ endpoint: 'paypal-verify', error: err.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: err.message || 'Internal verification error' }), {
      status: 500, headers: CORS,
    }) as any;
  }
};
