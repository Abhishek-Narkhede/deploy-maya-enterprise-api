const express = require("express");
const validate = require("../../middlewares/validate");
const validation = require("../../modules/checkout/validation");
const controller = require("../../modules/checkout/controller/checkoutController");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.post(
  "/create-checkout/:orderId",
  validate(validation.createCheckout),
  auth("manageUsers"),
  controller.createCheckout
);
router.get(
  "/get-session-info/:session_id",
  validate(validation.getSessionInfo),
  controller.getSessionInfo
);

module.exports = router;
