const UpcomingVaccination = require("../models/UpcomingVaccination");
const MyRecord = require("../models/MyRecords")

// Create a new upcoming vaccination
exports.createVaccination = async (req, res) => {
    try {
        const vaccination = await UpcomingVaccination.create(req.body);
        res.status(201).json({
            success: true,
            message: "Vaccination created successfully",
            data: vaccination,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create vaccination",
            error: 1,
            details: error.message
        });
    }
};

// Get all upcoming vaccinations
exports.getAllVaccinations = async (req, res) => {
    try {
        const userid = req.userId
        const vaccinations = await UpcomingVaccination.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Vaccinations fetched successfully",
            data: vaccinations,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vaccinations",
            error: 1,
            details: error.message
        });
    }
};

// Get a single vaccination by ID
exports.getVaccinationById = async (req, res) => {
    try {
        const vaccination = await UpcomingVaccination.findById(req.params.id);
        if (!vaccination) {
            return res.status(404).json({
                success: false,
                message: "Vaccination not found",
                error: 1
            });
        }
        res.status(200).json({
            success: true,
            message: "Vaccination fetched successfully",
            data: vaccination,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vaccination",
            error: 1,
            details: error.message
        });
    }
};

// Update a vaccination
exports.updateVaccination = async (req, res) => {
    try {
        const updated = await UpcomingVaccination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Vaccination not found",
                error: 1
            });
        }
        res.status(200).json({
            success: true,
            message: "Vaccination updated successfully",
            data: updated,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update vaccination",
            error: 1,
            details: error.message
        });
    }
};

// Delete a vaccination
exports.deleteVaccination = async (req, res) => {
    try {
        const deleted = await UpcomingVaccination.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Vaccination not found",
                error: 1
            });
        }
        res.status(200).json({
            success: true,
            message: "Vaccination deleted successfully",
            data: deleted,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete vaccination",
            error: 1,
            details: error.message
        });
    }
};
