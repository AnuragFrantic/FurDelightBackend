const ProductModal = require('../models/Product')
const WishlistModal = require("../models/Wishlist")




exports.createProduct = async (req, res) => {
    try {
        // Create a new product instance with the request body
        const productData = req.body;

        // Create an instance of ProductModal
        const product = new ProductModal(productData);

        // Check if there are uploaded files (multiple files)
        if (req.files && req.files.length > 0) {

            req.files.forEach(file => {

                product.image.push({ img: file.path });
            });
        }



        // Save the product to the database
        await product.save();

        // Send success response
        res.status(201).json({ success: true, message: "Product created successfully", error: 0, data: product });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ success: false, message: "Product not created", error: 1 });
    }
};


// exports.getAllProducts = async (req, res) => {
//     try {
//         const products = await ProductModal.find({ deleted_at: { $exists: false } })
//             .populate("unit")
//             .populate("shop_by_category")
//             .populate("brand");

//         res.status(200).json({ success : true, message: "Products fetched", error: 0, data: products });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success:false, message: "Could not fetch products", error: 1 });
//     }
// };


// GET /api/products?categoryType=cat123&brand=brand1,brand2&minPrice=50&maxPrice=300&rating=4

exports.getAllProducts = async (req, res) => {
    try {
        const {
            shop_category,
            category_type,
            brand,
            minPrice,
            maxPrice,
            rating
        } = req.query;

        const userId = req.userId


        console.log(userId)

        let query = { deleted_at: { $exists: false } };

        if (category_type) {
            query.shop_by_category = shop_category;
        }

        if (brand) {
            const brandIds = brand.split(",");
            query.brand = { $in: brandIds };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (rating) {
            query.rating = { $gte: parseFloat(rating) };
        }

        const products = await ProductModal.find(query)
            .populate("unit")
            .populate("shop_by_category")
            .populate("brand");


        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required to check wishlist",
                error: 1
            });
        }

        // Get all product IDs in the user's wishlist
        const wishlist = await WishlistModal.findOne({ user: userId }).select("items");

        // Extract only Product-type item IDs from wishlist
        const wishlistProductIds = wishlist
            ? wishlist.items
                .filter(i => i.item_type === 'Product')
                .map(i => i.item.toString())
            : [];

        // Add a "wishlist" flag to each product in the result
        const productsWithWishlistFlag = products.map(product => {
            return {
                ...product.toObject(),
                wishlist: wishlistProductIds.includes(product._id.toString())
            };
        });

        const filteredProducts = productsWithWishlistFlag.filter(product => {
            if (category_type && product.shop_by_category) {
                return product.shop_by_category.pet_category.toString() === category_type;
            }
            return true;
        });



        res.status(200).json({
            success: true,
            message: "Products fetched",
            error: 0,
            data: filteredProducts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not fetch products",
            error: 1
        });
    }
};





exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.query.userId || req.userId; // Use from query or token

        const product = await ProductModal.findOne({ _id: productId, deleted_at: { $exists: false } })
            .populate("unit")
            .populate("shop_by_category")
            .populate("brand");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                error: 1
            });
        }

        let isWishlisted = false;

        if (userId) {
            const inWishlist = await WishlistModal.findOne({
                user: userId,
                product: productId
            });

            isWishlisted = !!inWishlist;
        }

        const productData = {
            ...product.toObject(),
            wishlist: isWishlisted
        };

        res.status(200).json({
            success: true,
            message: "Product fetched",
            error: 0,
            data: productData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not fetch product",
            error: 1
        });
    }
};



exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find the existing product
        const existingProduct = await ProductModal.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found", error: 1 });
        }

        // If new files are uploaded, append to existing images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({ img: file.path }));

            // Append to existing images (if any)
            updateData.image = existingProduct.image
                ? [...existingProduct.image, ...newImages]
                : newImages;
        }

        const updatedProduct = await ProductModal.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ success: true, message: "Product updated", error: 0, data: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Product update failed", error: 1 });
    }
};




exports.softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await ProductModal.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found", error: 1 });
        }

        res.status(200).json({ success: true, message: "Product soft-deleted", error: 0, data: deletedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: "Soft delete failed", error: 1 });
    }
};



exports.deleteProductImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        // Find the description containing the image to delete
        const data = await ProductModal.findOneAndUpdate(
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



exports.clearAllProductImages = async (req, res) => {
    try {
        const { productid } = req.params;

        // Find the description by ID and remove all images
        const data = await ProductModal.findByIdAndUpdate(
            productid,
            { $set: { image: [] } },
            { new: true }
        );

        if (!data) {
            return res.status(500).json({ message: "data not found" });
        }

        // All images successfully deleted
        res.status(200).json({ message: "All images deleted successfully", data: data, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};