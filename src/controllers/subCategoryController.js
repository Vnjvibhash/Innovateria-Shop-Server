// Description: This file contains the logic for sub-category related operations.
import SubCategory from '../models/subCategoryModel.js';

// Get all sub-category
export const getSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('categoryId').sort({ 'categoryId': 1 });
        res.json({ success: true, message: "Sub-categories retrieved successfully.", data: subCategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get sub-category by id
export const getSubCategory = async (req, res) => {
    try {
        const subCategoryID = req.params.id;
        const subCategory = await SubCategory.findById(subCategoryID).populate('categoryId');
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }
        res.json({ success: true, message: "Sub-category retrieved successfully.", data: subCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new Sub-Category
export const createSubCategory = async (req, res) => {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
        return res.status(400).json({ success: false, message: "Name and category ID are required." });
    }

    try {
        const subCategory = new SubCategory({ name, categoryId });
        const newSubCategory = await subCategory.save();
        res.json({ success: true, message: "Sub-category created successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a Sub-Category
export const updateSubCategory = async (req, res) => {
    const subCategoryID = req.params.id;
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
        return res.status(400).json({ success: false, message: "Name and category ID are required." });
    }

    try {
        const subCategory = await SubCategory.findByIdAndUpdate(subCategoryID, { name, categoryId }, { new: true });
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }
        res.json({ success: true, message: "Sub-category updated successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
