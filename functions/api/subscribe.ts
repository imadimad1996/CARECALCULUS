import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';
import { getCorsHeaders, handleCorsOptions } from '../_cors';

interface Env {
  LEADS: KVNamespace;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lightweight IP-based rate limiting: max 3 requests per IP per 10 minutes
async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  if (!env.LEADS) return false;
  const key = `ratelimit_subscribe:${ip}`;
  const existing = await env.LEADS.get(key);
  const count = existing ? parseInt(existing, 10) : 0;
  if (count >= 3) return true;
  await env.LEADS.put(key, String(count + 1), { expirationTtl: 600 }); // 10 min TTL
  return false;
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
      });
    }

    const data = await context.request.json<{ email: string; lang: string }>();

    if (!data.email || !EMAIL_REGEX.test(data.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400, headers: cors,
      });
    }

    const leadData = {
      email: data.email,
      lang: data.lang || 'en',
      timestamp: new Date().toISOString(),
      source: 'carecalculus_lead_magnet',
    };

    const kvKey = `lead:${data.email.toLowerCase()}`;
    if (context.env.LEADS) {
      await context.env.LEADS.put(kvKey, JSON.stringify(leadData));
    } else {
      console.warn('LEADS KV namespace not bound. Simulating save:', leadData);
    }

    return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
      status: 200, headers: cors,
    });

  } catch (error: any) {
    console.error(JSON.stringify({ endpoint: 'subscribe', error: error.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: 'Server error processing subscription' }), {
      status: 500, headers: cors,
    });
  }
};
