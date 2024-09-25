import mongoose from 'mongoose';

const posterSchema = new mongoose.Schema({
  posterName: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true  // Automatically manage createdAt and updatedAt
});

const Poster = mongoose.model('Poster', posterSchema);

export default Poster;
