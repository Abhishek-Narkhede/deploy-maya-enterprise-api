const mongoose = require('mongoose');

const sliderImgSchema = new mongoose.Schema(
    {
        sliderImgUrl: {
            type: String,
            trim: true,
            default: '',
        },
        position: {
            type: Number,
            default: 0
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

const SliderImage = mongoose.model('sliderimage', sliderImgSchema);

module.exports = SliderImage;
