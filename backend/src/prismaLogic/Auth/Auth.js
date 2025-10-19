import prisma from "../../services/prisma.js";
import bcrypt from 'bcrypt';

class AuthLogic {
  // Create a new user (registration)
  static async createUser(email, password, firstName, lastName, city, state) {
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          city: city.trim(),
          state: state.trim(),
          plan: 'BASIC' // Default plan
        }
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email (for login - includes password)
  static async findUserByEmailForAuth(email) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
        // Returns all fields including password for authentication
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }
}

export default AuthLogic;

