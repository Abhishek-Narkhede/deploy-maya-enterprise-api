const express = require("express");
const validate = require("../../middlewares/validate");
const brandValidation = require("../../modules/brand/validation");
const brandController = require("../../modules/brand/controller/brandController");

const router = express.Router();
router.post(
  "/add",
  validate(brandValidation.add),
  brandController.addBrand
);
router.post("/all", brandController.getBrand);
router.get("/:id", validate(brandValidation.getBrandById), brandController.getBrandById);
router.get("/get-by-category/:categoryId", validate(brandValidation.getBrandsByCategoryId), brandController.getBrandsByCategoryId);
router.put(
  "/update/:id",
  validate(brandValidation.update),
  brandController.updateBrand
);
router.put(
  "/delete/:id",
  validate(brandValidation.deleteBrand),
  brandController.deleteBrand
);

module.exports = router;
