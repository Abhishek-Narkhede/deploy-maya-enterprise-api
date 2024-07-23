

const express = require('express');
const validate = require('../../middlewares/validate');
const currencyValidation = require('../../modules/currency/validation');
const CurrencyController = require('../../modules/currency/controller/currency.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add-currency', CurrencyController.addCurrency);
router.get('/get-all-currency', CurrencyController.getAllCurrencies);
router.put('/update-currency/:id', CurrencyController.updateCurrencyById);
router.put('/delete-currency/:id', CurrencyController.deleteCurrencyById);
router.get('/get-currency/:id', CurrencyController.getCurrenciesById);


module.exports = router;