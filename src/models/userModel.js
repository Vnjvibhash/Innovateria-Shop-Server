import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'vendor'],
    default: 'user',
  },
  status: {
    type: Boolean,
    default: true,
  },
  profilePic: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  address: {
    street: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zip: { type: String, default: null },
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
