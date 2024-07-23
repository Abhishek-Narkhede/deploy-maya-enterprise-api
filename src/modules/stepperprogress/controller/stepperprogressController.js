const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const stepperprogressService = require("../service/stepperprogressService");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const addStepperProgress = catchAsync(async (req, res) => {
    const body = req.body;
    const { userId } = await pick(req.params, ['userId'])
    const stepperprogress = await stepperprogressService.addStepperProgress(userId, body);
    if (stepperprogress.status) {
        sendResponse(res, httpStatus.CREATED, stepperprogress.data, null);
    } else {
        if (stepperprogress.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        } else if (stepperprogress.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, stepperprogress.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        }
    }
});

const updateStepperProgress = catchAsync(async (req, res) => {
    const body = req.body;
    const { userId } = await pick(req.params, ['userId'])
    const stepperprogress = await stepperprogressService.updateStepperProgress(userId, body);
    if (stepperprogress.status) {
        sendResponse(res, httpStatus.CREATED, stepperprogress.data, null);
    } else {
        if (stepperprogress.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        } else if (stepperprogress.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, stepperprogress.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        }
    }
});
const userSteppeprProgress = catchAsync(async (req, res) => {
    const { userId } = await pick(req.params, ['userId'])
    const stepperprogress = await stepperprogressService.userSteppeprProgress(userId);
    if (stepperprogress.status) {
        sendResponse(res, httpStatus.OK, stepperprogress.data, null);
    } else {
        if (stepperprogress.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        } else if (stepperprogress.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, stepperprogress.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        }
    }
});

const deleteSteppeprProgressByUserId = catchAsync(async (req, res) => {
    const { userId } = await pick(req.params, ['userId'])
    const stepperprogress = await stepperprogressService.deleteSteppeprProgressByUserId(userId);
    if (stepperprogress.status) {
        sendResponse(res, httpStatus.OK, stepperprogress.data, null);
    } else {
        if (stepperprogress.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        } else if (stepperprogress.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, stepperprogress.data);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, stepperprogress.data);
        }
    }
});

module.exports = {
    addStepperProgress, updateStepperProgress, userSteppeprProgress, deleteSteppeprProgressByUserId
}
