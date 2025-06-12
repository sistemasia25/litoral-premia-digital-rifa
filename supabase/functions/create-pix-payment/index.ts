
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { saleData } = await req.json();
    
    console.log('Creating payment for:', saleData);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Calcular valor baseado na quantidade
    const getTicketPrice = (qty: number) => {
      if (qty >= 10) return 0.99;
      return 1.99;
    };
    
    const ticketPrice = getTicketPrice(saleData.quantity);
    const totalAmount = Math.round((saleData.quantity * ticketPrice) * 100); // Converter para centavos

    // Criar sessão de pagamento Stripe com métodos brasileiros
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `${saleData.quantity} números da rifa`,
              description: `Compra de ${saleData.quantity} números para ${saleData.name}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/sucesso-pagamento?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      customer_email: saleData.whatsapp ? `${saleData.whatsapp.replace(/\D/g, '')}@temp.com` : undefined,
      metadata: {
        customer_name: saleData.name,
        customer_whatsapp: saleData.whatsapp,
        customer_city: saleData.city,
        quantity: saleData.quantity.toString(),
        ticket_price: ticketPrice.toString(),
      },
      locale: 'pt-BR',
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
    });

    console.log('Stripe session created:', session.id);

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      paymentUrl: session.url,
      amount: totalAmount,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erro ao criar sessão de pagamento. Verifique se sua conta Stripe está configurada corretamente.'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
