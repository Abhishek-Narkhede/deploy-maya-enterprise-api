const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const emailSubscriptionService = require('../service/emailSubscription.service')


const addEmailSubscription = catchAsync(async (req, res) => {
    console.log("Adding emailSubscribe");
    try {
        const { email, userId, isEmailSubscribed } = req.body;
        let emailSubscriptionBody = { email, userId, isEmailSubscribed };
        const emailSubscriptionRes = await emailSubscriptionService.addEmailSubscription(req, emailSubscriptionBody);
        const emailSubscribe = emailSubscriptionRes;
        sendResponse(res, httpStatus.CREATED, { emailSubscribe }, null);
    } catch (error) {
        console.error("Error in emailSubscribe", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, `Error subscribing: ${error.message}`);
    }
});

const getAllSubscriptions = catchAsync(async (req, res) => {
    try {
        console.log("Get Subscribe All");

        // Get body parameters for pagination and search
        const { page = 1, limit = 10, searchQuery } = req.body;

        const emailSubscriptionRes = await emailSubscriptionService.getAllSubscriptions(page, limit, searchQuery);
        if (!emailSubscriptionRes.status) {
            return sendResponse(res, emailSubscriptionRes.code, null, "Subscribe not found");
        }
        const emailSubscribe = emailSubscriptionRes.data;
        sendResponse(res, httpStatus.OK, { data: emailSubscribe, msg: "Subscribe retrieved successfully" }, null);
    } catch (error) {
        console.error("Error in getting emailSubscribe information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getAllUnSubscriber = catchAsync(async (req, res) => {
    try {
        console.log("Get Un-Subscribe All");

        // Get body parameters for pagination and search
        const { page = 1, limit = 10, name, email } = req.body;

        const emailSubscriptionRes = await emailSubscriptionService.getAllUnSubscriber(page, limit, name, email);
        if (!emailSubscriptionRes.status) {
            return sendResponse(res, emailSubscriptionRes.code, null, "Subscribe not found");
        }
        const emailSubscribe = emailSubscriptionRes.data;
        sendResponse(res, httpStatus.OK, { data: emailSubscribe, msg: "Subscribe retrieved successfully" }, null);
    } catch (error) {
        console.error("Error in getting emailSubscribe information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getSubscriptionByUserId = catchAsync(async (req, res) => {
    try {
        console.log("Get Subscribe By User Id");
        const { id } = req.params;

        const emailSubscriptionRes = await emailSubscriptionService.getSubscriptionByUserId(id);
        if (!emailSubscriptionRes.status) {
            return sendResponse(res, emailSubscriptionRes.code, null, "Subscribe not found");
        }
        const emailSubscribe = emailSubscriptionRes.data;
        sendResponse(res, httpStatus.OK, { data: emailSubscribe, msg: "Subscribe get successfully" }, null);
    } catch (error) {
        console.error("Error in getting emailSubscribe information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateSubscriptionByUserId = catchAsync(async (req, res) => {
    console.log("Update Subscribe by user ID ");
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const subscriptionRes = await emailSubscriptionService.updateSubscriptionByUserId(id, updateFields);
        if (!subscriptionRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, { msg: subscriptionRes.message });
        }

        const emailSubscribe = subscriptionRes;
        sendResponse(res, httpStatus.OK, { data: emailSubscribe, msg: "Subscribe updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating emailSubscribe", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const deleteSubscriptionByUserId = catchAsync(async (req, res) => {
    console.log("Update Subscribe by user ID ");
    try {
        const { id } = req.params;

        const subscriptionRes = await emailSubscriptionService.deleteSubscriptionByUserId(id);
        if (!subscriptionRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, { msg: subscriptionRes.message });
        }
        const emailSubscribe = subscriptionRes;
        sendResponse(res, httpStatus.OK, { data: emailSubscribe, msg: "Subscribed user deleted successfully" }, null);
    } catch (error) {
        console.error("Error in updating emailSubscribe", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


module.exports = {
    addEmailSubscription,
    getAllSubscriptions,
    getAllUnSubscriber,
    getSubscriptionByUserId,
    updateSubscriptionByUserId,
    deleteSubscriptionByUserId
};
