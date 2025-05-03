const Modules = require('../../models/Modules');

// Create a new module
exports.createModule = async (req, res) => {
    try {
        const moduleData = { ...req.body };

        if (req.file) {
            moduleData.image = req.file.path; // Add the file path if an image is uploaded
        }

        const newModule = new Modules(moduleData);
        await newModule.save();

        res.status(201).json({ message: 'Module created successfully', data: newModule, error: 0 });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Module name must be unique', error: 1 });
        }
        res.status(500).json({ message: 'Error creating module', error, error: 1 });
        
    }
};

// Get all modules
exports.getAllModules = async (req, res) => {
    try {
        const modules = await Modules.find();
        res.status(200).json({ data: modules, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching modules', error, error: 1 });
    }
};

// Get a single module by ID
exports.getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await Modules.findById(id);

        if (!module) {
            return res.status(404).json({ message: 'Module not found', error: 1 });
        }

        res.status(200).json({ data: module, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching module', error, error: 1 });
    }
};

// Update a module by ID
exports.updateModule = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.path; // Update the image path if a new file is uploaded
        }

        const updatedModule = await Modules.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedModule) {
            return res.status(404).json({ message: 'Module not found', error: 1 });
        }

        res.status(200).json({ message: 'Module updated successfully', data: updatedModule, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error updating module', error, error: 1 });
    }
};

// Delete a module by ID
exports.deleteModule = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedModule = await Modules.findByIdAndDelete(id);

        if (!deletedModule) {
            return res.status(404).json({ message: 'Module not found', error: 1 });
        }

        res.status(200).json({ message: 'Module deleted successfully', data: deletedModule, error: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting module', error, error: 1 });
    }
};
