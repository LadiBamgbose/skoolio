import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token and attach user to request
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided. Please log in.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid or expired token. Please log in again.'
      });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      plan: decoded.plan
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed'
    });
  }
};

