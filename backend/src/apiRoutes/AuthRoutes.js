import express from 'express';
import jwt from 'jsonwebtoken';
import AuthLogic from '../prismaLogic/Auth/Auth.js';

const router = express.Router();

// JWT secret (should be in .env, but you have it ignored)
const JWT_SECRET = process.env.JWT_SECRET || 'skoolio_jwt_secret_2024_dev';
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

export default router;

