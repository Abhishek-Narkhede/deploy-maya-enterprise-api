const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const currencyService = require('../service/currency.service');

const addCurrency = catchAsync(async (req, res) => {
    console.log("Add Currency");
    try {
        const { name, symbol } = req.body;

        let currencyObj = { name, symbol };

        const currencyRes = await currencyService.addCurrency(currencyObj);
        const currency = currencyRes.currency;
        sendResponse(res, httpStatus.CREATED, { data:currency, msg: "Currency created successfully" }, null);
    } catch (error) {
        console.error("Error in adding currency", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateCurrencyById = catchAsync(async (req, res) => {
    console.log("Update Currency");
    try {
        const { id } = req.params;
        const currencyId = id;
        console.log("Currency ID::", currencyId);
        const updateFields = req.body;

        const currencyRes = await currencyService.updateCurrencyById(currencyId, updateFields);
        if (!currencyRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Currency not found");
        }

        const currency = currencyRes.currency;
        sendResponse(res, httpStatus.OK, { currency, msg: "Currency updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating currency", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const deleteCurrencyById = catchAsync(async (req, res) => {
    console.log("Soft Delete Currency");
    try {
        const { id } = req.params;
        const currencyId = id;

        const currencyRes = await currencyService.deleteCurrencyById(currencyId);
        if (!currencyRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Currency not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "Currency deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting currency", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getAllCurrencies = catchAsync(async (req, res) => {
    try {
        console.log("Get All Currencies");

        const currencyRes = await currencyService.getAllCurrencies();
        if (!currencyRes.status) {
            return sendResponse(res, currencyRes.code, null, "Currencies not found");
        }
        const currencies = currencyRes.data;
        sendResponse(res, httpStatus.OK, { data: currencies, msg: "Currencies retrieved successfully" }, null);
    } catch (error) {
        console.error("Error in getting currencies information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getCurrenciesById = catchAsync(async (req, res) => {
    try {
        console.log("Get Currency by id");

        const currencyId = req.params.id; // Get the currency ID from the request parameters
        const currencyRes = await currencyService.getCurrenciesById(currencyId); // Pass the ID to the service method
        if (!currencyRes.status) {
            return sendResponse(res, currencyRes.code, null, "Currency not found");
        }
        const currency = currencyRes.data;
        sendResponse(res, httpStatus.OK, { data: currency, msg: "Currency retrieved successfully" }, null);
    } catch (error) {
        console.error("Error in getting currency information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

module.exports = {
    addCurrency,
    updateCurrencyById,
    deleteCurrencyById,
    getAllCurrencies,
    getCurrenciesById
};
