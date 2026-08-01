// @ts-nocheck
interface Env {
  LEADS: KVNamespace;
  ADMIN_SECRET?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const authHeader = context.request.headers.get('Authorization');
    // Basic protection against unauthenticated dumping of all user emails
    // In production, configure ADMIN_SECRET in Cloudflare Pages environment variables
    const ADMIN_SECRET = context.env.ADMIN_SECRET || 'carecalculus_temp_admin_secret_2026';
    
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!context.env.LEADS) {
      return new Response(JSON.stringify({ 
        status: 'demo_mode', 
        message: 'LEADS KV namespace not bound locally. Bind KV namespace in Cloudflare Pages dashboard.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // List all lead keys from KV namespace
    const listResult = await context.env.LEADS.list({ prefix: 'lead:' });
    const leads = [];

    for (const key of listResult.keys) {
      const leadJson = await context.env.LEADS.get(key.name);
      if (leadJson) {
        try {
          leads.push(JSON.parse(leadJson));
        } catch (e) {
          leads.push({ key: key.name, raw: leadJson });
        }
      }
    }

    return new Response(JSON.stringify({
      total: leads.length,
      leads: leads,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
