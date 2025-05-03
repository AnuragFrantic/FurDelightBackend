const UnitModel = require("../models/Unit");

// Create Unit
exports.createUnit = async (req, res) => {
    try {
        const unit = new UnitModel(req.body);
        await unit.save();
        res.status(201).json({ success: true, message: "Unit created", data: unit, error: 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create unit", error: 1, details: err.message });
    }
};

// Get All Units (excluding soft-deleted)
exports.getAllUnits = async (req, res) => {
    try {
        const units = await UnitModel.find({ deleted_at: { $exists: false } });
        res.status(200).json({ success: true, message: "Units fetched", data: units, error: 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch units", error: 1 });
    }
};

// Get Single Unit
exports.getUnitById = async (req, res) => {
    try {
        const unit = await UnitModel.findOne({ _id: req.params.id, deleted_at: { $exists: false } });

        if (!unit) return res.status(404).json({ success: false, message: "Unit not found", error: 1 });

        res.status(200).json({ success: true, message: "Unit fetched", data: unit, error: 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching unit", error: 1 });
    }
};

// Update Unit
exports.updateUnit = async (req, res) => {
    try {
        const updatedUnit = await UnitModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUnit) return res.status(404).json({ success: false, message: "Unit not found", error: 1 });

        res.status(200).json({ success: true, message: "Unit updated", data: updatedUnit, error: 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update unit", error: 1 });
    }
};

// Soft Delete Unit
exports.softDeleteUnit = async (req, res) => {
    try {
        const deleted = await UnitModel.findByIdAndUpdate(req.params.id, { deleted_at: new Date() }, { new: true });

        if (!deleted) return res.status(404).json({ success: false, message: "Unit not found", error: 1 });

        res.status(200).json({ success: true, message: "Unit soft-deleted", data: deleted, error: 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to soft-delete unit", error: 1 });
    }
};

