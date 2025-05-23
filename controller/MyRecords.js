const MyRecords = require("../models/MyRecords");

// Create a new record
exports.createRecord = async (req, res) => {
    try {
        const userId = req.userId;
        const { upcoming_vaccination, vaccination_time, vaccination_date } = req.body;

        const record = await MyRecords.create({
            user: userId,
            upcoming_vaccination,
            vaccination_time,
            vaccination_date
        });

        return res.status(201).json({
            success: true,
            message: "Record created successfully",
            data: record,
            error: 0
        });
    } catch (error) {
        console.error('Error creating record:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to create record",
            error: 1,
            details: error.message
        });
    }
};

// Get all records
exports.getAllRecords = async (req, res) => {
    try {
        const userId = req.userId;

        const records = await MyRecords.find({ user: userId })
            .populate("user", "name email")
            .populate("upcoming_vaccination", "name date time")
            .populate("pet_id", "name breed age") // Optional populate
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Records fetched successfully",
            data: records,
            error: 0
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch records",
            error: 1,
            details: error.message
        });
    }
};



// Get a single record by ID
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

        return res.status(200).json({
            success: true,
            message: "Record fetched successfully",
            data: record,
            error: 0
        });
    } catch (error) {
        console.error('Error fetching record by ID:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch record",
            error: 1,
            details: error.message
        });
    }
};

// Update a record
exports.updateRecord = async (req, res) => {
    try {
        const { upcoming_vaccination, vaccination_time, vaccination_date } = req.body;

        const updated = await MyRecords.findOneAndUpdate(
            { _id: req.params.id },
            { upcoming_vaccination, vaccination_time, vaccination_date },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
                error: 1
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record updated successfully",
            data: updated,
            error: 0
        });
    } catch (error) {
        console.error('Error updating record:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update record",
            error: 1,
            details: error.message
        });
    }
};

// Delete a record
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

        return res.status(200).json({
            success: true,
            message: "Record deleted successfully",
            data: deleted,
            error: 0
        });
    } catch (error) {
        console.error('Error deleting record:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete record",
            error: 1,
            details: error.message
        });
    }
};