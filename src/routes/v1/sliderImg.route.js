const express = require('express');
const validate = require('../../middlewares/validate');
const sliderValidation = require('../../modules/sliderImages/validation');
const sliderImgController = require('../../modules/sliderImages/controller/sliderImage.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add-slider-img',validate(sliderValidation.addSliderImg), sliderImgController.addSliderImage);
router.put('/update-slider-img/:id',validate(sliderValidation.updateSliderImg), sliderImgController.updateSliderImageById);
router.put('/delete-slider-img/:id',validate(sliderValidation.deleteSliderImg), sliderImgController.deleteSliderImageById);
router.get('/get-all-slider-img', sliderImgController.getAllSliderImage);

module.exports = router;