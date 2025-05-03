const PetEventModal = require('../models/PetEvents')



exports.createevents = async (req, res) => {
    try {
        // Create a new product instance with the request body
        const eventdata = req.body;

        // Create an instance of ProductModal
        const event = new PetEventModal(eventdata);

        // Check if there are uploaded files (multiple files)
        if (req.files && req.files.length > 0) {

            req.files.forEach(file => {

                event.image.push({ img: file.path });
            });
        }



        // Save the product to the database
        await event.save();

        // Send success response
        res.status(201).json({ success: true, message: "Event created successfully", error: 0, data: event });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ success: false, message: "Event not created", error: 1 });
    }
};


exports.getAllEvents = async (req, res) => {
    try {
        const Events = await PetEventModal.find({ deleted_at: { $exists: false } })


        res.status(200).json({ success: true, message: "Events fetched", error: 0, data: Events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Could not fetch Events", error: 1 });
    }
};



exports.getEventsById = async (req, res) => {
    try {
        const event = await PetEventModal.findOne({ _id: req.params.id, deleted_at: { $exists: false } });

        if (!event) {
            return res.status(404).json({ success: false, message: "event not found", error: 1 });
        }

        res.status(200).json({ success: true, message: "event fetched", error: 0, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: "Could not fetch event", error: 1 });
    }
};



exports.updateEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Optional: Handle new images
        if (req.files && req.files.length > 0) {
            updateData.image = req.files.map(file => ({ img: file.path }));
        }

        const updatedProduct = await PetEventModal.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Event not found", error: 1 });
        }

        res.status(200).json({ success: true, message: "Event updated", error: 0, data: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Event update failed", error: 1 });
    }
};



exports.softDeleteEvents = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteEvent = await PetEventModal.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });

        if (!deleteEvent) {
            return res.status(404).json({ success: false, message: "Event not found", error: 1 });
        }

        res.status(200).json({ success: true, message: "Event soft-deleted", error: 0, data: deleteEvent });
    } catch (err) {
        res.status(500).json({ success: false, message: "Soft delete failed", error: 1 });
    }
};


exports.deleteEventsImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        // Find the description containing the image to delete
        const data = await PetEventModal.findOneAndUpdate(
            { "image._id": imageId },
            { $pull: { image: { _id: imageId } } },
            { new: true }
        );



        if (!data) {
            return res.status(500).json({ message: "data not found" });
        }

        // Image successfully deleted
        res.status(200).json({ message: "Image deleted successfully", data: data, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};