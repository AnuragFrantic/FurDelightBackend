const express = require('express');
const { createUserType, getAllUserTypes, getUserTypeById, deleteUserType, updateUserType } = require('../controller/UserTypeController');
const { verifyRoles } = require('../middleware/verifyroles');
const upload = require('../middleware/multerconfig');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controller/UserController');
const { sendOtp, verifyOtp, getAllOtp } = require('../controller/Auth/LoginController');
const { createSplashScreen, updateSplashScreen, getAllSplash } = require('../controller/SplashController');
const { createBanner, getallbanner, updatebanner, deleteBanner } = require('../controller/BannerController');
const { getallBrand, createBrand, deleteBrand, updateBrand } = require('../controller/BrandController');


const router = express.Router();

const uploadFields = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "graduation_certificate", maxCount: 1 },
    { name: "post_graduation_certificate", maxCount: 1 },
    { name: "mci_certificate", maxCount: 1 }
]);

// userType api






router.post('/user_type', createUserType);
router.get('/user_type', getAllUserTypes);
router.get('/user_type/:id', getUserTypeById);

router.put('/user_type/:id', updateUserType);

// router.delete('/user_type/:id', deleteUserType);

// user api

router.post("/create_user", uploadFields, createUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user_update/:id", uploadFields, updateUser);
router.delete("/delete_user/:id", deleteUser);

// otp

router.post("/send-otp", sendOtp);


router.post("/verify-otp", verifyOtp);
router.get("/allotp", getAllOtp);

// splash api 

router.get('/splash', getAllSplash)

router.post('/splash', upload.single('image'), createSplashScreen)
router.put("/splash/:id", upload.single("image"), updateSplashScreen);



// banner

router.post('/create_banner', upload.single('image'), createBanner)
router.get('/banner', getallbanner)
router.put('/banner_update/:id', updatebanner)
router.delete('/banner_delete/:id', deleteBanner)


// brand
router.get('/brand', getallBrand)
router.post('/brand', upload.single('image'), createBrand)
router.put('/update_brand/:id', updateBrand)

router.delete('/delete_brand/:id', deleteBrand)














module.exports = router;