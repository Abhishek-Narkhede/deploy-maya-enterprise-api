const mongoose = require('mongoose');
const bannerImgSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            default: '',
        },
        bannerImgUrl: {
            type: String,
            trim: true,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);
const BannerImage = mongoose.model('bannerimage', bannerImgSchema);

module.exports = BannerImage;
