// @ts-nocheck
interface Env {
  LEADS: KVNamespace;
  // RESEND_API_KEY could be used here to trigger real emails
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{ email: string; lang: string }>();
    
    if (!data.email || !data.email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const leadData = {
      email: data.email,
      lang: data.lang || 'en',
      timestamp: new Date().toISOString(),
      source: 'carecalculus_lead_magnet',
    };

    // Store in KV using email as key to implicitly deduplicate
    const kvKey = `lead:${data.email.toLowerCase()}`;
    
    // In local development or if KV binding isn't set up yet, context.env.LEADS might be undefined
    if (context.env.LEADS) {
      await context.env.LEADS.put(kvKey, JSON.stringify(leadData));
    } else {
      console.warn('LEADS KV namespace not bound. Simulate saving:', leadData);
    }

    return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error processing subscription' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
