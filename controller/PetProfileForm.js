const PetProfileForm = require('../models/PetProfileCompletion');

// Create a new form entry
exports.createForm = async (req, res) => {
    try {
        const form = new PetProfileForm(req.body);
        await form.save();
        return res.status(201).json({ error: 0, message: 'Form created successfully', data: form });
    } catch (err) {
        return res.status(500).json({ error: 1, message: 'Failed to create form', details: err.message });
    }
};

// Get all form entries
exports.getAllForms = async (req, res) => {
    try {
        const forms = await PetProfileForm.find().sort({ position: 1 }); // ascending order
        return res.status(200).json({ error: 0, data: forms });
    } catch (err) {
        return res.status(500).json({ error: 1, message: 'Failed to fetch forms', details: err.message });
    }
};


// Get a single form entry by ID
exports.getFormById = async (req, res) => {
    try {
        const form = await PetProfileForm.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ error: 1, message: 'Form not found' });
        }
        return res.status(200).json({ error: 0, data: form });
    } catch (err) {
        return res.status(500).json({ error: 1, message: 'Error fetching form', details: err.message });
    }
};

// Update a form entry by ID
exports.updateForm = async (req, res) => {
    try {
        const updated = await PetProfileForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 1, message: 'Form not found' });
        }
        return res.status(200).json({ error: 0, message: 'Form updated successfully', data: updated });
    } catch (err) {
        return res.status(500).json({ error: 1, message: 'Error updating form', details: err.message });
    }
};

// Delete a form entry by ID
exports.deleteForm = async (req, res) => {
    try {
        const deleted = await PetProfileForm.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 1, message: 'Form not found' });
        }
        return res.status(200).json({ error: 0, message: 'Form deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 1, message: 'Error deleting form', details: err.message });
    }
};
