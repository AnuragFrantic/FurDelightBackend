const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to ensure the directory exists
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = "";

        if (file.mimetype.startsWith("image/")) {
            uploadPath = "uploads/images"; // Store images
        } else if (
            file.mimetype === "application/pdf" ||
            file.mimetype === "application/msword" ||
            file.mimetype.startsWith("application/vnd.openxmlformats-officedocument")
        ) {
            uploadPath = "uploads/certificates"; // Store certificates (PDF, DOC, DOCX)
        } else {
            return cb(new Error("Unsupported file type"), false);
        }

        // Ensure the directory exists before storing the file
        ensureDirectoryExists(uploadPath);

        // Proceed to save the file in the determined directory
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype.startsWith("application/vnd.openxmlformats-officedocument")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only images or certificates (PDF, DOC, DOCX) are allowed!"), false);
    }
};

// Configure multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // Limit file size to 50MB
    fileFilter: fileFilter,
});

module.exports = upload;
