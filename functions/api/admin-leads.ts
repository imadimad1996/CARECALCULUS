import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';
import { getCorsHeaders, handleCorsOptions } from '../_cors';

interface Env {
  LEADS: KVNamespace;
  ADMIN_SECRET?: string;
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return handleCorsOptions(context.request as any);
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cors = getCorsHeaders(context.request as any);
  try {
    const ADMIN_SECRET = context.env.ADMIN_SECRET;
    if (!ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: 'Admin secret not configured on server.' }), {
        status: 500, headers: cors,
      });
    }

    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: cors,
      });
    }

    if (!context.env.LEADS) {
      return new Response(JSON.stringify({
        status: 'demo_mode',
        message: 'LEADS KV namespace not bound. Configure in Cloudflare Pages dashboard.',
      }), { status: 200, headers: cors });
    }

    // List all three KV prefixes with a safe limit of 100 items each
    const [subList, b2bList, paypalList] = await Promise.all([
      context.env.LEADS.list({ prefix: 'lead:', limit: 100 }),
      context.env.LEADS.list({ prefix: 'b2b_lead:', limit: 100 }),
      context.env.LEADS.list({ prefix: 'paypal_', limit: 100 }),
    ]);

    // Batch parallel fetches instead of slow serial for loops
    const fetchBatch = async (keys: { name: string }[]) => {
      const records = await Promise.all(
        keys.map(async (key) => {
          const val = await context.env.LEADS.get(key.name);
          if (!val) return null;
          try {
            return JSON.parse(val);
          } catch {
            return { key: key.name, raw: val };
          }
        })
      );
      return records.filter(Boolean);
    };

    const [subscribers, b2bLeads, payments] = await Promise.all([
      fetchBatch(subList.keys),
      fetchBatch(b2bList.keys),
      fetchBatch(paypalList.keys),
    ]);

    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      subscribers: { total: subscribers.length, data: subscribers },
      b2b_leads: { total: b2bLeads.length, data: b2bLeads },
      payments: { total: payments.length, data: payments },
    }, null, 2), {
      status: 200,
      headers: { ...cors, 'Cache-Control': 'no-store' },
    });

  } catch (error: any) {
    console.error(JSON.stringify({ endpoint: 'admin-leads', error: error.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: 'Server error retrieving admin leads' }), {
      status: 500, headers: cors,
    });
  }
};
