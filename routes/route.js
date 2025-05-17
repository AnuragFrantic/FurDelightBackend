const express = require('express');
const { createUserType, getAllUserTypes, getUserTypeById, updateUserType, deleteUserType } = require('../controller/UserTypeController');

const upload = require('../middleware/multerconfig');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getProfile } = require('../controller/UserController');
const { sendOtp, verifyOtp, getAllOtp, loginWithEmailPassword } = require('../controller/Auth/LoginController');
const { createSplashScreen, updateSplashScreen, getAllSplash, deleteSplash } = require('../controller/SplashController');
const { createBanner, getallbanner, updatebanner, deleteBanner } = require('../controller/BannerController');
const { getallBrand, createBrand, deleteBrand, updateBrand } = require('../controller/BrandController');
const authMiddleware = require('../middleware/authmiddleware');
const { createPettype, updatePettype, getAllPettypes, getPettypeById, deletePettype } = require('../controller/PetTypeController');
const { createPetBreed, getAllPetBreeds, getPetBreedById, updatePetBreed, deletePetBreed } = require('../controller/PetBreedController');

const { createPet, getAllPets, getPetById, updatePet, deletePet, getMyPets, addPetFormEntry, deletePetFormEntry } = require('../controller/PetController');
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

const { createProductVariant, getAllProductVariants, getProductVariantById, updateProductVariant, deleteProductVariant, deleteProductVariantImage, getvariantbyproduct } = require('../controller/ProductVariant');
const auth = require('../middleware/auth');
const authmiddleware = require('../middleware/authmiddleware');
const { createForm, getFormById, getAllForms, updateForm, deleteForm } = require('../controller/PetProfileForm');
const { createVaccination, getAllVaccinations, getVaccinationById, updateVaccination, deleteVaccination } = require('../controller/UpcomingVaccination');
const { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord } = require('../controller/MyRecords');
const { createFaq, getAllFaqs, getFaqById, updateFaq, deleteFaq } = require('../controller/FaqController');
const { createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy } = require('../controller/PolicyController');
const { addToCart, getCartItems, removeCartItem, updateCartItemQuantity } = require('../controller/CartController');
const { addShippingAddress, setActiveShippingAddress, getUserShippingAddresses, getActiveShippingAddress } = require('../controller/ShippingAddressController');
const { createOrder, completeOnlinePayment, confirmCODPayment, getUserOrders, deleteOrder, updateOrderStatus, failOnlinePayment } = require('../controller/OrderController');






const router = express.Router();

const uploadFields = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "graduation_certificate", maxCount: 1 },
    { name: "post_graduation_certificate", maxCount: 1 },
    { name: "mci_certificate", maxCount: 1 }
]);




// userType api






router.post('/user_type', auth("usertype", "Write"), createUserType);
router.get('/user_type', auth("usertype", "Read"), getAllUserTypes);
router.get('/user_type/:id', auth("usertype", "Read"), getUserTypeById);
router.put('/user_type/:id', auth("usertype", "Delete"), updateUserType);

// router.delete('/user_type/:id', deleteUserType);

// user api

router.post("/create_user", uploadFields, createUser);
router.get("/users", getAllUsers);
router.get("/profile", auth("user", "Read"), getProfile);
router.get("/single_user/:id", getUserById);

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
router.get('/banner', auth('banner', 'Read'), getallbanner)
router.put('/banner_update/:id', upload.single('image'), updatebanner)
router.delete('/banner_delete/:id', deleteBanner)


// brand
router.get('/brand', getallBrand)
router.post('/brand', upload.single('image'), createBrand)
router.put('/update_brand/:id', updateBrand)
router.delete('/delete_brand/:id', deleteBrand)




// Pet Type

router.post(
    "/pet_type",
    auth("pettype", "Read"),
    upload.single("image"),
    createPettype
);

// Get all Pettypes
router.get("/pet_type", auth("pettype", "Read"), getAllPettypes);

// Get Pettype by ID
router.get("/pet_type/:id", getPettypeById);

// Update Pettype (with optional image)
router.put(
    "/pet_type_update/:id",
    auth("pettype", "Update"),
    upload.single("image"),
    updatePettype
);

// Soft Delete Pettype
router.delete("/pet_type_delete/:id", deletePettype);


// Pet Breed  Api


// Create
router.post(
    "/pet_breeds",
    auth("petbreed", "Write"),
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
    auth("petbreed", "Update"),
    upload.single("image"),
    updatePetBreed
);

// Soft delete
router.delete(
    "/pet_breeds/:id",
    auth("petbreed", "Delete"),
    deletePetBreed
);




// pet 
router.post('/pet', auth("pet", "Write"), upload.single('image'), createPet);
router.get('/pet', getAllPets);
router.get('/pet/:id', getPetById);
router.put('/pet/:id', auth("pet", "Update"), upload.single('image'), updatePet);
router.get("/my-pets", auth("pet", "Read"), getMyPets);
router.delete('/pet/:id', deletePet);
router.post('/pet/:id/pet_form', addPetFormEntry);
router.delete('/pets/:id/form/:questionId', deletePetFormEntry);


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
router.get('/product', auth("product", "Read"), getAllProducts);
router.get('/product/:id', auth("product", "Read"), getProductById);
router.put('/update_product/:id', upload.array('image', 10), updateProduct);
router.delete('/product_delete/soft/:id', softDeleteProduct);
router.delete("/delete-image/:imageId", deleteProductImage);
router.delete("/product/:productid/images", clearAllProductImages);



