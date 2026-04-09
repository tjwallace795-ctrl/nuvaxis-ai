import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 200 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email   = session.customer_email ?? session.customer_details?.email;
    const planId  = (session.metadata?.planId) ?? "";

    if (email) {
      // Mark the user's subscription active in Supabase
      await supabase
        .from("profiles")
        .update({
          stripe_customer_id:    session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan:    planId,
          plan_status: "trialing",
        })
        .eq("email", email);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub    = event.data.object as Stripe.Subscription;
    const custId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    await supabase
      .from("profiles")
      .update({ plan_status: sub.status })
      .eq("stripe_customer_id", custId);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub    = event.data.object as Stripe.Subscription;
    const custId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    await supabase
      .from("profiles")
      .update({ plan: null, plan_status: "canceled" })
      .eq("stripe_customer_id", custId);
  }

  return new Response("ok", { status: 200 });
}
