const ProductVariant = require('../models/ProductVariant');


// with multiple size mutl

// exports.createProductVariant = async (req, res) => {
//     try {
//         const { product, name, price, mrp, sku } = req.body;

//         // Collect variants from req.body
//         const variants = req.body.variants || [];



//         const newVariant = new ProductVariant({
//             product,
//             name,
//             price: Number(price),
//             mrp: Number(mrp),
//             sku,
//             variants,
//             created_by: req.user?._id || null
//         });

//         // Handle image uploads
//         if (req.files && req.files.length > 0) {
//             newVariant.image = req.files.map(file => ({
//                 img: file.path
//             }));
//         }

//         // Save the variant to the database
//         const savedVariant = await newVariant.save();

//         return res.status(201).json({
//             success: true,
//             error: 0,
//             message: "Product Variant created successfully",
//             data: savedVariant
//         });

//     } catch (error) {
//         console.error("Error creating product variant:", error);
//         return res.status(500).json({
//             success: false,
//             error: 1,
//             message: "Failed to create product variant",
//             error: error.message
//         });
//     }
// };




exports.createProductVariant = async (req, res) => {
    try {
        const variantData = req.body;

        const newVariant = new ProductVariant(variantData);
        if (req.files && req.files.length > 0) {
            newVariant.image = req.files.map(file => ({
                img: file.path
            }));
        }

        await newVariant.save();

        res.status(201).json({ success: true, message: "Product Variant created", data: newVariant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// Get all Product Variants (optionally filtered by product)
exports.getAllProductVariants = async (req, res) => {
    try {
        const filter = {};
        if (req.query.product) filter.product = req.query.product;

        const variants = await ProductVariant.find(filter)
            .populate("product", "title")
        res.json({ success: true, data: variants, error: 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error: 1 });
    }
};

// Get a single Product Variant by ID
exports.getProductVariantById = async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.id)
            .populate("product", "title")
            .populate("unit", "title");

        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found", error: 1 });
        }

        res.json({ success: true, data: variant, error: 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error: 1 });
    }
};


// exports.updateProductVariant = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find the existing product variant
//         const existingProduct = await ProductVariant.findById(id);
//         if (!existingProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product Variant not found",
//                 error: 1
//             });
//         }

//         // Simplified variant parsing
//         const variants = req.body.variants || existingProduct.variants;

//         // Build updateData object
//         const updateData = {
//             product: req.body.product || existingProduct.product,
//             name: req.body.name || existingProduct.name,
//             price: req.body.price || existingProduct.price,
//             mrp: req.body.mrp || existingProduct.mrp,
//             sku: req.body.sku || existingProduct.sku,
//             variants, // Use parsed or existing variants
//         };

//         // Handle image uploads (if any)
//         if (req.files && req.files.length > 0) {
//             const newImages = req.files.map(file => ({ img: file.path }));
//             updateData.image = existingProduct.image
//                 ? [...existingProduct.image, ...newImages]
//                 : newImages;
//         }

//         // Update the product variant in the database
//         const updatedProduct = await ProductVariant.findByIdAndUpdate(id, updateData, { new: true });

//         return res.status(200).json({
//             success: true,
//             message: "Product Variant updated successfully",
//             error: 0,
//             data: updatedProduct
//         });
//     } catch (err) {
//         console.error("Error updating product variant:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update product variant",
//             error: 1
//         });
//     }
// };




exports.updateProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find the existing product
        const existingProduct = await ProductVariant.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product Variant not found", error: 1 });
        }

        // If new files are uploaded, append to existing images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({ img: file.path }));

            // Append to existing images (if any)
            updateData.image = existingProduct.image
                ? [...existingProduct.image, ...newImages]
                : newImages;
        }

        const updatedProduct = await ProductVariant.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ success: true, message: "Product Variant updated", error: 0, data: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Product Variant update failed", error: 1 });
    }
};






exports.deleteProductVariant = async (req, res) => {
    try {
        const deleted = await ProductVariant.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Variant not found", error: 1 });
        }

        res.json({ success: true, message: "Variant soft deleted", data: deleted, error: 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error: 1 });
    }
};



exports.deleteProductVariantImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        // Find the description containing the image to delete
        const data = await ProductVariant.findOneAndUpdate(
            { "image._id": imageId },
            { $pull: { image: { _id: imageId } } },
            { new: true }
        );



        if (!data) {
            return res.status(500).json({ message: "data not found", error: 1 });
        }

        // Image successfully deleted
        res.status(200).json({ message: "Image deleted successfully", data: data, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};