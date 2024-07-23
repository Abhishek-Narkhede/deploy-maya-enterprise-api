const mongoose = require('mongoose');
const prescriptionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        title: {
            type: String,
            trim: true,
            default: '',
        },
        prescriptionImgUrl: {
            type: String,
            trim: true,
            default: '',
        },
        type: {
            type: String,
            enum: ["order", "call"],
            default: "order",
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        durationOfDosage: {
            type: Number
        },
        durationUnit: {
            type: String,
            enum: ['Days', 'Weeks', 'Months'],
            default: 'Days'
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
const PrescriptionImage = mongoose.model('prescription', prescriptionSchema);

module.exports = PrescriptionImage;
