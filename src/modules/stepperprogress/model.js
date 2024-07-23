const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../models/plugins");

const stepperprogressSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        cartData: {
            type: Array,
            default: []
        },
        selectedAddress: {
            type: Object,
            default: null,
        },
        selectedPrescription: {
            type: Object,
            default: null,
        },
        currentStep: {
            type: Number,
            default: 0
        },
        currentStepForUploadPres: {
            type: Number,
            default: 0
        },
        totalCartAmount: {
            type: Number,
            default: 0
        },
        cartAmount: {
            type: Number,
            default: 0
        },
        prescriptionDuration: {
            type: Number,
            default: null
        },
        prescriptionType: {
            type: String,
            default: null
        },
        prescriptionDuration: {
            type: String,
            default: null
        },
        prescriptionDurationUnit: {
            type: String,
            default: null
        },
        orderMode: {
            type: String,
            default: null
        },
        enquiryId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        isOrderEnquired: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
stepperprogressSchema.plugin(toJSON);
stepperprogressSchema.plugin(paginate);

/**
 * @typedef Order
 */
const StepperProgress = mongoose.model("StepperProgress", stepperprogressSchema);

module.exports = StepperProgress;
