const UserType = require('../models/Usertype');

exports.createUserType = async (req, res) => {
    try {
        const userType = new UserType(req.body);
        await userType.save();
        res.status(201).json({ message: 'UserType created successfully.', data: userType, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message, error: 1 });
    }
};


exports.getAllUserTypes = async (req, res) => {
    try {
        const userTypes = await UserType.find({ deleted_at: null });
        res.status(200).json({ message: 'UserTypes fetched successfully.', data: userTypes, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message, error: 1 });
    }
};


exports.getUserTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = await UserType.findById(id);

        if (!userType) {
            return res.status(404).json({ message: 'UserType not found.', error: 1 });
        }

        res.status(200).json({ message: 'UserType fetched successfully.', data: userType, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message, error: 1 });
    }
};


exports.updateUserType = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = await UserType.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!userType) {
            return res.status(404).json({ message: 'UserType not found.', error: 1 });
        }

        res.status(200).json({ message: 'UserType updated successfully.', data: userType, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message, error: 1 });
    }
};


exports.deleteUserType = async (req, res) => {
    try {
        const { id } = req.params;

        const userType = await UserType.findById(id);

        if (!userType || userType.deleted_at) {
            return res.status(404).json({ message: 'UserType not found or already deleted.', error: 1 });
        }

        userType.deleted_at = new Date();
        await userType.save();

        res.status(200).json({ message: 'UserType soft deleted successfully.', data: userType, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message, error: 1 });
    }
};

