const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const storeController = require('../controller/storeController');
const auth = require('../controller/userAuthController')

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/update-user-data", auth, userController.updateUserData);
router.post("/update-user-data/change-password", auth, userController.changePassword)

router.get("/cart/product-list", auth, storeController.loadAllProduct);
router.post("/cart/add-product", auth, storeController.addProductToCart);
router.put("/cart/update-list", auth, storeController.updateCart);


module.exports = router