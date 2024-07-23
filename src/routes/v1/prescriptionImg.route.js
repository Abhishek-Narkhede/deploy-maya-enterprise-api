const express = require('express');
const validate = require('../../middlewares/validate');
const prescriptionValidation = require('../../modules/prescription/validation');
const prescriptionImgController = require('../../modules/prescription/controller/prescription.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add-prescription-img',validate(prescriptionValidation.addPresecriptionImg), prescriptionImgController.addPrescriptionImage);
router.put('/update-prescription-img/:id',validate(prescriptionValidation.updatePrescriptionImg),prescriptionImgController.updateprescriptionImageById);
router.put('/delete-prescription-img/:id',validate(prescriptionValidation.deletePrescriptionImg),prescriptionImgController.deleteprescriptionImageById);
router.get('/get-all-prescription-img', prescriptionImgController.getAllprescriptionImage);
router.get('/get-prescription-by-user/:id', prescriptionImgController.getPrescriptionByUserId);

module.exports = router;