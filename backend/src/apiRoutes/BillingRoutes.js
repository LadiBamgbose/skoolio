import { Router } from 'express';
import stripe from '../services/stripeService.js';
import prisma from '../services/prisma.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const PLAN_TO_PRICE = {
  teacher: process.env.STRIPE_PRICE_TEACHER,
  advanced: process.env.STRIPE_PRICE_ADVANCED,
};

// Create checkout session - PROTECTED
router.post('/checkout-session', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body || {};
    const userId = req.user.userId; // From auth middleware
    const userEmail = req.user.email; // From auth middleware
    
    const priceId = PLAN_TO_PRICE[plan];

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid or missing plan' });
    }

    // Check if user already has active subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, stripeCustomerId: true }
    });

    if (user.subscriptionStatus === 'ACTIVE') {
      return res.status(400).json({ error: 'You already have an active subscription' });
    }

    const success_url = `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${process.env.APP_URL}/billing/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      //automatic_tax: { enabled: true },
      customer_email: userEmail,
      customer: user.stripeCustomerId || undefined, // Reuse customer if exists
      metadata: {
        userId: userId.toString(), // Session metadata - accessible in webhook
      },
      subscription_data: {
        metadata: { userId: userId.toString() }, // Subscription metadata - for later
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get subscription status - PROTECTED
router.get('/subscription/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        stripeCustomerId: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      currentPeriodEnd: user.currentPeriodEnd,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd,
      hasActiveSubscription: user.subscriptionStatus === 'ACTIVE',
    });
  } catch (err) {
    console.error('Get subscription status error:', err);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// Create customer portal session - PROTECTED
router.post('/customer-portal', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    });

    if (!user || !user.stripeCustomerId) {
      console.error(`User ${userId} has no stripeCustomerId`);
      return res.status(400).json({ error: 'No subscription found' });
    }

    console.log(`Creating portal session for customer: ${user.stripeCustomerId}`);

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.APP_URL}/teacher/settings`,
    });

    console.log(`✅ Portal session created successfully: ${session.id}`);
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Customer portal error:', err);
    console.error('Error type:', err.type);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    
    // Return more detailed error info in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Failed to create portal session';
    
    res.status(500).json({ 
      error: errorMessage,
      hint: 'Make sure Stripe Customer Portal is activated in your Dashboard'
    });
  }
});

export default router;
