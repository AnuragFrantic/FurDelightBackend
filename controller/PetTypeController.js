const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const Pettype = require("../models/Petype");
const Wishlist = require("../models/Wishlist");





// const mongoose = require("mongoose");


// const clearAllPettypes = async () => {
//     try {
//         await Orders.deleteMany({});
//         console.log("✅ All Pettypes cleared successfully!");

//     } catch (err) {
//         console.error("❌ Failed to clear Pettypes:", err.message);
//     }
// };

// clearAllPettypes();


exports.createPettype = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.path : null;
        const pettype = new Pettype({
            name,
            image,
            created_by: req.userId
        });

        await pettype.save();

        res.status(201).json({
            success: true,
            message: "Pettype created successfully!",
            data: pettype,
            error: 0
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message
        });
    }
};

// Update Pettype
exports.updatePettype = async (req, res) => {
    try {
        const { name } = req.body;
        const updateData = {
            name,
            updated_by: req.userId
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedPettype = await Pettype.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            updateData,
            { new: true }
        );

        if (!updatedPettype) {
            return res.status(404).json({
                error: 1,
                message: "Pettype not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Pettype updated successfully!",
            data: updatedPettype,
            error: 0
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message
        });
    }
};



// Get all Pettypes (excluding soft-deleted ones)
exports.getAllPettypes = async (req, res) => {
    try {
        const pettypes = await Pettype.find({ deleted_at: null })
        res.status(200).json({ success: true, data: pettypes, error: 0 });
    } catch (err) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};

// Get single Pettype by ID
exports.getPettypeById = async (req, res) => {
    try {
        const pettype = await Pettype.findById(req.params.id).populate('created_by').populate('updated_by');
        if (!pettype || pettype.deleted_at) {
            return res.status(404).json({ error: 1, message: "Pettype not found!" });
        }
        res.status(200).json({ success: true, data: pettype, error: 0 });
    } catch (err) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};



// Soft Delete Pettype
exports.deletePettype = async (req, res) => {
    try {
        const pettype = await Pettype.findById(req.params.id);

        if (!pettype || pettype.deleted_at) {
            return res.status(404).json({ error: 1, message: "Pettype not found!" });
        }

        pettype.deleted_at = new Date();
        await pettype.save();

        res.status(200).json({ success: true, message: "Pettype deleted successfully!", error: 0 });
    } catch (err) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};
