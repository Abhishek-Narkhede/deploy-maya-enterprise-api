const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const prescriptionService = require('../service/prescription.service')


const addPrescriptionImage = catchAsync(async (req, res) => {
    console.log("Add prescription Image");
    try {
        const { userId, prescriptionImgUrl, title } = req.body;

        let prescriptionImgObj = { userId, prescriptionImgUrl, title };

        const prescriptionImgRes = await prescriptionService.addPrescriptionImage(prescriptionImgObj);
        const prescriptionImg = prescriptionImgRes.prescription;
        sendResponse(res, httpStatus.CREATED, { data: prescriptionImg, msg: "prescription image created successfully" }, null);
    } catch (error) {
        console.error("Error in registration", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateprescriptionImageById = catchAsync(async (req, res) => {
    console.log("Update prescription Image ");
    try {
        const { id } = req.params;
        const prescriptionImgId = id;
        console.log("prescription Image ::", prescriptionImgId)
        const updateFields = req.body;

        const prescriptionImgRes = await prescriptionService.updateprescriptionImageById(prescriptionImgId, updateFields);
        if (!prescriptionImgRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "prescription image not found");
        }

        const prescriptionImg = prescriptionImgRes;
        sendResponse(res, httpStatus.OK, { msg: "prescription image updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating prescription image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


const deleteprescriptionImageById = catchAsync(async (req, res) => {
    console.log("Soft Delete prescription image");
    try {
        const { id } = req.params;
        const prescriptionImgId = id

        const prescriptionImgRes = await prescriptionService.deleteprescriptionImageById(prescriptionImgId);
        if (!prescriptionImgRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "prescription image not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "prescription image deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting prescription image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getAllprescriptionImage = catchAsync(async (req, res) => {
    try {
        console.log("Get prescription Image All ");

        const prescriptionImgRes = await prescriptionService.getAllprescriptionImage();
        if (!prescriptionImgRes.status) {
            return sendResponse(res, prescriptionImgRes.code, null, "prescription image not found");
        }
        const prescriptionImg = prescriptionImgRes.data;
        sendResponse(res, httpStatus.OK, { data: prescriptionImg, msg: "prescription image get successfully" }, null);
    } catch (error) {
        console.error("Error in getting prescription image information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getPrescriptionByUserId = catchAsync(async (req, res) => {
    try {
        const userId = req.params.id; // Assuming you're passing userId as a parameter
        console.log(`Get prescriptions for user with ID: ${userId}`);

        const prescriptionRes = await prescriptionService.getPrescriptionByUserId(userId);

        if (!prescriptionRes.status) {
            return sendResponse(res, prescriptionRes.code, { data: [], msg: "Prescriptions not found for this user" }, null);
        }

        const prescriptions = prescriptionRes.data;
        sendResponse(res, httpStatus.OK, { data: prescriptions, msg: "Prescriptions fetched successfully" }, null);
    } catch (error) {
        console.error("Error in getting prescriptions by user ID", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});





module.exports = {
    addPrescriptionImage,
    updateprescriptionImageById,
    deleteprescriptionImageById,
    getAllprescriptionImage,
    getPrescriptionByUserId

};
