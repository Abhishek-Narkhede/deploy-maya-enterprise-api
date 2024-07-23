const mongoose = require('mongoose');

const configSchema = mongoose.Schema(
    {
        deliveryCharges: {
            type: Number,
            required: true,
        },
        currencyId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        packagingCharges: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
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

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
