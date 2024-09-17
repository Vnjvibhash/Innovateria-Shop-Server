// Description: This file contains the logic for user related operations.
import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import { isValidEmail } from '../utils/helper.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import bcrypt from 'bcrypt';

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

// Register
export const userRgister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Name, email, and password are required.',
        });
    }
    const emailId = email.toLowerCase();
    const user = await User.findOne({ email: emailId });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: 'Email already exist' });
    }
    if (isValidEmail(emailId)) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await User.create({ name, email: emailId, password: hashedPassword });
      res.json({
        success: true,
        message: 'User created successfully.',
        data: null,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter a valid email' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const userLogin = [
  upload.none(),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      if (!email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Email and password are required.',
          });
      }
      const emailId = email.toLowerCase();

      const user = await User.findOne({ email: emailId });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2h' },
      );

      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const existingToken = await Token.findOne({ userId: user._id });
      if (existingToken) {
        await Token.updateOne({ userId: user._id }, { token, expiresAt });
      } else {
        await Token.create({ token, userId: user._id, expiresAt });
      }

      const bearerToken = 'Bearer ' + token;

      res
        .status(200)
        .cookie('token', token, {
          maxAge: 2 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
        })
        .json({
          success: true,
          message: 'User logged in successfully.',
          tokenType: 'Bearer',
          token: bearerToken,
          user,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

// export const userLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log(req.body);
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "Email and password are required." });
//         }
//         const emailId = email.toLowerCase();
//         const user = await User.findOne({ email:emailId });
//         if (!user) {
//             return res.status(401).json({ success: false, message: "Invalid email" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: "Invalid password" });
//         }

//         // Generate token
//         const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });

//         // Set the token expiration date
//         const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Token expires in 2 hours

//         // Check if a token already exists for the user
//         const existingToken = await Token.findOne({ userId: user._id });

//         if (existingToken) {
//             // Update the existing token
//             await Token.updateOne({ userId: user._id }, { token, expiresAt });
//         } else {
//             // Create a new token
//             await Token.create({ token, userId: user._id, expiresAt });
//         }

//         const bearerToken = 'Bearer '+token;

//         res.status(200)
//             .cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
//             .json({ success: true, message: "User logged in successfully.", tokenType: 'Bearer', token: bearerToken, user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

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

// Update User
export const updateUserProfile = [
  upload.none(),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Name, email, and password are required.',
          });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      const emailId = email.toLowerCase();
      if (isValidEmail(email)) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.name = name;
        user.email = emailId;
        user.password = hashedPassword;
        user.updatedAt = Date.now();
        await user.save();
        res.json({
          success: true,
          message: 'User updated successfully.',
          data: user,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: 'Please enter a valid email' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

// Get Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete profile
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied. Admins only.' });
    }
    const user = await User.findById(userId);
    const token = await Token.findOne({ userId: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    await user.deleteOne({ _id: userId });
    await token.deleteOne({ _id: token._id });
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
