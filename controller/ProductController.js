const ProductModal = require('../models/Product')



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
        res.status(201).json({ status: "OK", message: "Product created successfully", error: 0, data: product });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ status: "Error", message: "Product not created", error: 1 });
    }
};


// exports.getAllProducts = async (req, res) => {
//     try {
//         const products = await ProductModal.find({ deleted_at: { $exists: false } })
//             .populate("unit")
//             .populate("shop_by_category")
//             .populate("brand");

//         res.status(200).json({ status: "OK", message: "Products fetched", error: 0, data: products });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ status: "Error", message: "Could not fetch products", error: 1 });
//     }
// };


// GET /api/products?categoryType=cat123&brand=brand1,brand2&minPrice=50&maxPrice=300&rating=4

exports.getAllProducts = async (req, res) => {
    try {
        const {
            categoryType,
            brand,
            minPrice,
            maxPrice,
            rating
        } = req.query;

        let query = { deleted_at: { $exists: false } };

        if (categoryType) {
            query.shop_by_category = categoryType;
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

        res.status(200).json({
            status: "OK",
            message: "Products fetched",
            error: 0,
            data: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Could not fetch products",
            error: 1
        });
    }
};





exports.getProductById = async (req, res) => {
    try {
        const product = await ProductModal.findOne({ _id: req.params.id, deleted_at: { $exists: false } });

        if (!product) {
            return res.status(404).json({ status: "Error", message: "Product not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Product fetched", error: 0, data: product });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Could not fetch product", error: 1 });
    }
};



exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Optional: Handle new images
        if (req.files && req.files.length > 0) {
            updateData.image = req.files.map(file => ({ img: file.path }));
        }

        const updatedProduct = await ProductModal.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ status: "Error", message: "Product not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Product updated", error: 0, data: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error", message: "Product update failed", error: 1 });
    }
};



exports.softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await ProductModal.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });

        if (!deletedProduct) {
            return res.status(404).json({ status: "Error", message: "Product not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Product soft-deleted", error: 0, data: deletedProduct });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Soft delete failed", error: 1 });
    }
};
