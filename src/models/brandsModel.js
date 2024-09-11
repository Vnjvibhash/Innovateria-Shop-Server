import mongoose from 'mongoose';

// Define the Brand schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: [true, 'Subcategory ID is required']
    }
}, { timestamps: true });

// Create the Brand model
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;