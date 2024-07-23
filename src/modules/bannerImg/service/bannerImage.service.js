const BannerImgModel = require('../model');


const addBannerImage = async (bannerImgBody) => {
    try {
        const bannerImg = await BannerImgModel.create(bannerImgBody);
        return { code: 201, status: true, bannerImg };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const updateBannerImageById = async (bannerImgId, updateFields) => {
    try {
        const bannerImg = await BannerImgModel.findByIdAndUpdate(bannerImgId, updateFields, { new: true });
        if (!bannerImg) {
            return { status: false, code: 404, bannerImg: null };
        }
        return { status: true, code: 200, bannerImg };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const deleteBannerImageById = async (bannerImgId) => {
    try {
        const bannerImg = await BannerImgModel.findByIdAndUpdate(bannerImgId, { isActive: false }, { new: true });
        if (!bannerImg) {
            return { status: false, code: 404, bannerImg: null };
        }
        return { status: true, code: 200, bannerImg };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};


const getAllBannerImage = async () => {
    try {
        const bannerImg = await BannerImgModel.find({isActive: true });
        if (!bannerImg) {
            return { status: false, code: 404, bannerImg: null };
        }
        return { status: true, code: 200, data:bannerImg };
    } catch (error) {
        return { status: false, code: 500, bannerImg: null, error: error.message };
    }
};



module.exports = {
    addBannerImage,
    updateBannerImageById,
    deleteBannerImageById,
    getAllBannerImage,
};