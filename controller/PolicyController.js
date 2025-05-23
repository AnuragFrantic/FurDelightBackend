const Policy = require('../models/Policy');

// Create a new Policy
exports.createPolicy = async (req, res) => {
    try {
        const { title, detail, type } = req.body;
        const created_by = req.userId;

        const newPolicy = new Policy({
            title,
            detail,
            type,
            created_by,
        });

        await newPolicy.save();

        res.status(201).json({ message: 'Policy created successfully', data: newPolicy, error: 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error creating Policy', error: 1 });
    }
};

// Get all Policies (excluding soft deleted)
exports.getAllPolicies = async (req, res) => {
    try {
        const { type, title } = req.query;

        let query = { deleted_at: null };

        // Add type filter if present
        if (type) {
            query.type = type;
        }

        // Add title filter if present
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') }; // case-insensitive search
        }

        const policies = await Policy.find(query);
        res.status(200).json({ data: policies, error: 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching Policies', error: 1 });
    }
};



// Get Policy by ID
exports.getPolicyById = async (req, res) => {
    try {
        const policy = await Policy.findOne({ _id: req.params.id, deleted_at: null });
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found', error: 1 });
        }
        res.status(200).json({ data: policy, error: 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching Policy', error: 1 });
    }
};

// Update Policy by ID
exports.updatePolicy = async (req, res) => {
    try {
        const { title, detail, type } = req.body;
        const updated_by = req.userId;

        const policy = await Policy.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            { title, detail, type, updated_by },
            { new: true }
        );

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found', error: 1 });
        }

        res.status(200).json({ message: 'Policy updated successfully', data: policy, error: 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error updating Policy', error: 1 });
    }
};

// Soft delete Policy by ID
exports.deletePolicy = async (req, res) => {
    try {
        const policy = await Policy.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            { deleted_at: new Date() },
            { new: true }
        );

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found', error: 1 });
        }

        res.status(200).json({ message: 'Policy deleted successfully', data: policy, error: 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting Policy', error: 1 });
    }
};
