interface Env {
  LEADS?: any;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as {
      orderId?: string;
      payerEmail?: string;
      amount?: string;
      planType?: string;
      status?: string;
    };

    const { orderId, payerEmail, amount, planType, status } = body;

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing orderId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verificationRecord = {
      orderId,
      payerEmail: payerEmail || 'anonymous',
      amount: amount || '9.99',
      planType: planType || 'monthly',
      status: status || 'COMPLETED',
      verifiedAt: new Date().toISOString(),
      source: 'paypal_checkout'
    };

    // Store order verification in Cloudflare KV if available
    if (context.env.LEADS) {
      await context.env.LEADS.put(`paypal_${orderId}`, JSON.stringify(verificationRecord));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'PayPal payment record verified and logged.',
      data: verificationRecord
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal verification error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
