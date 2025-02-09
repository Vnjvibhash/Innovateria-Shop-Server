// Description: This file contains the logic for product related operations.
import Product from '../models/productModel.js';


// Fetch all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('proCategoryId', 'id name')
            .populate('proSubCategoryId', 'id name')
            .populate('proBrandId', 'id name')
            .populate('proVariantTypeId', 'id type')
            .populate('proVariantId', 'id name');
        res.json({ success: true, message: "Products retrieved successfully.", data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch single product
export const getProduct = async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await Product.findById(productID)
            .populate('proCategoryId', 'id name')
            .populate('proSubCategoryId', 'id name')
            .populate('proBrandId', 'id name')
            .populate('proVariantTypeId', 'id name')
            .populate('proVariantId', 'id name');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product retrieved successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a product
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            quantity,
            price,
            offerPrice,
            proCategoryId,
            proSubCategoryId,
            proBrandId,
            proVariantTypeId,
            proVariantId,
            images
        } = req.body;

        if (!name || quantity === undefined || !price || !proCategoryId || !proSubCategoryId) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }

        if (price <= 0) {
            return res.status(400).json({ success: false, message: "Price must be a positive number." });
        }

        if (quantity < 0) {
            return res.status(400).json({ success: false, message: "Quantity cannot be negative." });
        }

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required." });
        }

        const newProduct = new Product({
            name,
            description,
            quantity,
            price,
            offerPrice,
            proCategoryId,
            proSubCategoryId,
            proBrandId,
            proVariantTypeId,
            proVariantId,
            images
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: newProduct
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update a product
export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    try {

        const { name, description, quantity, price, offerPrice, proCategoryId, proSubCategoryId, proBrandId, proVariantTypeId, proVariantId, images } = req.body;

        // Find the product by ID
        const productToUpdate = await Product.findById(productId);
        if (!productToUpdate) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // Update product properties if provided
        productToUpdate.name = name || productToUpdate.name;
        productToUpdate.description = description || productToUpdate.description;
        productToUpdate.quantity = quantity || productToUpdate.quantity;
        productToUpdate.price = price || productToUpdate.price;
        productToUpdate.offerPrice = offerPrice || productToUpdate.offerPrice;
        productToUpdate.proCategoryId = proCategoryId || productToUpdate.proCategoryId;
        productToUpdate.proSubCategoryId = proSubCategoryId || productToUpdate.proSubCategoryId;
        productToUpdate.proBrandId = proBrandId || productToUpdate.proBrandId;
        productToUpdate.proVariantTypeId = proVariantTypeId || productToUpdate.proVariantTypeId;
        productToUpdate.proVariantId = proVariantId || productToUpdate.proVariantId;
        productToUpdate.images = images || productToUpdate.images;
        await productToUpdate.save();

        res.status(200).json({ success: true, message: "Product updated successfully." });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    const productID = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

