// @ts-nocheck
interface Env {
  LEADS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{ 
      firstName: string; 
      lastName: string;
      workEmail: string;
      hospitalName: string;
      ehrSystem: string;
      role: string;
    }>();
    
    if (!data.workEmail || !data.workEmail.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const leadData = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'carecalculus_b2b_demo',
    };

    // Store in KV using email as key to implicitly deduplicate
    const kvKey = `b2b_lead:${data.workEmail.toLowerCase()}`;
    
    if (context.env.LEADS) {
      await context.env.LEADS.put(kvKey, JSON.stringify(leadData));
    } else {
      console.warn('LEADS KV namespace not bound. Simulate saving:', leadData);
    }

    return new Response(JSON.stringify({ success: true, message: 'B2B Lead received successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error processing B2B lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
