import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LEADS?: KVNamespace;
}

const CORS = {
  'Access-Control-Allow-Origin': 'https://carecalculus.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS }) as any;
};

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const authHeader = context.request.headers.get('Authorization');
    const cookieHeader = context.request.headers.get('Cookie');
    
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (cookieHeader) {
      const match = cookieHeader.match(/pro_token=([^;]+)/);
      if (match) token = match[1].trim();
    }

    if (!token) {
      return new Response(JSON.stringify({ active: false, reason: 'No token provided' }), {
        status: 200, headers: CORS,
      }) as any;
    }

    if (!context.env.LEADS) {
      return new Response(JSON.stringify({ active: false, reason: 'KV store unavailable' }), {
        status: 200, headers: CORS,
      }) as any;
    }

    const sessionDataRaw = await context.env.LEADS.get(`pro_session:${token}`);
    if (!sessionDataRaw) {
      return new Response(JSON.stringify({ active: false, reason: 'Invalid or expired session token' }), {
        status: 200, headers: CORS,
      }) as any;
    }

    const session = JSON.parse(sessionDataRaw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      await context.env.LEADS.delete(`pro_session:${token}`);
      return new Response(JSON.stringify({ active: false, reason: 'Session expired' }), {
        status: 200, headers: CORS,
      }) as any;
    }

    return new Response(JSON.stringify({
      active: true,
      planType: session.planType || 'monthly',
      expiresAt: session.expiresAt,
      payerEmail: session.payerEmail ? session.payerEmail.replace(/(.{2})(.*)(?=@)/, '$1***') : undefined,
    }), {
      status: 200, headers: CORS,
    }) as any;

  } catch (err: any) {
    console.error(JSON.stringify({ endpoint: 'verify-pro', error: err.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ active: false, error: err.message }), {
      status: 500, headers: CORS,
    }) as any;
  }
};
