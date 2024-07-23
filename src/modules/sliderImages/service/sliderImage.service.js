const SliderImgModel = require('../model');


const addSliderImage = async (sliderImgBody) => {
    try {
        console.log("Slider Image Body:", sliderImgBody);

        // Check if a slider image with the same position already exists
        const existingSliderImg = await SliderImgModel.findOne({ position: sliderImgBody.position });

        if (existingSliderImg) {
            return { code: 400, status: false, data: "Position already taken. Please choose a different position." };
        }

        const sliderImg = await SliderImgModel.create(sliderImgBody);
        return { code: 201, status: true, sliderImg };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};


const updateSliderImageById = async (id, updateFields) => {
    try {
        const sliderImg = await SliderImgModel.findByIdAndUpdate(id, updateFields, { new: true });
        if (!sliderImg) {
            return { status: false, code: 404, sliderImg: null };
        }
        return { status: true, code: 200, sliderImg };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const deleteSliderImageById = async (sliderImgId) => {
    try {
        const sliderImg = await SliderImgModel.findByIdAndUpdate(sliderImgId, { isActive: false }, { new: true });
        if (!sliderImg) {
            return { status: false, code: 404, sliderImg: null };
        }
        return { status: true, code: 200, sliderImg };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};


const getAllSliderImage = async () => {
    try {
        const sliderImg = await SliderImgModel.find({isActive: true });
        if (!sliderImg) {
            return { status: false, code: 404, sliderImg: null };
        }
        return { status: true, code: 200, data:sliderImg };
    } catch (error) {
        return { status: false, code: 500, sliderImg: null, error: error.message };
    }
};



module.exports = {
    addSliderImage,
    updateSliderImageById,
    deleteSliderImageById,
    getAllSliderImage,
};