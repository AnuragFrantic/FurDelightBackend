const PetFoodtype = require("../models/PetFoodType");






exports.createPetfoodType = async (req, res) => {
    try {
        const { name } = req.body;

        const petfoodtype = new PetFoodtype({
            name,
            created_by: req.userId
        });

        await petfoodtype.save();

        res.status(201).json({
            success: true,
            message: "petfoodtype created successfully!",
            data: petfoodtype,
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
exports.updatePetfoodtype = async (req, res) => {
    try {
        const { name } = req.body;
        const updateData = {
            name,
            updated_by: req.userId
        };


        const updatedfoodtype = await PetFoodtype.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            updateData,
            { new: true }
        );

        if (!updatedfoodtype) {
            return res.status(404).json({
                error: 1,
                message: "Pettype not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Pettype updated successfully!",
            data: updatedfoodtype,
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
exports.getAllPetfoodtypes = async (req, res) => {
    try {
        const petfoodtypes = await PetFoodtype.find({ deleted_at: null })
        res.status(200).json({ success: true, data: petfoodtypes, error: 0 });
    } catch (err) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};

// Get single Pettype by ID
exports.getPetfoodtypeById = async (req, res) => {
    try {
        const petfoodtype = await PetFoodtype.findById(req.params.id).populate('created_by').populate('updated_by');
        if (!petfoodtype || petfoodtype.deleted_at) {
            return res.status(404).json({ error: 1, message: "petfoodtype not found!" });
        }
        res.status(200).json({ success: true, data: petfoodtype, error: 0 });
    } catch (err) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};



// Soft Delete petfoodtype
exports.deletePetfoodtype = async (req, res) => {
    try {
        const petfoodtype = await PetFoodtype.findById(req.params.id);

        if (!petfoodtype || petfoodtype.deleted_at) {
            return res.status(404).json({ error: 1, message: "petfoodtype not found!" });
        }

        petfoodtype.deleted_at = new Date();
        await petfoodtype.save();

        res.status(200).json({ success: true, message: "Petfood deleted successfully!", error: 0 });
    } catch (err) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};
