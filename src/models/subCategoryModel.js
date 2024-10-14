import mongoose from 'mongoose';

// Define the SubCategory schema
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category ID is required']
    }
}, {
    timestamps: true
});

// Create the SubCategory model
const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;
