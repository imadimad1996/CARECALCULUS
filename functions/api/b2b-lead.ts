import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LEADS: KVNamespace;
  DISCORD_WEBHOOK_URL?: string;
}

const CORS = {
  'Access-Control-Allow-Origin': 'https://carecalculus.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lightweight IP-based rate limiting: max 3 requests per IP per 10 minutes
async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  if (!env.LEADS) return false;
  const key = `ratelimit_b2b:${ip}`;
  const existing = await env.LEADS.get(key);
  const count = existing ? parseInt(existing, 10) : 0;
  if (count >= 3) return true;
  await env.LEADS.put(key, String(count + 1), { expirationTtl: 600 }); // 10 min TTL
  return false;
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await isRateLimited(context.env, ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429, headers: CORS,
      });
    }

    const data = await context.request.json<{
      firstName: string;
      lastName: string;
      workEmail: string;
      hospitalName: string;
      ehrSystem: string;
      role: string;
    }>();

    if (!data.workEmail || !EMAIL_REGEX.test(data.workEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400, headers: CORS,
      });
    }

    const leadData = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'carecalculus_b2b_demo',
    };

    const kvKey = `b2b_lead:${data.workEmail.toLowerCase()}`;
    if (context.env.LEADS) {
      await context.env.LEADS.put(kvKey, JSON.stringify(leadData));
    } else {
      console.warn('LEADS KV namespace not bound. Simulating save:', leadData);
    }

    // Send Discord Webhook Notification if configured
    if (context.env.DISCORD_WEBHOOK_URL) {
      try {
        const message = {
          content: `🚨 **New B2B Enterprise Lead** 🚨\n**Name:** ${data.firstName} ${data.lastName}\n**Email:** ${data.workEmail}\n**Hospital:** ${data.hospitalName}\n**EHR:** ${data.ehrSystem}\n**Role:** ${data.role}`,
        };
        await fetch(context.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
      } catch (webhookErr) {
        console.error('Failed to send discord webhook:', webhookErr);
        // We don't fail the request if the webhook fails
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'B2B lead received successfully' }), {
      status: 200, headers: CORS,
    });

  } catch (error: any) {
    console.error(JSON.stringify({ endpoint: 'b2b-lead', error: error.message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: 'Server error processing B2B lead' }), {
      status: 500, headers: CORS,
    });
  }
};
