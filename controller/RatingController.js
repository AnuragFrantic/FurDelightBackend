const Rating = require('../models/Rating');

// Create a new rating
exports.createRating = async (req, res) => {
    try {
        const { rating, message, rated_user } = req.body;
        const rated_by = req.userId; // logged-in user ID from middleware

        if (!rating || !rated_user) {
            return res.status(400).json({ error: 1, message: 'Rating and rated_user are required' });
        }

        const newRating = new Rating({
            rating,
            message,
            rated_by,
            rated_user,
        });

        await newRating.save();

        res.status(201).json({ error: 0, message: 'Rating created', data: newRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 1, message: 'Server error', details: error.message });
    }
};

// Get all ratings (with optional pagination)
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find()
            .populate('rated_by', 'name email')
            .populate('rated_user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ error: 0, message: 'Ratings fetched', data: ratings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 1, message: 'Server error', details: error.message });
    }
};

// Get rating by ID
exports.getRatingById = async (req, res) => {
    try {
        const { ratingId } = req.params;

        const rating = await Rating.findById(ratingId)
            .populate('rated_by', 'name email')
            .populate('rated_user', 'name email');

        if (!rating) {
            return res.status(404).json({ error: 1, message: 'Rating not found' });
        }

        res.status(200).json({ error: 0, message: 'Rating fetched', data: rating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 1, message: 'Server error', details: error.message });
    }
};

// Update rating by ID
exports.updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating, message } = req.body;

        const existingRating = await Rating.findById(ratingId);

        if (!existingRating) {
            return res.status(404).json({ error: 1, message: 'Rating not found' });
        }

        // Only the user who created the rating can update it
        if (existingRating.rated_by.toString() !== req.userId) {
            return res.status(403).json({ error: 1, message: 'Unauthorized to update this rating' });
        }

        if (rating !== undefined) existingRating.rating = rating;
        if (message !== undefined) existingRating.message = message;

        await existingRating.save();

        res.status(200).json({ error: 0, message: 'Rating updated', data: existingRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 1, message: 'Server error', details: error.message });
    }
};

// Delete rating by ID
exports.deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;

        const rating = await Rating.findById(ratingId);
        if (!rating) {
            return res.status(404).json({ error: 1, message: 'Rating not found' });
        }

        // Only creator can delete
        if (rating.rated_by.toString() !== req.userId) {
            return res.status(403).json({ error: 1, message: 'Unauthorized to delete this rating' });
        }

        await Rating.findByIdAndDelete(ratingId);

        res.status(200).json({ error: 0, message: 'Rating deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 1, message: 'Server error', details: error.message });
    }
};



// Get all ratings given TO a user (profile reviews)
exports.getRatingsForUser = async (req, res) => {
    try {
        const { userId } = req.params; 

        const ratings = await Rating.find({ rated_user: userId })
            .populate('rated_by', 'name email') 
            .sort({ createdAt: -1 });

        const totalReviews = ratings.length;
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1);

        res.status(200).json({
            error: 0,
            message: 'Ratings fetched for user',
            data: {
                totalReviews,
                averageRating: averageRating.toFixed(2),
                ratings,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 1, message: 'Server error', details: error.message });
    }
};
