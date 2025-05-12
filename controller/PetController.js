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
// exports.getAllPets = async (req, res) => {
//     try {
//         const pets = await Pet.find({ deleted_at: null }).populate({
//             path: 'breed',
//             options: { strictPopulate: false } // allows silent failure if the model isn't registered
//         });

//         res.status(200).json({
//             success: true,
//             data: pets,
//             error: 0
//         });
//     } catch (error) {
//         res.status(500).json({
//             error: 1,
//             message: "Failed to fetch pets",
//             details: error.message
//         });
//     }
// };



exports.getAllPets = async (req, res) => {
    try {
        let pets = await Pet.find({ deleted_at: null })
            .populate({ path: 'breed', options: { strictPopulate: false } })
            .populate({ path: 'pet_eating', options: { strictPopulate: false } })
            .populate({ path: 'activity', options: { strictPopulate: false } })
            .populate({
                path: 'pet_form.question',
                model: 'PetProfileForm',
                options: { strictPopulate: false }
            })
            .populate({
                path: 'pet_form.answerId',
                options: { strictPopulate: false },
                strictPopulate: false // in case answerModel may not match
            });

        // Define fields to consider for profile completion
        const fieldsToCheck = [
            'name',
            'image',
            'breed',
            'gender',
            'age',
            'vaccination',
            'pet_eating',
            'meals_per_day',
            'daily_walk_routine',
            'activity'
        ];
        const totalFields = fieldsToCheck.length;

        // Add profile_completion to each pet
        pets = pets.map(pet => {
            let filledFields = 0;
            fieldsToCheck.forEach(field => {
                const value = pet[field];
                if (Array.isArray(value)) {
                    if (value.length > 0) filledFields++;
                } else if (value !== undefined && value !== null && value !== '') {
                    filledFields++;
                }
            });

            const completion = Math.round((filledFields / totalFields) * 100);
            return {
                ...pet.toObject(),
                profile_completion: completion
            };
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






// exports.updatePet = async (req, res) => {
//     try {
//         const updateData = { ...req.body };


//         // Handle uploaded image if present
//         if (req.file) {
//             updateData.image = req.file.path;
//         }

//         console.log(updateData)

//         // Parse JSON string fields if they come from form-data or raw input
//         if (typeof updateData.pet_form === 'string') {
//             updateData.pet_form = JSON.parse(updateData.pet_form);
//         }

//         if (typeof updateData.pet_eating === 'string') {
//             updateData.pet_eating = JSON.parse(updateData.pet_eating);
//         }

//         if (typeof updateData.activity === 'string') {
//             updateData.activity = JSON.parse(updateData.activity);
//         }

//         const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updateData, {
//             new: true,
//             runValidators: true
//         });

//         if (!updatedPet) {
//             return res.status(404).json({
//                 error: 1,
//                 message: "Pet not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Pet updated successfully!",
//             data: updatedPet,
//             error: 0
//         });

//     } catch (error) {
//         res.status(500).json({
//             error: 1,
//             message: "Failed to update pet",
//             details: error.message
//         });
//     }
// };



exports.updatePet = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle uploaded image if present
        if (req.file) {
            updateData.image = req.file.path;
        }

        // Parse JSON string fields if they come from form-data or raw input
        if (typeof updateData.pet_form === 'string') {
            updateData.pet_form = JSON.parse(updateData.pet_form);
        }

        if (typeof updateData.pet_eating === 'string') {
            updateData.pet_eating = JSON.parse(updateData.pet_eating);
        }

        if (typeof updateData.activity === 'string') {
            updateData.activity = JSON.parse(updateData.activity);
        }

        // Check if pet_form exists in the updateData and handle the question updates
        if (updateData.pet_form && Array.isArray(updateData.pet_form)) {
            // Fetch the current pet data to get the existing pet_form
            const pet = await Pet.findById(req.params.id);
            console.log(pet)

            if (pet) {
                updateData.pet_form.forEach((newFormData) => {

                    // Check if the question already exists in the pet_form
                    const existingQuestion = pet.pet_form.find((item) => item.question == newFormData.question);

                    if (existingQuestion) {
                        // Update the existing question
                        console.log("question eddidi", existingQuestion)
                        existingQuestion.answerId = newFormData.answerId;
                        existingQuestion.answerModel = newFormData.answerModel;
                    } else {
                        console.log("newFormdata", newFormData)
                        pet.pet_form.push(newFormData);
                    }
                });
            }
        }

        // Update the pet with the new data
        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedPet) {
            return res.status(404).json({
                error: 1,
                message: "Pet not found"
            });
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

        let pets = await Pet.find({ created_by: userId, deleted_at: null })
            .populate({ path: 'breed', options: { strictPopulate: false } })
            .populate({ path: 'pet_eating', options: { strictPopulate: false } })
            .populate({ path: 'activity', options: { strictPopulate: false } })
            .populate({
                path: 'pet_form.question',
                model: 'PetProfileForm',
                options: { strictPopulate: false }
            })
            .populate({
                path: 'pet_form.answerId',
                options: { strictPopulate: false },
                strictPopulate: false // in case answerModel may not match
            });




        const fieldsToCheck = [
            'name',
            'image',
            'breed',
            'gender',
            'age',
            'vaccination',
            'pet_eating',
            'meals_per_day',
            'daily_walk_routine',
            'activity'
        ];
        const totalFields = fieldsToCheck.length;


        pets = pets.map(pet => {
            let filledFields = 0;
            fieldsToCheck.forEach(field => {
                if (Array.isArray(pet[field])) {
                    if (pet[field].length > 0) filledFields++;
                } else if (pet[field] !== undefined && pet[field] !== null && pet[field] !== '') {
                    filledFields++;
                }
            });
            const completion = Math.round((filledFields / totalFields) * 100);
            return {
                ...pet.toObject(),
                profile_completion: completion
                // profile_completion: 50
            };
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


// exports.addPetFormEntry = async (req, res) => {
//     try {
//         const petId = req.params.id;
//         const { question, answerId, answerModel, answer } = req.body;

//         const pet = await Pet.findById(petId);
//         if (!pet) {
//             return res.status(404).json({ success: false, message: "Pet not found", error: 1 });
//         }

//         // Check for existing question ID
//         const questionExists = pet.pet_form.some(entry =>
//             entry.question?.toString() === question?.toString()
//         );

//         if (questionExists) {
//             return res.status(400).json({
//                 success: false,
//                 message: "This question has already been added to the pet form.",
//                 error: 1
//             });
//         }

//         const newEntry = {
//             ...(question && { question }),
//             ...(answerId && { answerId }),
//             ...(answerModel && { answerModel }),
//             ...(answer && { answer })
//         };

//         pet.pet_form.push(newEntry);

//         const updatedPet = await pet.save();

//         res.status(200).json({
//             success: true,
//             message: "Pet form entry added successfully!",
//             data: updatedPet,
//             error: 0
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to add pet form entry",
//             error: 1,
//             details: error.message
//         });
//     }
// };



exports.addPetFormEntry = async (req, res) => {
    try {
        const petId = req.params.id;
        const { question, answerId, answerModel, answer } = req.body;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ success: false, message: "Pet not found", error: 1 });
        }

        const existingEntryIndex = pet.pet_form.findIndex(entry =>
            entry.question == question
        );

        if (existingEntryIndex !== -1) {
            // Update existing entry
            if (answerId) pet.pet_form[existingEntryIndex].answerId = answerId;
            if (answerModel) pet.pet_form[existingEntryIndex].answerModel = answerModel;
            if (answer) pet.pet_form[existingEntryIndex].answer = answer;
        } else {
            // Add new entry
            const newEntry = {
                ...(question && { question }),
                ...(answerId && { answerId }),
                ...(answerModel && { answerModel }),
                ...(answer && { answer })
            };
            pet.pet_form.push(newEntry);
        }

        const updatedPet = await pet.save();

        res.status(200).json({
            success: true,
            message: "Pet form entry added/updated successfully!",
            data: updatedPet,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add or update pet form entry",
            error: 1,
            details: error.message
        });
    }
};





exports.deletePetFormEntry = async (req, res) => {
    try {
        const { id: petId, questionId } = req.params;

        // Find the pet by ID
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found",
                error: 1
            });
        }

        // Filter out the form entry with the specified questionId
        const originalLength = pet.pet_form.length;
        pet.pet_form = pet.pet_form.filter(entry => entry.question?.toString() !== questionId);

        // Check if any entry was removed
        if (pet.pet_form.length === originalLength) {
            return res.status(404).json({
                success: false,
                message: "Question not found in pet form",
                error: 1
            });
        }

        // Save updated pet
        const updatedPet = await pet.save();

        return res.status(200).json({
            success: true,
            message: "Pet form entry deleted successfully!",
            data: updatedPet,
            error: 0
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete pet form entry",
            error: 1,
            details: error.message
        });
    }
};







