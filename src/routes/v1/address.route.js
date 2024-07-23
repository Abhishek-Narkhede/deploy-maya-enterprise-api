const express = require("express");
const validate = require("../../middlewares/validate");
const addressValidation = require("../../modules/address/address.validations");
const addressController = require("../../modules/address/controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/add-address").post(validate(addressValidation.addAddress), auth("manageUsers"), addressController.addAddressController);

router.route("/getAddress/:userId").get(auth("manageUsers"), addressController.getAddressById);

router.route("/get-allAddresses/").get(auth("adminAccess"), addressController.getAllAddresses);

router.route("/remove-address/:addressId").delete(auth("manageUsers"), addressController.removeAddress);

router.route("/update-address/:id").put(auth("manageUsers"), addressController.updateAddress);

module.exports = router;