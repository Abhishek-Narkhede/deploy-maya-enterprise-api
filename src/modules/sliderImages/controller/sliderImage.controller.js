const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const sliderImgService = require('../service/sliderImage.service')


const addSliderImage = catchAsync(async (req, res) => {
    console.log("Add Slider Image");
    try {
        const { sliderImgUrl, position } = req.body;

        let sliderImgObj = { sliderImgUrl, position };

        const sliderImgRes = await sliderImgService.addSliderImage(sliderImgObj);
        
        if (!sliderImgRes.status) {
            sendResponse(res, sliderImgRes.code, null, sliderImgRes.data);
            return;
        }

        const sliderImg = sliderImgRes.sliderImg;
        console.log("Created Slider Image:", sliderImg);
        sendResponse(res, httpStatus.CREATED, { data: sliderImg, msg: "Slider image created successfully" }, null);
    } catch (error) {
        console.error("Error in adding slider image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


const updateSliderImageById = catchAsync(async (req, res) => {
    console.log("Update Slider Image: ");
    try {
        const { id } = req.params;
        const updateFields = req.body;
        const sliderImgRes = await sliderImgService.updateSliderImageById(id, updateFields);
        if (!sliderImgRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Slider image not found");
        }
        
        const sliderImg = sliderImgRes;
        sendResponse(res, httpStatus.OK, { msg: "Slider image updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating banner image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


const deleteSliderImageById = catchAsync(async (req, res) => {
    console.log("Soft Delete Slider image");
    try {
        const { id } = req.params;
        const sliderImgId = id

        const sliderImgRes = await sliderImgService.deleteSliderImageById(sliderImgId);
        if (!sliderImgRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Slider image not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "Slider image deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting banner image", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getAllSliderImage = catchAsync(async (req, res) => {
    try {
        console.log("Get Slider Image All ");

        const sliderImgRes = await sliderImgService.getAllSliderImage();
        if (!sliderImgRes.status) {
            return sendResponse(res, sliderImgRes.code, null, "Slider image not found");
        }
        const sliderImg = sliderImgRes.data;
        sendResponse(res, httpStatus.OK, {data:sliderImg, msg: "Slider image get successfully" }, null);
    } catch (error) {
        console.error("Error in getting banner image information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});






module.exports = {
    addSliderImage,
    updateSliderImageById,
    deleteSliderImageById,
    getAllSliderImage,
    
};
