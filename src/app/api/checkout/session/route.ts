import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PLANS: Record<string, {
  name: string;
  monthlyAmount: number;
  buildFeeAmount: number;
  description: string;
}> = {
  starter: {
    name: "Starter — Web Presence",
    monthlyAmount: 7500,        // $75.00 in cents
    buildFeeAmount: 20000,      // $200.00 in cents
    description: "Up to 5-page website, SEO, AI chatbot, order management",
  },
  "solo-pro": {
    name: "Solo Pro",
    monthlyAmount: 14900,       // $149.00 in cents
    buildFeeAmount: 35000,      // $350.00 in cents
    description: "8-page website + AI chatbot that handles inquiries 24/7",
  },
  business: {
    name: "Business — Business Revamp",
    monthlyAmount: 24900,       // $249.00 in cents
    buildFeeAmount: 59900,      // $599.00 in cents
    description: "15-page site, AI chatbot, order management, local SEO",
  },
  premium: {
    name: "Premium — Growth Partner",
    monthlyAmount: 44900,       // $449.00 in cents
    buildFeeAmount: 99900,      // $999.00 in cents
    description: "Unlimited pages, custom AI tools, bi-weekly strategy calls",
  },
};

export async function POST(req: Request) {
  try {
    const { planId, customerEmail } = await req.json() as {
      planId: string;
      customerEmail?: string;
    };

    const plan = PLANS[planId];
    if (!plan) {
      return Response.json({ error: "Invalid plan." }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://nuvaxisai.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: customerEmail || undefined,

      // Apple Pay + Google Pay + card — Stripe enables wallet payments automatically
      payment_method_types: ["card"],

      line_items: [
        // Monthly subscription (7-day free trial)
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} — Monthly`,
              description: plan.description,
            },
            unit_amount: plan.monthlyAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],

      subscription_data: {
        trial_period_days: 7,
        metadata: { planId },
      },

      allow_promotion_codes: true,

      success_url: `${origin}/dashboard?welcome=1&plan=${planId}`,
      cancel_url:  `${origin}/#pricing`,
    });

    return Response.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Checkout error.";
    console.error("Stripe checkout error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
