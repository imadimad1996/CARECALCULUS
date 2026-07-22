// @ts-nocheck
interface Env {
  LEADS: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
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
