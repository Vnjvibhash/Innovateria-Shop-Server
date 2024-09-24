import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import { isValidEmail } from '../utils/helper.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Configure multer to handle form-data
const upload = multer();

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, message: 'All users', data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User found', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register
export const createUser = [
  upload.none(),
  async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'user',
      status = true,
      profilePic = null,
      phoneNumber = null,
      address = {},
    } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with all fields from the schema
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status, // Store status instead of isActive
      profilePic,
      phoneNumber,
      address: {
        street: address.street || null,
        city: address.city || null,
        state: address.state || null,
        zip: address.zip || null,
      },
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}];

// Login
export const userLogin = [
  upload.none(),
  async (req, res) => {
    try {
      const { identifier, password } = req.body;

      // Check for required fields
      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Identifier (email or mobile number) and password are required.',
        });
      }

      // Find user by email or mobile number
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { phoneNumber: identifier }
        ]
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email/mobile number or password' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email/mobile number or password' });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });

      // Set the token in a cookie
      res.status(200)
        .cookie('token', token, {
          maxAge: 2 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
        })
        .json({
          success: true,
          message: 'User logged in successfully.',
          tokenType: 'Bearer',
          token,
          user: { id: user._id, email: user.email, phoneNumber: user.phoneNumber, role: user.role },
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

// Password Reset Request (Send Reset Token)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'passwordReset',
      expiresAt: Date.now() + 3600000, // 1-hour expiry
    });

    // Send reset email (implement the email logic)
    // await sendPasswordResetEmail(user.email, resetToken);

    res.json({ success: true, message: 'Password reset token sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const tokenRecord = await Token.findOne({ token, type: 'passwordReset', expiresAt: { $gt: Date.now() } });
    if (!tokenRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(tokenRecord.userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await Token.deleteOne({ _id: tokenRecord._id });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      await Token.deleteOne({ token });
      res.clearCookie('token');
    }

    res.json({ success: true, message: 'User logged out successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Update Any User// Update User Profile (Self or Admin Update)
export const updateUser = [
  upload.none(),
  async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      status, // Change isActive to status
      profilePic,
      phoneNumber,
      address = {},
    } = req.body;

    // Find the user by ID (could be the authenticated user or any user for admin)
    const userId = req.userId || req.params.id; // req.userId for self-update, req.params.id for admin
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields only if they are provided in the request
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Only update if password is provided
    }
    user.role = role || user.role;
    user.status = status !== undefined ? status : user.status; // Handle boolean update
    user.profilePic = profilePic || user.profilePic;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    user.address.street = address.street || user.address.street;
    user.address.city = address.city || user.address.city;
    user.address.state = address.state || user.address.state;
    user.address.zip = address.zip || user.address.zip;

    user.updatedAt = Date.now(); // Set update timestamp

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  }];

// Admin Delete User
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User ger is Profile Details
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User profile', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
