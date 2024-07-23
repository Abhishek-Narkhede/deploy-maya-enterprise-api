const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');

const configService = require('../service/globalconfig.service');

const addConfig = catchAsync(async (req, res) => {
    console.log("Add Config");
    try {
        const { deliveryCharges, currencyId, packagingCharges, location } = req.body;

        let configObj = { deliveryCharges, currencyId, packagingCharges, location };

        const configRes = await configService.addConfig(configObj);
        const config = configRes.config;
        sendResponse(res, httpStatus.CREATED, { config, msg: "Config created successfully" }, null);
    } catch (error) {
        console.error("Error in adding config", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const addOrUpdateConfig = catchAsync(async (req, res) => {
    console.log("Add or Update Config");
    try {
        const { deliveryCharges, currencyId, packagingCharges, location } = req.body;

        let configObj = { deliveryCharges, currencyId, packagingCharges, location };

        const configRes = await configService.addOrUpdateConfig(configObj);
        const config = configRes.config;
        sendResponse(res, httpStatus.CREATED, { config, msg: "Config created/updated successfully" }, null);
    } catch (error) {
        console.error("Error in adding/updating config", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateConfigById = catchAsync(async (req, res) => {
    console.log("Update Config");
    try {
        const { id } = req.params;
        const configId = id;
        console.log("Config ID::", configId);
        const updateFields = req.body;

        const configRes = await configService.updateConfigById(configId, updateFields);
        if (!configRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Config not found");
        }

        const config = configRes.config;
        sendResponse(res, httpStatus.OK, { msg: "Config updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating config", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const deleteConfigById = catchAsync(async (req, res) => {
    console.log("Soft Delete Config");
    try {
        const { id } = req.params;
        const configId = id;

        const configRes = await configService.deleteConfigById(configId);
        if (!configRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Config not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "Config deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting config", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getConfig = catchAsync(async (req, res) => {
    try {
        console.log("Get All Config");

        const configRes = await configService.getConfig();
        if (!configRes.status) {
            return sendResponse(res, configRes.code, null, "Config not found");
        }
        const config = configRes.data;
        sendResponse(res, httpStatus.OK, { data: config, msg: "Config retrieved successfully" }, null);
    } catch (error) {
        console.error("Error in getting config information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

module.exports = {
    addConfig,
    addOrUpdateConfig,
    updateConfigById,
    deleteConfigById,
    getConfig,
};
