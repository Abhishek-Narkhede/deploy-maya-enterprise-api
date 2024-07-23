const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../models/plugins");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled","paid"],
      default: "pending",
    },
    enquiryStatus: {
      type: String,
      enum: ["fulfilled", "awaiting_response", "in_progress"],
      required: false
    },
    stripeSessionId: {
      type: String,
    },
    totalPayment: {
      type: Number,
    },
    mode: {
      type: String,
      enum: ['order', 'enquiry'],
      required: false
    },
    orderType: {
      type: String,
      enum: ['cod', 'online'],
      required: false
    },
    enquiryType: {
      type: String,
      enum: ['asPerPrescription', 'call'],
      required: false
    },
    durationOfDosage: {
      type: Number
    },
    durationUnit: {
      type: String,
      enum: ['Days', 'Weeks', 'Months'],
      default: 'Days'
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
