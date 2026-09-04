import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';
import { getCorsHeaders, handleCorsOptions } from '../_cors';

interface Env {
  LEADS?: KVNamespace;
}

async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  if (!env.LEADS) return false;
  const key = `ratelimit_verify_pro:${ip}`;
  const existing = await env.LEADS.get(key);
  const count = existing ? parseInt(existing, 10) : 0;
  if (count >= 30) return true;
  await env.LEADS.put(key, String(count + 1), { expirationTtl: 600 });
  return false;
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return handleCorsOptions(context.request as any);
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const cors = getCorsHeaders(context.request as any);
  try {
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await isRateLimited(context.env, ip)) {
      return new Response(JSON.stringify({ active: false, reason: 'Rate limit exceeded' }), {
        status: 429, headers: cors,
      }) as any;
    }

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
        status: 200, headers: cors,
      }) as any;
    }

    if (!context.env.LEADS) {
      return new Response(JSON.stringify({ active: false, reason: 'KV store unavailable' }), {
        status: 200, headers: cors,
      }) as any;
    }

    const sessionDataRaw = await context.env.LEADS.get(`pro_session:${token}`);
    if (!sessionDataRaw) {
      return new Response(JSON.stringify({ active: false, reason: 'Invalid or expired session token' }), {
        status: 200, headers: cors,
      }) as any;
    }

    const session = JSON.parse(sessionDataRaw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      await context.env.LEADS.delete(`pro_session:${token}`);
      return new Response(JSON.stringify({ active: false, reason: 'Session expired' }), {
        status: 200, headers: cors,
      }) as any;
    }

    return new Response(JSON.stringify({
      active: true,
      planType: session.planType || 'annual',
      expiresAt: session.expiresAt,
      payerEmail: session.payerEmail ? session.payerEmail.replace(/(.{2})(.*)(?=@)/, '$1***') : undefined,
    }), {
      status: 200, headers: cors,
    }) as any;

  } catch (err: any) {
    console.error(JSON.stringify({ endpoint: 'verify-pro', error: err.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ active: false, error: 'Verification error' }), {
      status: 500, headers: cors,
    }) as any;
  }
};
