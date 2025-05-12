const MyRecords = require("../models/MyRecords");

// Create a new MyRecord
exports.createRecord = async (req, res) => {
    try {

        const userid = req.userId;
        const record = await MyRecords.create(req.body);
        res.status(201).json({
            success: true,
            message: "Record created successfully",
            data: record,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create record",
            error: 1,
            details: error.message
        });
    }
};

// Get all MyRecords
exports.getAllRecords = async (req, res) => {
    try {
        const records = await MyRecords.find()
            .populate("user", "name email") // Adjust fields as needed
            .populate("upcoming_vaccination", "name date time") // Adjust fields as needed
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Records fetched successfully",
            data: records,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch records",
            error: 1,
            details: error.message
        });
    }
};

// Get a single MyRecord by ID
exports.getRecordById = async (req, res) => {
    try {
        const record = await MyRecords.findById(req.params.id)
            .populate("user", "name email")
            .populate("upcoming_vaccination", "name date time");

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
                error: 1
            });
        }

        res.status(200).json({
            success: true,
            message: "Record fetched successfully",
            data: record,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch record",
            error: 1,
            details: error.message
        });
    }
};

// Update a MyRecord
exports.updateRecord = async (req, res) => {
    try {
        const updated = await MyRecords.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
                error: 1
            });
        }

        res.status(200).json({
            success: true,
            message: "Record updated successfully",
            data: updated,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update record",
            error: 1,
            details: error.message
        });
    }
};

// Delete a MyRecord
exports.deleteRecord = async (req, res) => {
    try {
        const deleted = await MyRecords.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
                error: 1
            });
        }

        res.status(200).json({
            success: true,
            message: "Record deleted successfully",
            data: deleted,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete record",
            error: 1,
            details: error.message
        });
    }
};
