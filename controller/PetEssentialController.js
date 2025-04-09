const PetEssentials = require('../models/PetEssentials'); // adjust the path if needed

// CREATE
exports.createPetEssential = async (req, res) => {
    try {
        const image = req.file ? req.file.path : null;
        const data = { ...req.body };

        if (image) data.image = image;

        const newEssential = new PetEssentials(data);
        const saved = await newEssential.save();

        res.status(201).json({
            success: true,
            message: "Pet essential created successfully!",
            data: saved,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to create pet essential",
            details: error.message
        });
    }
};

// READ ALL (excluding soft-deleted)
exports.getAllPetEssentials = async (req, res) => {
    try {
        const data = await PetEssentials.find({ deleted_at: null });
        res.status(200).json({
            success: true,
            data,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to fetch pet essentials",
            details: error.message
        });
    }
};

// READ SINGLE
exports.getPetEssentialById = async (req, res) => {
    try {
        const data = await PetEssentials.findOne({ _id: req.params.id, deleted_at: null });

        if (!data) {
            return res.status(404).json({ error: 1, message: "Pet essential not found" });
        }

        res.status(200).json({
            success: true,
            data,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to fetch pet essential",
            details: error.message
        });
    }
};

// UPDATE
exports.updatePetEssential = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updated = await PetEssentials.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 1, message: "Pet essential not found" });
        }

        res.status(200).json({
            success: true,
            message: "Pet essential updated successfully!",
            data: updated,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to update pet essential",
            details: error.message
        });
    }
};

// SOFT DELETE
exports.deletePetEssential = async (req, res) => {
    try {
        const deleted = await PetEssentials.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!deleted) {
            return res.status(404).json({ error: 1, message: "Pet essential not found" });
        }

        res.status(200).json({
            success: true,
            message: "Pet essential deleted successfully (soft deleted)!",
            data: deleted,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to delete pet essential",
            details: error.message
        });
    }
};
