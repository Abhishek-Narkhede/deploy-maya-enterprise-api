const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../models/plugins");

const cartSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

/**
 * @typedef Cart
 */
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
