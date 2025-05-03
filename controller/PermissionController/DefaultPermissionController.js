const DefaultPermissions = require('../../models/DefaultPermission');


exports.createPermission = async (req, res) => {
    try {
        const permissionData = { ...req.body };

        const newPermission = new DefaultPermissions(permissionData);
        await newPermission.save();

        res.status(201).json({ message: 'Default permission created successfully', data: newPermission, error: 0 });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Permission already exists with the given combination', error: 1 });
        }
        res.status(500).json({ message: 'Error creating permission', error, error: 1 });
    }
};

// Get all default permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await DefaultPermissions.find().populate('user_type roles.type');
        res.status(200).json({ data: permissions, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions', error, error: 1 });
    }
};

// Get a specific default permission by ID
exports.getPermissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await DefaultPermissions.findById(id).populate('user_type roles.type');

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found', error: 1 });
        }

        res.status(200).json({ data: permission, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permission', error, error: 1 });
    }
};

// Update a default permission by ID
exports.updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };



        const updatedPermission = await DefaultPermissions.findByIdAndUpdate(id, updateData, { new: true }).populate('user_type roles.type created_by');

        if (!updatedPermission) {
            return res.status(404).json({ message: 'Permission not found', error: 1 });
        }

        res.status(200).json({ message: 'Permission updated successfully', data: updatedPermission, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error updating permission', error, error: 1 });
    }
};

// Delete a default permission by ID
exports.deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPermission = await DefaultPermissions.findByIdAndDelete(id);

        if (!deletedPermission) {
            return res.status(404).json({ message: 'Permission not found', error: 1 });
        }

        res.status(200).json({ message: 'Permission deleted successfully', data: deletedPermission, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting permission', error, error: 1 });
    }
};
