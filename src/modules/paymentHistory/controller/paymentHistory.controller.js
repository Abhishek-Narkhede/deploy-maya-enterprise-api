const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const paymentHistoryService = require('../service/paymentHistory.service')


const addPaymentHistory = catchAsync(async (req, res) => {
    console.log("Adding payment history");
    try {
        const {  userId, amount, status,currency,paymentId,session_id,receipt_email, payment_method_types } = req.body;
        const paymentHistoryBody = {  userId, amount, status,currency,paymentId,session_id,receipt_email, payment_method_types };

        const paymentHistoryRes = await paymentHistoryService.addPaymentHistory(paymentHistoryBody);

        if (paymentHistoryRes.status) {
            sendResponse(res, httpStatus.CREATED, { paymentHistory: paymentHistoryRes.paymentHistory, msg: paymentHistoryRes.message }, null);
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, paymentHistoryRes.message);
        }
    } catch (error) {
        console.error("Error in adding payment history", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, `Error adding payment history: ${error.message}`);
    }
});

const getAllPaymentHistory = catchAsync(async (req, res) => {
    try {
        console.log("Get Subscription All");
        const { page = 1, limit = 10, searchQuery } = req.body;

        const emailSubscriptionRes = await paymentHistoryService.getAllPaymentHistory(page, limit, searchQuery);
        if (!emailSubscriptionRes.status) {
            return sendResponse(res, emailSubscriptionRes.code, null, "Subscription not found");
        }
        const subscription = emailSubscriptionRes.data;
        sendResponse(res, httpStatus.OK, { data: subscription, msg: "Subscription retrieved successfully" }, null);
    } catch (error) {
        console.error("Error in getting subscription information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


// const getSubscriptionByUserId = catchAsync(async (req, res) => {
//     try {
//         console.log("Get Subscription By User Id");
//         const { id } = req.params;

//         const emailSubscriptionRes = await paymentHistoryService.getSubscriptionByUserId(id);
//         if (!emailSubscriptionRes.status) {
//             return sendResponse(res, emailSubscriptionRes.code, null, "Subscription not found");
//         }
//         const subscription = emailSubscriptionRes.data;
//         sendResponse(res, httpStatus.OK, {data:subscription, msg: "Subscription get successfully" }, null);
//     } catch (error) {
//         console.error("Error in getting subscription information", error);
//         sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
//     }
// });

// const updateSubscriptionByUserId = catchAsync(async (req, res) => {
//     console.log("Update Subscription by user ID ");
//     try {
//         const { id } = req.params;
//         const updateFields = req.body;

//         const subscriptionRes = await paymentHistoryService.updateSubscriptionByUserId(id, updateFields);
//         if (!subscriptionRes.status) {
//             return sendResponse(res, httpStatus.NOT_FOUND, null, {msg: subscriptionRes. message});
//         }
        
//         const subscription = subscriptionRes;
//         sendResponse(res, httpStatus.OK, { data:subscription,msg: "Subscription updated successfully" }, null);
//     } catch (error) {
//         console.error("Error in updating subscription", error);
//         sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
//     }
// });











module.exports = {
    addPaymentHistory,
    getAllPaymentHistory,
    // getSubscriptionByUserId,
    // updateSubscriptionByUserId
};
