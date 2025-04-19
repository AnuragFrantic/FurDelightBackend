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
        res.status(201).json({ status: "OK", message: "Event created successfully", error: 0, data: event });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ status: "Error", message: "Event not created", error: 1 });
    }
};


exports.getAllEvents = async (req, res) => {
    try {
        const Events = await PetEventModal.find({ deleted_at: { $exists: false } })


        res.status(200).json({ status: "OK", message: "Events fetched", error: 0, data: Events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Could not fetch Events", error: 1 });
    }
};



exports.getEventsById = async (req, res) => {
    try {
        const event = await PetEventModal.findOne({ _id: req.params.id, deleted_at: { $exists: false } });

        if (!event) {
            return res.status(404).json({ status: "Error", message: "event not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "event fetched", error: 0, data: event });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Could not fetch event", error: 1 });
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
            return res.status(404).json({ status: "Error", message: "Event not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Event updated", error: 0, data: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Event update failed", error: 1 });
    }
};



exports.softDeleteEvents = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteEvent = await PetEventModal.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });

        if (!deleteEvent) {
            return res.status(404).json({ status: "Error", message: "Event not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Event soft-deleted", error: 0, data: deleteEvent });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Soft delete failed", error: 1 });
    }
};
