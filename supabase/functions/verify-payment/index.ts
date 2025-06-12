
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
    const { sessionId } = await req.json();
    
    console.log('Verifying payment for session:', sessionId);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Verificar status da sessão
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('Session status:', session.payment_status);

    if (session.payment_status === 'paid') {
      // Gerar números aleatórios para a venda
      const quantity = parseInt(session.metadata?.quantity || '1');
      const generatedNumbers = Array.from({ length: quantity }, () => 
        Math.floor(1000 + Math.random() * 9000).toString()
      );

      // Verificar se há prêmios (simulação)
      const hasPrize = Math.random() > 0.7;
      const prizes = hasPrize ? [
        {
          number: generatedNumbers[0],
          prize: 'R$ 100,00',
          description: 'Prêmio especial para o primeiro número sorteado!'
        }
      ] : [];

      return new Response(JSON.stringify({
        paid: true,
        customerName: session.metadata?.customer_name,
        customerWhatsApp: session.metadata?.customer_whatsapp,
        customerCity: session.metadata?.customer_city,
        quantity: quantity,
        numbers: generatedNumbers,
        prizes: prizes,
        amount: session.amount_total / 100, // Converter de centavos para reais
        paymentMethod: 'pix',
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({
      paid: false,
      status: session.payment_status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
