const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const add = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required().messages({
      "any.required": `productId is required field`,
    }),
    userId: Joi.string().custom(objectId).required().messages({
      "any.invalid": `userId must be a valid object ID`,
      "any.required": `userId is a required field`,
    }),
    quantity: Joi.number().optional(),
  }),
};

const deleteCartItem = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required().messages({
      "any.required": `productId is required field`,
    }),
  }),
};
const getCartItemByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required().messages({
      "any.required": `userId is required field`,
    }),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      quantity: Joi.number().required().messages({
        "any.invalid": `quantity must be a valid number`,
        "any.required": `quantity is required field`,
      }),
    })
    .min(1), // Ensure at least one field is being updated
};

module.exports = {
  add,
  deleteCartItem,
  getCartItemByUser,
  update,
};
