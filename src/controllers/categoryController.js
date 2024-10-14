// Description: This file contains the logic for category related operations.
import Category from '../models/categoryModel.js';

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, message: "All categories", data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single category
export const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, message: "Category found", data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } 5
};

// Create a new Category
export const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        console.log(name, image);
        if (!name && !image) {
            return res.status(400).json({ success: false, message: "Name & image both are required." });
        }
        const category = new Category({
            name,
            image
        });

        await category.save();
        res.json({ success: true, message: "Category created", data: category });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update a category
export const updateCategory = async (req, res) => {
    try {
        const catId = req.params.id;
        const category = await Category.findById(catId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        const { name, image } = req.body;

        if (!name && !image) {
            return res.status(400).json({ success: false, message: "Name & image both are required." });
        }

        try {
            const updatedCategory = await Category.findByIdAndUpdate(
                catId,
                { name: name, image: image },
                { new: true }
            );
            if (!updatedCategory) {
                return res.status(404).json({ success: false, message: "Category not upadeted." });
            }

            res.json({ success: true, message: "Category updated", data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        await category.remove();
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

