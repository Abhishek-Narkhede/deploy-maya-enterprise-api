const express = require('express');
const validate = require('../../middlewares/validate');
const bannerValidation = require('../../modules/bannerImg/validation');
const bannerImgController = require('../../modules/bannerImg/controller/bannerImage.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add-banner-img',validate(bannerValidation.addBannerImg), bannerImgController.addBannerImage);
router.put('/update-banner-img/:id',validate(bannerValidation.updateBannerImg),bannerImgController.updateBannerImageById);
router.put('/delete-banner-img/:id',validate(bannerValidation.deleteBannerImg),bannerImgController.deleteBannerImageById);
router.get('/get-all-banner-img', bannerImgController.getAllBannerImage);

module.exports = router;