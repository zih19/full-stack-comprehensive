// Custom Throttle Configuration Decorator
import { Throttle } from '@nestjs/throttler';

// Strict note for auth and payments
// Allow 3 requests per 1000 seconds
export const StrictThrottle = () => {
  return Throttle({
    default: {
      ttl: 1000,
      limit: 3,
    },
  });
};

// Allow 5 requests per 1000 seconds
// balance usability and protection against spamming
export const ModerateThrottle = () => {
  return Throttle({
    default: {
      ttl: 1000,
      limit: 5,
    },
  });
};

// Allow 20 requests for 1000 seconds
// provide a more permissive limit to support usage
export const RelaxedThrottle = () => {
  return Throttle({
    default: {
      ttl: 1000,
      limit: 20,
    },
  });
};
