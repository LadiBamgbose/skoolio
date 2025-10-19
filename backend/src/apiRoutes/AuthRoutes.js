import express from 'express';
import jwt from 'jsonwebtoken';
import AuthLogic from '../prismaLogic/Auth/Auth.js';

const router = express.Router();

// JWT secret (should be in .env, but you have it ignored)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '30d'; // Token valid for 30 days

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, city, state } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !city || !state) {
      return res.status(400).json({
        error: 'All fields are required: email, password, first name, last name, city, and state'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await AuthLogic.findUserByEmailForAuth(email);

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists'
      });
    }

    // Create user (password hashing handled in AuthLogic)
    const user = await AuthLogic.createUser(
      email,
      password,
      firstName,
      lastName,
      city,
      state
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        plan: user.plan
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password) and token
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        state: user.state,
        plan: user.plan,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'An account with this email already exists'
      });
    }

    res.status(500).json({
      error: 'Failed to create account. Please try again.'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await AuthLogic.findUserByEmailForAuth(email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await AuthLogic.verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        plan: user.plan
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password) and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        state: user.state,
        plan: user.plan,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      error: 'Failed to log in. Please try again.'
    });
  }
});

// GET /api/auth/me - Get current user from token
router.get('/me', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid or expired token'
      });
    }

    // Get user from database
    const user = await AuthLogic.findUserByEmailForAuth(decoded.email);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Return user data (without password)
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        state: user.state,
        plan: user.plan,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    
    res.status(500).json({
      error: 'Failed to fetch user data'
    });
  }
});

export default router;

