import type { PagesFunction, KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LEADS: KVNamespace;
  DISCORD_WEBHOOK_URL?: string;
  MAILTRAP_TOKEN?: string;
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

// @ts-ignore - Bypassing DOM vs Cloudflare Response type mismatch
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS });
};

// @ts-ignore - Bypassing DOM vs Cloudflare Response type mismatch
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

    // Send Automated Welcome Email via Mailtrap
    if (context.env.MAILTRAP_TOKEN) {
      try {
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2 style="color: #0f172a;">Welcome to CareCalculus Enterprise, ${data.firstName}!</h2>
            <p>Thank you for requesting sandbox access for <strong>${data.hospitalName}</strong>. Our enterprise support team has received your request and will contact you as soon as possible to activate your environment.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <h3 style="color: #0f172a;">How the Pro Plan for Hospitals Works</h3>
            <p>We designed our enterprise offering to be completely frictionless. Instead of managing individual licenses, we simply whitelist your hospital's email domains.</p>
            <p>Once activated, <strong>every single clinician, nurse, and medical student at your institution gets unlimited access to CareCalculus Pro</strong>—including our automated EHR SOAP note generation and export tools—automatically.</p>
            <p>We look forward to partnering with your clinical teams to streamline bedside workflows.</p>
            <br/>
            <p>Best regards,<br><strong>The CareCalculus Team</strong></p>
          </div>
        `;
        
        await fetch("https://send.api.mailtrap.io/api/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${context.env.MAILTRAP_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: { email: "hello@carecalculus.com", name: "CareCalculus Team" },
            to: [{ email: data.workEmail }],
            subject: "Welcome to CareCalculus Enterprise",
            html: emailHtml
          })
        });
      } catch (emailErr) {
        console.error('Failed to send welcome email:', emailErr);
      }
    }

    // Send Discord Webhook Notification if configured
    const discordWebhook = context.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1537465736421707938/U_HDEx6z6Bhpdv5P_t5X3BO9E29dKPuoX5z762qEGNF9YS1pwnqXZi2vMx7p8ntmY_To';
    if (discordWebhook) {
      try {
        const message = {
          content: `🚨 **New B2B Enterprise Lead** 🚨\n**Name:** ${data.firstName} ${data.lastName}\n**Email:** ${data.workEmail}\n**Hospital:** ${data.hospitalName}\n**EHR:** ${data.ehrSystem}\n**Role:** ${data.role}`,
        };
        await fetch(discordWebhook, {
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
