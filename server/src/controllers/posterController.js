// Description: This file contains the logic for poster related operations.
import Poster from '../models/posterModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadPosters } from '../utils/uploadFile.js'
import { fileURLToPath } from 'url'; // Import for simulating __dirname

// Get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        uploadPosters.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Add poster: ${err}`);
                return res.json({ success: false, message: err });
            } else if (err) {
                console.log(`Add poster: ${err}`);
                return res.json({ success: false, message: err });
            }
            const { posterName } = req.body;
            let imageUrl = 'no_url';
            if (req.file) {
                // Dynamically construct the URL using HOST_URL and PORT from environment variables
                imageUrl = `${process.env.HOST_URL}:${process.env.PORT}/public/images/posters/${req.file.filename}`;
            }

            if (!posterName) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                const newPoster = new Poster({
                    posterName: posterName,
                    imageUrl: imageUrl
                });
                await newPoster.save();
                res.json({ success: true, message: "Poster created successfully."});
            } catch (error) {
                console.error("Error creating Poster:", error);
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Update a poster
export const updatePoster = async (req, res) => {
    try {
        const posterID = req.params.id;

        // Fetch the existing poster data to get the old image URL
        const existingPoster = await Poster.findById(posterID);
        if (!existingPoster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }

        // Handle file upload using multer
        uploadPosters.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Update poster: ${err.message}`);
                return res.json({ success: false, message: err.message });
            } else if (err) {
                console.log(`Update poster: ${err.message}`);
                return res.json({ success: false, message: err.message });
            }

            const { posterName } = req.body;
            let image = existingPoster.imageUrl; // Default to existing image if no new image is uploaded

            // If a new file is uploaded, update the image URL and delete the old image
            if (req.file) {
                image = `${process.env.HOST_URL}:${process.env.PORT}/public/images/posters/${req.file.filename}`;

                // Delete the old image from the file system
                const oldImagePath = path.join(__dirname, '../../public/images/posters', path.basename(existingPoster.imageUrl));
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete old image: ${err.message}`);
                    } else {
                        console.log('Old image deleted successfully.');
                    }
                });
            }

            // Validate if the poster name is missing
            if (!posterName) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                // Update the poster in the database
                const updatedPoster = await Poster.findByIdAndUpdate(
                    posterID,
                    { posterName: posterName, imageUrl: image },
                    { new: true }
                );
                if (!updatedPoster) {
                    return res.status(404).json({ success: false, message: "Poster not found." });
                }

                res.json({ success: true, message: "Poster updated successfully.", data: updatedPoster });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
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
        const imageUrl = poster.imageUrl;
        const imagePath = path.join(__dirname, '../..', imageUrl.replace(`${process.env.HOST_URL}:${process.env.PORT}`, ''));

        fs.unlink(imagePath, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            await poster.deleteOne({ _id: poster._id });
            res.json({ success: true, message: "Poster deleted successfully." });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
