import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
const token = import.meta.env.VITE_MIXPANEL_TOKEN;
const isDev = import.meta.env.VITE_APP_ENV === 'dev';

if (token) {
  mixpanel.init(token, {
    debug: isDev, // Enable debug mode only in development
    track_pageview: true,
    persistence: 'localStorage',
  });
} else {
  console.warn('Mixpanel token not found. Analytics will not be tracked.');
}

// Track an event
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (token) {
    mixpanel.track(eventName, properties);
  }
};

// Identify a user
export const identifyUser = (userId: number) => {
  if (token) {
    mixpanel.identify(String(userId));
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (token) {
    mixpanel.people.set(properties);
  }
};

// Reset user (on logout)
export const resetUser = () => {
  if (token) {
    mixpanel.reset();
  }
};

export default {
  trackEvent,
  identifyUser,
  setUserProperties,
  resetUser,
};

