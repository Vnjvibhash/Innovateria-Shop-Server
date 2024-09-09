// Description: This file contains the logic for category related operations.
import Category from '../models/categoryModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadCategory } from '../utils/uploadFile.js'
import { fileURLToPath } from 'url';

// Get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, message: "All categories", data: categories });
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
    }
};

// Create a new Category
export const createCategory = async (req, res) => {
    try {
        uploadCategory.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Add category: ${err}`);
                return res.json({ success: false, message: err });
            } else if (err) {
                console.log(`Add category: ${err}`);
                return res.json({ success: false, message: err });
            }
            const { name } = req.body;
            let imageUrl = 'no_url';
            if (req.file) {
                // Dynamically construct the URL using HOST_URL and PORT from environment variables
                imageUrl = `${process.env.HOST_URL}:${process.env.PORT}/public/images/categories/${req.file.filename}`;
            }

            if (!name) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            const category = new Category({
                name,
                image: imageUrl
            });

            await category.save();
            res.json({ success: true, message: "Category created", data: category });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    try {
        const catId = req.params.id;

        // Fetch the existeing category data to get the old image url
        const category = await Category.findById(catId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        uploadCategory.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Update category: ${err}`);
                return res.json({ success: false, message: err });
            } else if (err) {
                console.log(`Update category: ${err}`);
                return res.json({ success: false, message: err });
            }
            const { name } = req.body;
            let imageUrl = category.image;
            if (req.file) {
                // Dynamically construct the URL using HOST_URL and PORT from environment variables
                imageUrl = `${process.env.HOST_URL}:${process.env.PORT}/public/images/categories/${req.file.filename}`;

                // Delete the old image from the file system
                const oldImagePath = path.join(__dirname, '../../public/images/categories', path.basename(category.image));
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete old image: ${err.message}`);
                    } else {
                        console.log('Old image deleted successfully.');
                    }
                });
            }

            if (!name) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                // Update the category in the database
                const updatedCategory = await Category.findByIdAndUpdate(
                    catId,
                    { name: name, image: imageUrl },
                    { new: true }
                );
                if (!updatedCategory) {
                    return res.status(404).json({ success: false, message: "Poster not found." });
                }

                res.json({ success: true, message: "Category updated", data: category });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        });
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
        const imagePath = path.join(__dirname, `../public/images/categories/${category.image.split('/').pop()}`);
        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.error("Error deleting image:", err);
            }
            await category.remove();
            res.json({ success: true, message: "Category deleted" });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

