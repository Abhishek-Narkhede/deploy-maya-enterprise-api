const express = require("express");
const validate = require("../../middlewares/validate");
const categoryValidation = require("../../modules/category/validation");
const categoryController = require("../../modules/category/controller/categoryController");

const router = express.Router();
router.post(
  "/add",
  validate(categoryValidation.add),
  categoryController.addCategory
);
router.post("/all", categoryController.getCategory);
router.put(
  "/update/:id",
  validate(categoryValidation.update),
  categoryController.updateCategory
);
router.put(
  "/delete/:id",
  validate(categoryValidation.deleteCategory),
  categoryController.deleteCategory
);

module.exports = router;
