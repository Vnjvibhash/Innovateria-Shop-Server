// Description: This file contains the logic for poster related operations.
import Poster from '../models/posterModel.js';

// Get all posters
export const getPosters = async (req, res) => {
    try {
        const posters = await Poster.find();
        res.json({ success: true, message: "All posters", data: posters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single poster
export const getPoster = async (req, res) => {
    try {
        const poster = await Poster.findById(req.params.id);
        if (!poster) {
            return res.status(404).json({ success: false, message: "Poster not found" });
        }
        res.json({ success: true, message: "Poster found", data: poster });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new poster
export const createPoster = async (req, res) => {
    try {

        const { posterName, imageUrl } = req.body;

        if (!posterName || !imageUrl) {
            return res.status(400).json({ success: false, message: "Name and image both are required." });
        }

        try {
            const newPoster = new Poster({
                posterName: posterName,
                imageUrl: imageUrl
            });
            await newPoster.save();
            res.status(201).json({ success: true, message: "Poster created successfully." });
        } catch (error) {
            console.error("Error creating Poster:", error);
            res.status(500).json({ success: false, message: error.message });
        }


    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Update a poster
export const updatePoster = async (req, res) => {
    try {
        const posterID = req.params.id;
        const { posterName, imageUrl } = req.body;

        const existingPoster = await Poster.findById(posterID);
        if (!existingPoster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }

        if (!imageUrl) {
            imageUrl = existingPoster.imageUrl;
        }

        if (!posterName) {
            return res.status(400).json({ success: false, message: "Name is required." });
        }

        try {
            const updatedPoster = await Poster.findByIdAndUpdate(
                posterID,
                { posterName: posterName, imageUrl: imageUrl },
                { new: true }
            );
            if (!updatedPoster) {
                return res.status(404).json({ success: false, message: "Poster not found." });
            }

            res.status(200).json({ success: true, message: "Poster updated successfully.", data: updatedPoster });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }

    } catch (err) {
        console.log(`Error updating poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a poster and remove the image from the local storage
export const deletePoster = async (req, res) => {
    try {
        const poster = await Poster.findById(req.params.id);
        if (!poster) {
            return res.status(404).json({ success: false, message: "Poster not found" });
        }
        await poster.deleteOne({ _id: poster._id });
        res.json({ success: true, message: "Poster deleted successfully." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
