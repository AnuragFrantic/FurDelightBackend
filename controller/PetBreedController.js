const PetBreed = require("../models/PetBreed");

// ✅ Create Pet Breed
exports.createPetBreed = async (req, res) => {
    try {
        const { name, pet_type, description, created_by } = req.body;
        const image = req.file ? req.file.path : null;

        const breed = new PetBreed({ name, image, pet_type, description, created_by });
        await breed.save();

        res.status(201).json({
            success: true,
            message: "Pet breed created successfully!",
            data: breed,
            error: 0,
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message,
        });
    }
};

// ✅ Get All Pet Breeds
exports.getAllPetBreeds = async (req, res) => {
    try {
        const { pet_type } = req.query;

        const filter = { deleted_at: null };
        if (pet_type) {
            filter.pet_type = pet_type;
        }

        const breeds = await PetBreed.find(filter).populate("pet_type");

        res.status(200).json({ success: true, data: breeds, error: 0 });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message,
        });
    }
};


// ✅ Get Pet Breed by ID
exports.getPetBreedById = async (req, res) => {
    try {
        const breed = await PetBreed.findById(req.params.id)
            .populate("pet_type")
            .populate("created_by")
            .populate("updated_by");

        if (!breed || breed.deleted_at) {
            return res.status(404).json({ error: 1, message: "Pet breed not found!" });
        }

        res.status(200).json({ success: true, data: breed, error: 0 });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message,
        });
    }
};

// ✅ Update Pet Breed
exports.updatePetBreed = async (req, res) => {
    try {
        const { name, pet_type, description, updated_by } = req.body;
        const updateData = { name, pet_type, description, updated_by };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updated = await PetBreed.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updated || updated.deleted_at) {
            return res.status(404).json({ error: 1, message: "Pet breed not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Pet breed updated successfully!",
            data: updated,
            error: 0,
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message,
        });
    }
};

// ✅ Soft Delete Pet Breed
exports.deletePetBreed = async (req, res) => {
    try {
        const breed = await PetBreed.findById(req.params.id);

        if (!breed || breed.deleted_at) {
            return res.status(404).json({ error: 1, message: "Pet breed not found!" });
        }

        breed.deleted_at = new Date();
        await breed.save();

        res.status(200).json({
            success: true,
            message: "Pet breed deleted successfully!",
            error: 0,
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message,
        });
    }
};
