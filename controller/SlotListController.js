const SlotList = require('../models/SlotList');

// 🟢 Create a new Slot
exports.createSlot = async (req, res) => {
    try {
        const { start_time, end_time, slot } = req.body;

        if (!start_time || !end_time || !slot) {
            return res.status(400).json({
                error: 1,
                message: 'Start time, end time, and slot are required.'
            });
        }

        const newSlot = new SlotList({
            start_time,
            end_time,
            slot
        });

        await newSlot.save();

        res.status(201).json({
            error: 0,
            message: 'Slot created successfully',
            data: newSlot
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 1,
            message: 'Error creating slot',
            error: err.message
        });
    }
};

// 🔵 Get all Slots
exports.getAllSlots = async (req, res) => {
    try {
        const slots = await SlotList.find();
        res.status(200).json({
            error: 0,
            data: slots,
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: 'Error fetching slots',
            error: err.message
        });
    }
};

// 🟣 Get a specific Slot by ID
exports.getSlotById = async (req, res) => {
    try {
        const slotId = req.params.id;
        const slot = await SlotList.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                error: 1,
                message: 'Slot not found.'
            });
        }

        res.status(200).json({
            error: 0,
            slot
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: 'Error fetching slot',
            error: err.message
        });
    }
};

// 🟡 Update a Slot by ID
exports.updateSlot = async (req, res) => {
    try {
        const slotId = req.params.id;
        const { start_time, end_time, slot } = req.body;

        const updatedSlot = await SlotList.findByIdAndUpdate(
            slotId,
            { start_time, end_time, slot },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({
                error: 1,
                message: 'Slot not found.'
            });
        }

        res.status(200).json({
            error: 0,
            message: 'Slot updated successfully',
            data: updatedSlot
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: 'Error updating slot',
            error: err.message
        });
    }
};

// 🔴 Delete a Slot by ID
exports.deleteSlot = async (req, res) => {
    try {
        const slotId = req.params.id;
        const deletedSlot = await SlotList.findByIdAndDelete(slotId);

        if (!deletedSlot) {
            return res.status(404).json({
                error: 1,
                message: 'Slot not found.'
            });
        }

        res.status(200).json({
            error: 0,
            message: 'Slot deleted successfully',
            data: deletedSlot
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: 'Error deleting slot',
            error: err.message
        });
    }
};
