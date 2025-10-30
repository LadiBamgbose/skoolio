import ApiHandler from '../utils/ApiHandler';

export interface SubscriptionStatus {
  plan: 'BASIC' | 'TEACHER' | 'ADVANCED';
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING' | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasActiveSubscription: boolean;
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

class BillingService {
  
  // Create Stripe checkout session for subscription
  static async createCheckoutSession(plan: 'teacher' | 'advanced'): Promise<CheckoutSessionResponse> {
    try {
      const response: any = await ApiHandler.post('/billing/checkout-session', { plan });
      return response;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Get current user's subscription status
  static async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response: any = await ApiHandler.get('/billing/subscription/status');
      return response;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error;
    }
  }

  // Create Stripe customer portal session for managing subscription
  static async createPortalSession(): Promise<PortalSessionResponse> {
    try {
      const response: any = await ApiHandler.post('/billing/customer-portal', {});
      return response;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }
}

export default BillingService;

