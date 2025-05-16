const Faq = require('../models/Faq');

// Create new FAQ
exports.createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const created_by = req.userId;

        const newFaq = new Faq({
            question,
            answer,
            created_by,
            updated_by: created_by
        });

        await newFaq.save();
        return res.status(201).json({ message: 'FAQ created successfully', data: newFaq, error: 0 });
    } catch (err) {
        console.error('Error creating FAQ:', err);
        return res.status(500).json({ message: 'Error creating FAQ', error: 1 });
    }
};

// Get all FAQs (excluding soft deleted)
exports.getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find({ deleted_at: null });
        return res.status(200).json({ data: faqs, error: 0 });
    } catch (err) {
        console.error('Error fetching FAQs:', err);
        return res.status(500).json({ message: 'Error fetching FAQs', error: 1 });
    }
};

// Get one FAQ by ID
exports.getFaqById = async (req, res) => {
    try {
        const faq = await Faq.findOne({ _id: req.params.id, deleted_at: null });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found', error: 1 });
        }
        return res.status(200).json({ data: faq, error: 0 });
    } catch (err) {
        console.error('Error fetching FAQ:', err);
        return res.status(500).json({ message: 'Error fetching FAQ', error: 1 });
    }
};

// Update FAQ by ID
exports.updateFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const updated_by = req.userId;

        const faq = await Faq.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            { question, answer, updated_by },
            { new: true }
        );
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found', error: 1 });
        }
        return res.status(200).json({ message: 'FAQ updated successfully', data: faq, error: 0 });
    } catch (err) {
        console.error('Error updating FAQ:', err);
        return res.status(500).json({ message: 'Error updating FAQ', error: 1 });
    }
};

// Soft delete FAQ by ID
exports.deleteFaq = async (req, res) => {
    try {
        const faq = await Faq.findOneAndUpdate(
            { _id: req.params.id, deleted_at: null },
            { deleted_at: new Date() },
            { new: true }
        );
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found', error: 1 });
        }
        return res.status(200).json({ message: 'FAQ deleted successfully', data: faq, error: 0 });
    } catch (err) {
        console.error('Error deleting FAQ:', err);
        return res.status(500).json({ message: 'Error deleting FAQ', error: 1 });
    }
};
