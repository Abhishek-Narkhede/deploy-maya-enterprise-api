const mongoose = require('mongoose');

const currencySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        symbol: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Currency = mongoose.model('currency', currencySchema);

module.exports = Currency;
