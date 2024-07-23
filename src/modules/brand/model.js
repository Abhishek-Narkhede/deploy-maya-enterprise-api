const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../models/plugins");

const brandSchema = mongoose.Schema(
  {
    brandImgUrl: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default:0
    },
    location: {
      type: String,
      trim: true,
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

/**
 * @typedef Brand
 */
const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
