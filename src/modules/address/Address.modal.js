const mongoose = require("mongoose");
const counterIncrementor = require("../../utils/counterIncrementer");

const addressSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
		},
		Name: {
			type: String,
			trim: true,
			default: "",
			required: true,
		},
		
		country: {
			type: String,
			default: "",
			required: true,
		},
		addressLine1: {
			type: String,
			default: "",
			required: true,
		},
		addressLine2: {
			type: String,
			default: "",
		},
		city: {
			type: String,
			default: "",
			required: true,
		},
		state: {
			type: String,
			default: "",
			required: true,
		},
		zip: {
			type: String,
			required: true,
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json


addressSchema.pre("save", async function (next) {
	const address = this;

	address.seqId = await counterIncrementor("Address");
	next();
});

/**
 * @typedef Address
 */

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
