const express = require('express');
const { createUserType, getAllUserTypes, getUserTypeById, updateUserType, deleteUserType } = require('../controller/UserTypeController');
const { verifyRoles } = require('../middleware/verifyroles');
const upload = require('../middleware/multerconfig');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getProfile } = require('../controller/UserController');
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
const { CreateCategory, getAllCategory, updateCategory, deleteCategory } = require('../controller/Categories');
const { createShop, getAllShopCategory, updateShopCategory, deleteShopCategory } = require('../controller/ShopbyCateory');
const { createProduct, getAllProducts, getProductById, updateProduct, softDeleteProduct, deleteProductImage, clearAllProductImages } = require('../controller/ProductController');
const { createevents, getAllEvents, getEventsById, updateEvents, softDeleteEvents, deleteEventsImage } = require('../controller/PetEvents');
const { createUnit, getAllUnits, getUnitById, updateUnit, softDeleteUnit } = require('../controller/UnitController');
const { createPetfoodType, getAllPetfoodtypes, getPetfoodtypeById, updatePetfoodtype, deletePetfoodtype } = require('../controller/PetFoodType');
const { CreatePetFood, getAllPetFood, updatePetFood, deletePetFood } = require('../controller/PetFoodController');
const { createPetActivity, getAllActivity, deletePetActivity, updatePetActivity } = require('../controller/PetActivityController');
const { create_booking, get_booking } = require('../controller/BookingController');
const { get_slot, getAllDoctorSlots, doctorCreateSlot } = require('../controller/SlotController');
const { getAllWishlists, getMyWishlist, getMyDoctorWishlist, deleteWishlist, addToWishlist } = require('../controller/WishlistController');
const { createSlot, getSlotById, updateSlot, deleteSlot, getAllSlots } = require('../controller/SlotListController');
const { createModule, getAllModules, getModuleById, updateModule, deleteModule } = require('../controller/PermissionController/ModulesController');
const { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission } = require('../controller/PermissionController/DefaultPermissionController');
const verifyroles = require('../middleware/verifyroles');


const readAccess = verifyroles(["Read"]);
const writeAccess = verifyroles(["Write"]);
const updateAccess = verifyroles(["Update"]);
const deleteAccess = verifyroles(["Delete"]);
const fullAccessMiddleware = verifyroles(["Read", "Write", "Update", "Delete"]);


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
router.get("/profile", authMiddleware, getProfile);
router.get("/single_user/:id", getUserById);

router.put("/user_update/:id", uploadFields, updateUser);
router.delete("/delete_user/:id", deleteUser);

// otp

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/allotp", getAllOtp);
router.post("/login", loginWithEmailPassword);

// splash api 

router.get('/splash', authmiddleware, readAccess, getAllSplash)


router.post('/splash', upload.single('image'), writeAccess, createSplashScreen)
router.put("/splash/:id", upload.single("image"), updateAccess, updateSplashScreen);
router.delete('/delete_splash/:id', deleteAccess, deleteSplash)


// banner

router.post('/create_banner', upload.single('image'), writeAccess, createBanner)
router.get('/banner', authmiddleware, readAccess, getallbanner)
router.put('/banner_update/:id', upload.single('image'), updateAccess, updatebanner)
router.delete('/banner_delete/:id', deleteAccess, deleteBanner)


// brand
router.get('/brand', readAccess, getallBrand)
router.post('/brand', upload.single('image'), writeAccess, createBrand)
router.put('/update_brand/:id', updateAccess, updateBrand)
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


// category


router.post('/category', upload.single("image"), CreateCategory)
router.get('/category', getAllCategory)
router.put('/update_category/:id', upload.single("image"), updateCategory)
router.delete('/category_delete/:id', deleteCategory)


// shop by category

router.post('/shop_by_category', upload.single("image"), createShop)
router.get('/shop_by_category', getAllShopCategory)
router.put('/update_shop_category/:id', upload.single("image"), updateShopCategory)
router.delete('/delete_shop_category/:id', deleteShopCategory)


// product 

router.post('/product', upload.array('image', 8), createProduct)
router.get('/product', authMiddleware, getAllProducts);
router.get('/product/:id', authMiddleware, getProductById);
router.put('/update_product/:id', upload.array('image', 10), updateProduct);
router.delete('/product_delete/soft/:id', softDeleteProduct);
router.delete("/delete-image/:imageId", deleteProductImage);
router.delete("/product/:productid/images", clearAllProductImages);

// events

router.post('/events', upload.array('image', 8), createevents)
router.get('/events', getAllEvents);
router.get('/events/:id', getEventsById);
router.put('/update_events/:id', upload.array('images', 10), updateEvents);
router.delete('/delete_events/:id', softDeleteEvents);
router.delete("/delete-eventimage/:imageId", deleteEventsImage);



// unit

router.post("/unit", createUnit);
router.get("/unit", getAllUnits);
router.get("/unit/:id", getUnitById);
router.put("/unit/:id", updateUnit);
router.delete("/delete_unit/:id", softDeleteUnit);



// petfoodtype Api


router.post(
    "/petfood_type",
    authmiddleware,
    createPetfoodType
);

// Get all PetFoodtypes
router.get("/petfood_type", getAllPetfoodtypes);

// Get Pettype by ID
router.get("/petfood_type/:id", getPetfoodtypeById);

// Update Pettype (with optional image)
router.put(
    "/petfood_type_update/:id",
    authmiddleware,

    updatePetfoodtype
);

// Soft Delete Pettype
router.delete("/petfood_type_delete/:id", deletePetfoodtype);




// Pet Food

router.post('/pet_food', upload.single("image"), CreatePetFood)
router.get('/pet_food', getAllPetFood)
router.put('/update_petfood/:id', upload.single("image"), updatePetFood)
router.delete('/petfood_delete/:id', deletePetFood)



// petActivity


router.post('/pet_activity', upload.single("image"), createPetActivity)
router.put('/updatepet_activity/:id', upload.single("image"), updatePetActivity)
router.get('/pet_activity', getAllActivity)
router.delete('/pet_activity/:id', deletePetActivity)

// Booking
router.post('/booking', authmiddleware, create_booking);
router.get('/booking', authmiddleware, get_booking);

// slots


router.post('/doctorslot', authmiddleware, doctorCreateSlot);
router.get('/doctorslot', get_slot);
router.get('/doctorslot/all', getAllDoctorSlots);


// slotlist
router.post('/slots', createSlot);
// 🔵 Get all Slots
router.get('/slots', getAllSlots);
// 🟣 Get a specific Slot by ID
router.get('/slots/:id', getSlotById);
// 🟡 Update a Slot by ID
router.put('/slots/:id', updateSlot);
// 🔴 Delete a Slot by ID
router.delete('/slots/:id', deleteSlot);



// wishlist


router.post('/wishlist', authmiddleware, addToWishlist);
router.get('/wishlist', getAllWishlists); // admin
router.get('/my_wishlist', authmiddleware, getMyWishlist);
router.get('/wishlist/doctors', authmiddleware, getMyDoctorWishlist);
router.delete('/wishlist/delete', authmiddleware, deleteWishlist);




//module

router.post('/module', upload.single('image'), createModule);
router.get('/module', getAllModules);
router.get('/module/:id', getModuleById);

router.put('/module/:id', upload.single('image'), updateModule);

router.delete('/delete-module/:id', deleteModule);


//default- permission

router.post('/default-permission', createPermission);
router.get('/default-permission', getAllPermissions);

router.get('/default-permission/:id', getPermissionById);

router.put('/default-permission/:id', updatePermission);

router.delete('/delete_default-permission/:id', deletePermission);





module.exports = router;





