const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../models/plugins");

const OrderItemSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productId :{
      type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
      type: Number,
      default:1
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
OrderItemSchema.plugin(toJSON);
OrderItemSchema.plugin(paginate);

/**
 * @typedef OrderItem
 */
const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
