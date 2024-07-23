const express = require('express');
const validate = require('../../middlewares/validate');
const paymentHistoryValidation = require('../../modules/paymentHistory/validation');
const paymentHistoryController = require('../../modules/paymentHistory/controller/paymentHistory.controller');

const router = express.Router();

router.post('/add', paymentHistoryController.addPaymentHistory);
router.post('/get-all', paymentHistoryController.getAllPaymentHistory);
module.exports = router;