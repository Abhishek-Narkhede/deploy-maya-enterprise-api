const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const bannerImgService = require('../service/bannerImage.service')


const addBannerImage = catchAsync(async (req, res) => {
    console.log("Add Banner Image");
    try {
        const { bannerImgUrl,title} = req.body;

        let bannerImgObj = {bannerImgUrl,title};

        const bannerImgRes = await bannerImgService.addBannerImage(bannerImgObj);
        const bannerImg = bannerImgRes;
        sendResponse(res, httpStatus.CREATED, { bannerImg, msg: "Banner image created successfully" }, null);
    } catch (error) {
        console.error("Error in registration", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateBannerImageById = catchAsync(async (req, res) => {
    console.log("Update Banner Image ");
    try {
        const { id } = req.params;
        const bannerImgId=id
        console.log("Banner Image ::",bannerImgId)
        const updateFields = req.body;

        const bannerImgRes = await bannerImgService.updateBannerImageById(bannerImgId, updateFields);
        if (!bannerImgRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Banner image not found");
        }
        
        const bannerImg = bannerImgRes;
        sendResponse(res, httpStatus.OK, { msg: "Banner image updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating banner image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


const deleteBannerImageById = catchAsync(async (req, res) => {
    console.log("Soft Delete Banner image");
    try {
        const { id } = req.params;
        const bannerImgId = id

        const bannerImgRes = await bannerImgService.deleteBannerImageById(bannerImgId);
        if (!bannerImgRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Banner image not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "Banner image deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting banner image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getAllBannerImage = catchAsync(async (req, res) => {
    try {
        console.log("Get Banner Image All ");

        const bannerImgRes = await bannerImgService.getAllBannerImage();
        if (!bannerImgRes.status) {
            return sendResponse(res, bannerImgRes.code, null, "Banner image not found");
        }
        const bannerImg = bannerImgRes.data;
        sendResponse(res, httpStatus.OK, {data:bannerImg, msg: "Banner image get successfully" }, null);
    } catch (error) {
        console.error("Error in getting banner image information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});






module.exports = {
    addBannerImage,
    updateBannerImageById,
    deleteBannerImageById,
    getAllBannerImage,
    
};
