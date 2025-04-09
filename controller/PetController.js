const Pet = require('../models/Pet');

// CREATE
exports.createPet = async (req, res) => {
    try {
        const image = req.file ? req.file.path : null;
        const petData = { ...req.body };

        if (image) petData.image = image;
        if (req.userId) {
            petData.created_by = req.userId;
        } else {
            return res.status(401).json({
                error: 1,
                message: "Unauthorized: User ID not found in token"
            });
        }

        const newPet = new Pet(petData);
        const savedPet = await newPet.save();

        res.status(201).json({
            success: true,
            message: "Pet created successfully!",
            data: savedPet,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to create pet",
            details: error.message
        });
    }
};

// GET ALL


exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find({ deleted_at: null }).populate({
            path: 'breed',
            options: { strictPopulate: false } // allows silent failure if the model isn't registered
        });

        res.status(200).json({
            success: true,
            data: pets,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to fetch pets",
            details: error.message
        });
    }
};



// GET BY ID
exports.getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('breed user pet_eating activity');

        if (!pet) {
            return res.status(404).json({ error: 1, message: "Pet not found" });
        }

        res.status(200).json({
            success: true,
            data: pet,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to fetch pet",
            details: error.message
        });
    }
};

// UPDATE
exports.updatePet = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedPet) {
            return res.status(404).json({ error: 1, message: "Pet not found" });
        }

        res.status(200).json({
            success: true,
            message: "Pet updated successfully!",
            data: updatedPet,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to update pet",
            details: error.message
        });
    }
};

// DELETE
exports.deletePet = async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 1, message: "Pet not found" });
        }

        res.status(200).json({
            success: true,
            message: "Pet soft deleted successfully!",
            data: pet,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to soft delete pet",
            details: error.message
        });
    }
};




exports.getMyPets = async (req, res) => {
    try {
        const userId = req.userId;


        if (!userId) {
            return res.status(401).json({
                error: 1,
                message: "Unauthorized: User ID missing from token"
            });
        }

        const pets = await Pet.find({ created_by: userId, deleted_at: null }).populate({
            path: 'breed',
            options: { strictPopulate: false }
        });

        res.status(200).json({
            success: true,
            data: pets,
            error: 0
        });

    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Failed to fetch user's pets",
            details: error.message
        });
    }
};