// prouctvariant

router.post('/product_variant', upload.array('image', 8), auth('productvariant', "Write"), createProductVariant);
router.get('/product_variant', auth('productvariant', "Read"), getAllProductVariants);
router.get('/product_variant/:id', auth('productvariant', "Read"), getProductVariantById);

router.get('/variant_by_product/:id', auth('productvariant', "Read"), getvariantbyproduct)
router.put('/update_product_variant/:id', updateProductVariant);
router.delete('/delete_product_variant/:id', deleteProductVariant);
router.delete("/delete-variantimage/:imageId", deleteProductVariantImage);


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
    auth("petfoodtype", "Write"),
    createPetfoodType
);

// Get all PetFoodtypes
router.get("/petfood_type", getAllPetfoodtypes);

// Get Pettype by ID
router.get("/petfood_type/:id", getPetfoodtypeById);

// Update Pettype (with optional image)
router.put(
    "/petfood_type_update/:id",
    auth("petfoodtype", "Update"),

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
router.post('/booking', auth("booking", "Write"), create_booking);
router.get('/booking', auth("booking", "Read"), get_booking);

// slots


router.post('/doctorslot', auth("slot", "Write"), doctorCreateSlot);
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


router.post('/wishlist', auth("wishlist", "Write"), addToWishlist);
router.get('/wishlist', getAllWishlists);
router.get('/my_wishlist', auth("wishlist", "Read"), getMyWishlist);
router.get('/wishlist/doctors', auth("wishlist", "Read"), getMyDoctorWishlist);
router.delete('/wishlist/delete', auth("wishlist", "Delete"), deleteWishlist);




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



// pet form

router.post('/pet_form', createForm);
router.get('/pet_form', getAllForms);
router.get('/pet_form/:id', getFormById);
router.put('/update_pet_form/:id', updateForm);
router.delete('/delete_pet_form/:id', deleteForm);


// upcomingvaccination




router.post("/upcoming_vaccination", createVaccination);
router.get("/upcoming_vaccination", getAllVaccinations);
router.get("/upcoming_vaccination/:id", getVaccinationById);
router.put("/update_upcoming_vaccination/:id", updateVaccination);
router.delete("/delete_upcoming_vaccination/:id", deleteVaccination);


// my record

router.post("/my_record", auth("records", "Write"), createRecord);
router.get("/my_record", auth("records", "Read"), getAllRecords);
router.get("/my_record/:id", getRecordById);
router.put("/update_my_record/:id", updateRecord);
router.delete("/delete_my_record/:id", deleteRecord);



//Faq

router.post('/faq', auth("faq", "Write"), createFaq);

// Get all FAQs - public
router.get('/faq', getAllFaqs);

// Get FAQ by ID - public
router.get('/faq/:id', getFaqById);

// Update FAQ by ID - requires authentication
router.put('/faq/:id', auth("faq", "Update"), updateFaq);

// Soft delete FAQ by ID - requires authentication
router.delete('/delete_faq/:id', auth("faq", "Delete"), deleteFaq);


// 

router.post('/policy', auth("policy", "Write"), createPolicy);

// Get all policies
router.get('/policy', getAllPolicies);

// Get a policy by ID
router.get('/policy/:id', getPolicyById);

// Update a policy by ID
router.put('/policy/:id', auth("policy", "Update"), updatePolicy);

// Soft delete a policy by ID
router.delete('/policy/:id', auth("policy", "Delete"), deletePolicy);




// Cart

// Add or update cart
router.post('/add_to_cart', auth("cart", "Write"), addToCart);

// Get cart for user
router.get('/cart', auth("cart", "Read"), getCartItems);

// Remove cart item
router.delete('/delete_cart/:cartItemId', auth("cart", "Delete"), removeCartItem);

// Update quantity
router.put('/update_cart/:cartItemId', auth("cart", "Update"), updateCartItemQuantity);



// shipping address
router.post(
    "/shipping-address",
    auth("address", "Write"),
    addShippingAddress
);

// Set an existing address as active
router.put(
    "/shipping-address/:addressId/activate",
    auth("address", "Update"),
    setActiveShippingAddress
);

// Get all addresses of the user
router.get(
    "/shipping-address",
    auth("address", "Read"),
    getUserShippingAddresses
);

// Get only the active shipping address
router.get(
    "/shipping-address/active",
    auth("address", "Read"),
    getActiveShippingAddress
);




// ORder Routes


router.post('/place_order', auth("order", "Write"), createOrder);

// Complete online payment (usually called via webhook or frontend callback)
router.post('/orders/complete-payment', auth("order", "Write"), completeOnlinePayment);


router.post(
    "/orders/payment-failed",
    auth("order", "Write"),
    failOnlinePayment
);

// Confirm COD payment (mark COD order as paid, admin or user confirmation)
router.post('/orders/:orderId/confirm-cod', auth("order", "Write"), confirmCODPayment);

// Get all orders of logged-in user
router.get('/orders', auth("order", "Read"), getUserOrders);

// Soft delete an order
router.delete('/orders/:orderId', auth("order", "Delete"), deleteOrder);

// Admin or authorized user updates payment or order status
router.put('/orders/:orderId/status', auth("order", "Update"), updateOrderStatus);


module.exports = router;





