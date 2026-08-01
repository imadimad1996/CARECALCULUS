import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LEADS: KVNamespace;
  ADMIN_SECRET?: string;
}

const CORS = {
  'Access-Control-Allow-Origin': 'https://carecalculus.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    // Require ADMIN_SECRET to be set as a Cloudflare Pages environment variable.
    // Do NOT provide a hardcoded fallback — this would expose all lead data.
    const ADMIN_SECRET = context.env.ADMIN_SECRET;
    if (!ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: 'Admin secret not configured on server.' }), {
        status: 500, headers: CORS,
      });
    }

    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: CORS,
      });
    }

    if (!context.env.LEADS) {
      return new Response(JSON.stringify({
        status: 'demo_mode',
        message: 'LEADS KV namespace not bound. Configure in Cloudflare Pages dashboard.',
      }), { status: 200, headers: CORS });
    }

    // List all three KV prefixes: subscribers, B2B leads, PayPal records
    const [subList, b2bList, paypalList] = await Promise.all([
      context.env.LEADS.list({ prefix: 'lead:' }),
      context.env.LEADS.list({ prefix: 'b2b_lead:' }),
      context.env.LEADS.list({ prefix: 'paypal_' }),
    ]);

    const fetchAll = async (keys: typeof subList.keys) => {
      const results = [];
      for (const key of keys) {
        const val = await context.env.LEADS.get(key.name);
        if (val) {
          try { results.push(JSON.parse(val)); }
          catch { results.push({ key: key.name, raw: val }); }
        }
      }
      return results;
    };

    const [subscribers, b2bLeads, payments] = await Promise.all([
      fetchAll(subList.keys),
      fetchAll(b2bList.keys),
      fetchAll(paypalList.keys),
    ]);

    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      subscribers: { total: subscribers.length, data: subscribers },
      b2b_leads: { total: b2bLeads.length, data: b2bLeads },
      payments: { total: payments.length, data: payments },
    }, null, 2), {
      status: 200,
      headers: { ...CORS, 'Cache-Control': 'no-store' },
    });

  } catch (error: any) {
    console.error(JSON.stringify({ endpoint: 'admin-leads', error: error.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: CORS,
    });
  }
};
