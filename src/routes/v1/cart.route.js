const express = require("express");
const validate = require("../../middlewares/validate");
const cartValidation = require("../../modules/cart/validation");
const cartController = require("../../modules/cart/controller/cartController");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.post(
  "/add",
  validate(cartValidation.add),
  cartController.addCartItem
);
router.get("/all-by-user/:userId", validate(cartValidation.getCartItemByUser), cartController.getCartItemByUser);

router.delete(
  "/delete/:id",
  validate(cartValidation.deleteCartItem),
  cartController.deleteCartItem
);
router.delete(
  "/remove-user-cart",
  auth(),
  cartController.removeUserCart
);
router.put(
  "/update/:id",
  validate(cartValidation.update),
  cartController.updateCart
);

module.exports = router;
