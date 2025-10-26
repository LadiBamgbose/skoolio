import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to optionally verify JWT token
// If token exists → verify and attach user to req.user
// If no token → continue without authentication (anonymous mode)
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    // No token? Continue as anonymous user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        plan: decoded.plan
      };
      
      next();
    } catch (error) {
      // Invalid token? Continue as anonymous (don't block the request)
      console.warn('Invalid token provided, continuing as anonymous:', error.message);
      req.user = null;
      next();
    }
    
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // On error, continue as anonymous
    req.user = null;
    next();
  }
};

