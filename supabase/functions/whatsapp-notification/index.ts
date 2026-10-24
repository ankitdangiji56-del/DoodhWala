import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

// Server-side environment secrets (never sent to the frontend)
const WHATSAPP_CLOUD_API_TOKEN = Deno.env.get('WHATSAPP_CLOUD_API_TOKEN');
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
const ADMIN_ALERT_PHONE_NUMBER = Deno.env.get('ADMIN_ALERT_PHONE_NUMBER');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface NotificationPayload {
  orderId?: string;
  recipientPhone: string;
  eventType:
    | 'order_placed'
    | 'order_confirmed'
    | 'out_for_delivery'
    | 'delivered'
    | 'ready_for_pickup'
    | 'order_cancelled'
    | 'admin_alert';
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  deliverySlot?: string;
  addressSummary?: string;
}

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();

    if (!payload.recipientPhone || !payload.orderNumber) {
      return new Response(
        JSON.stringify({ error: 'recipientPhone and orderNumber are required fields.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if real Meta WhatsApp Cloud API credentials are configured
    const isProviderConfigured = Boolean(WHATSAPP_CLOUD_API_TOKEN && WHATSAPP_PHONE_NUMBER_ID);

    if (!isProviderConfigured) {
      // In development / pre-configuration: log mock result and return safely without failing orders
      const mockResult = {
        status: 'mock_logged',
        message: 'WhatsApp Cloud API token or Phone Number ID not yet configured in server secrets.',
        payloadPreview: {
          recipient: payload.recipientPhone,
          eventType: payload.eventType,
          orderNumber: payload.orderNumber,
        },
        instruction: 'Configure WHATSAPP_CLOUD_API_TOKEN in Supabase Edge Function Secrets for live delivery.',
      };

      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format phone number to E.164 without '+' or spaces
    const cleanPhone = payload.recipientPhone.replace(/\D/g, '');

    // Map internal eventType to approved Meta Cloud API template
    // Standard template structure per Meta Business policy
    const templateName = `doodhwala_${payload.eventType}`;
    const parameters = [
      { type: 'text', text: payload.customerName },
      { type: 'text', text: payload.orderNumber },
      { type: 'text', text: `₹${payload.totalAmount}` },
      { type: 'text', text: payload.deliverySlot || 'Morning 6:00 AM – 8:30 AM' },
    ];

    const metaApiUrl = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const metaResponse = await fetch(metaApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_CLOUD_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: parameters,
            },
          ],
        },
      }),
    });

    const providerData = await metaResponse.json();

    // Persist to notification_outbox if Supabase client available
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabaseAdmin.from('notification_outbox').insert({
        recipient_phone: cleanPhone,
        template_name: templateName,
        template_params: { parameters },
        status: metaResponse.ok ? 'sent' : 'failed',
        provider_response: providerData,
      });
    }

    return new Response(JSON.stringify({ success: metaResponse.ok, data: providerData }), {
      status: metaResponse.ok ? 200 : 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal notification dispatch error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
