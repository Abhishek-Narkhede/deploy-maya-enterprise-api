const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const mongoose = require('mongoose');
const moment = require('moment');
const ratingService  = require('../service/ratings.service');
const { sendResponse } = require('../../../utils/responseHandler');


const rateProductController = catchAsync(async (req, res) => {
    console.log("Add Product");
    try {
        const { userId, productId, rating } = req.body;
        let ratingObj = {
            userId, productId, rating
        };
        const ratingRes = await ratingService.rateProduct(ratingObj);
        const product = ratingRes.product;
        console.log("product", product, ratingRes);
        sendResponse(res, httpStatus.CREATED, { product, msg: "Rating Added successfully" }, null)
    } catch (error) {
        console.error("Error in registration", error);
    }
});

const getAllRating = catchAsync(async (req, res) => {
    try {
        console.log("Get All rating");
        const ratingRes = await ratingService.getAllRating();
        if (!ratingRes.status) {
            return sendResponse(res, ratingRes.code, null, "Rating not found");
        }

        sendResponse(res, ratingRes.code, ratingRes.rating, null);
    } catch (error) {
        console.error("Error in getting rating information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getRatingByUserId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Get rating by user id",id);

        const ratingRes = await ratingService.getRatingByUserId(id);
        if (!ratingRes.status) {
            return sendResponse(res, ratingRes.code, null, "Rating not found");
        }

        sendResponse(res, ratingRes.code, ratingRes.rating, null);
    } catch (error) {
        console.error("Error in getting rating information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateRatingByUserId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, rating } = req.body;
        let ratingObj = { productId, rating
        };
        console.log("Update rating by user id",id);

        const ratingRes = await ratingService.updateRatingByUserId(id,ratingObj);
        if (!ratingRes.status) {
            return sendResponse(res, ratingRes.code, null, "Rating not found");
        }
        sendResponse(res, ratingRes.code, {data:ratingRes.rating,message:"Update successfully"}, null);
    } catch (error) {
        console.error("Error in getting rating information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

module.exports = {
    rateProductController,
    getAllRating,
    getRatingByUserId,
    updateRatingByUserId
};
