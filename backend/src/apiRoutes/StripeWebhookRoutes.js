import { Router } from 'express';
import stripe from '../services/stripeService.js';
import prisma from '../services/prisma.js';

const router = Router();

// Webhook handler - receives Stripe events
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type} - ignoring`);
        // Don't throw error for unhandled events, just log and continue
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    console.error('Event type:', event.type);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle successful checkout
async function handleCheckoutCompleted(session) {
  try {
    console.log('🎉 Checkout session completed!');
    
    const { customer, subscription, metadata } = session;
    const userId = metadata?.userId;

    if (!userId) {
      console.error('❌ No userId in checkout session metadata');
      return;
    }

    console.log(`✅ Processing subscription for user ${userId}`);

    // Get subscription details to determine plan
    const subscriptionData = await stripe.subscriptions.retrieve(subscription);
    const priceId = subscriptionData.items.data[0].price.id;

    // Determine plan based on price ID
    let plan = 'TEACHER';
    if (priceId === process.env.STRIPE_PRICE_ADVANCED) {
      plan = 'ADVANCED';
    }

    console.log(`📦 Updating user to plan: ${plan}`);
    console.log('Period end timestamp:', subscriptionData.current_period_end);

    // Convert timestamp to Date (handle null/undefined)
    const periodEnd = subscriptionData.current_period_end 
      ? new Date(subscriptionData.current_period_end * 1000)
      : null;

    console.log('Period end date:', periodEnd);

    // Update user with subscription info
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        stripeCustomerId: customer,
        stripeSubscriptionId: subscription,
        subscriptionStatus: 'ACTIVE',
        plan: plan,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    console.log(`✅ SUCCESS! User ${userId} upgraded to ${updatedUser.plan}`);
    console.log(`   Subscription Status: ${updatedUser.subscriptionStatus}`);
  } catch (error) {
    console.error('❌ Error in handleCheckoutCompleted:', error);
    throw error; // Re-throw to be caught by main handler
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  const { customer, id, status, current_period_end, cancel_at_period_end } = subscription;

  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customer },
  });

  if (!user) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  // Map Stripe status to our enum
  let subscriptionStatus = 'ACTIVE';
  if (status === 'past_due') {
    subscriptionStatus = 'PAST_DUE';
  } else if (status === 'canceled') {
    subscriptionStatus = 'CANCELED';
  } else if (status === 'incomplete' || status === 'incomplete_expired') {
    subscriptionStatus = 'INCOMPLETE';
  } else if (status === 'trialing') {
    subscriptionStatus = 'TRIALING';
  }

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus,
      currentPeriodEnd: new Date(current_period_end * 1000),
      cancelAtPeriodEnd: cancel_at_period_end,
    },
  });

  console.log(`Subscription updated for user ${user.id}: ${status}`);
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  const { customer } = subscription;

  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customer },
  });

  if (!user) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  // Downgrade to free plan
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: 'BASIC',
      subscriptionStatus: 'CANCELED',
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
  });

  console.log(`Subscription deleted, user ${user.id} downgraded to BASIC`);
}

// Handle failed payments
async function handlePaymentFailed(invoice) {
  const { customer, subscription } = invoice;

  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customer },
  });

  if (!user) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  // Mark subscription as past due
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'PAST_DUE',
    },
  });

  console.log(`Payment failed for user ${user.id}, marked as PAST_DUE`);
}

export default router;

