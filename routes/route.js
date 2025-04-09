const express = require('express');
const { createUserType, getAllUserTypes, getUserTypeById, updateUserType } = require('../controller/UserTypeController');
const { verifyRoles } = require('../middleware/verifyroles');
const upload = require('../middleware/multerconfig');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controller/UserController');
const { sendOtp, verifyOtp, getAllOtp, loginWithEmailPassword } = require('../controller/Auth/LoginController');
const { createSplashScreen, updateSplashScreen, getAllSplash, deleteSplash } = require('../controller/SplashController');
const { createBanner, getallbanner, updatebanner, deleteBanner } = require('../controller/BannerController');
const { getallBrand, createBrand, deleteBrand, updateBrand } = require('../controller/BrandController');
const authMiddleware = require('../middleware/authmiddleware');
const { createPettype, updatePettype, getAllPettypes, getPettypeById, deletePettype } = require('../controller/PetTypeController');
const { createPetBreed, getAllPetBreeds, getPetBreedById, updatePetBreed, deletePetBreed } = require('../controller/PetBreedController');
const authmiddleware = require('../middleware/authmiddleware');
const { createPet, getAllPets, getPetById, updatePet, deletePet, getMyPets } = require('../controller/PetController');
const { createPetEssential, getAllPetEssentials, getPetEssentialById, updatePetEssential, deletePetEssential } = require('../controller/PetEssentialController');



const router = express.Router();

const uploadFields = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "graduation_certificate", maxCount: 1 },
    { name: "post_graduation_certificate", maxCount: 1 },
    { name: "mci_certificate", maxCount: 1 }
]);

// userType api






router.post('/user_type', createUserType);
router.get('/user_type', authMiddleware, getAllUserTypes);
router.get('/user_type/:id', getUserTypeById);
router.put('/user_type/:id', updateUserType);

// router.delete('/user_type/:id', deleteUserType);

// user api

router.post("/create_user", uploadFields, createUser);
router.get("/users", getAllUsers);
router.get("/profile", authMiddleware, getUserById);
router.put("/user_update/:id", uploadFields, updateUser);
router.delete("/delete_user/:id", deleteUser);

// otp

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/allotp", getAllOtp);
router.post("/login", loginWithEmailPassword);

// splash api 

router.get('/splash', getAllSplash)
router.post('/splash', upload.single('image'), createSplashScreen)
router.put("/splash/:id", upload.single("image"), updateSplashScreen);
router.delete('/delete_splash/:id', deleteSplash)


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




// Pet Type

router.post(
    "/pet_type",
    authmiddleware,
    upload.single("image"),
    createPettype
);


// Get all Pettypes
router.get("/pet_type", getAllPettypes);

// Get Pettype by ID
router.get("/pet_type/:id", getPettypeById);

// Update Pettype (with optional image)
router.put(
    "/pet_type_update/:id",
    authmiddleware,
    upload.single("image"),
    updatePettype
);

// Soft Delete Pettype
router.delete("/pet_type_delete/:id", deletePettype);


// Pet Breed  Api


// Create
router.post(
    "/pet_breeds",
    authmiddleware,
    upload.single("image"),
    createPetBreed
);

// Get all
router.get("/pet_breeds", getAllPetBreeds);

// Get by ID
router.get("/pet_breeds/:id", getPetBreedById);

// Update
router.put(
    "/pet_breeds/:id",
    authmiddleware,
    upload.single("image"),
    updatePetBreed
);

// Soft delete
router.delete(
    "/pet_breeds/:id",
    authmiddleware,
    deletePetBreed
);




// pet 
router.post('/pet', authmiddleware, upload.single('image'), createPet);
router.get('/pet', getAllPets);
router.get('/pet/:id', getPetById);
router.put('/pet/:id', authmiddleware, upload.single('image'), updatePet);
router.get("/my-pets", authmiddleware, getMyPets);
router.delete('/pet/:id', deletePet);

// pet Essential


router.post('/pet_essential', upload.single('image'), createPetEssential);
router.get('/pet_essential', getAllPetEssentials);
router.get('/pet_essential/:id', getPetEssentialById);
router.put('/pet_essential/:id', upload.single('image'), updatePetEssential);
router.delete('/pet_essential/:id', deletePetEssential);








module.exports = router;