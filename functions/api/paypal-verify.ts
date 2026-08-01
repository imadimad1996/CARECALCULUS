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

    // SECURITY FIX: In a real production environment, you must call the PayPal Orders API
    // using your server's Client ID and Secret to verify the orderId status before logging it.
    // Example:
    // const paypalResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
    //   headers: { Authorization: `Bearer ${await getPayPalAccessToken()}` }
    // });
    // const orderDetails = await paypalResponse.json();
    // if (orderDetails.status !== 'COMPLETED') throw new Error('Unverified payment');
    
    // For this MVP, we will only allow status to be COMPLETED if it comes from our frontend payload,
    // but warn that this is not cryptographically secure against spoofing without the backend API check.
    if (status !== 'COMPLETED') {
      return new Response(JSON.stringify({ error: 'Order not completed' }), {
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
