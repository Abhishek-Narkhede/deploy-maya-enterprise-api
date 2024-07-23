const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const add = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required().messages({
      "any.required": `orderId is required field`,
    }),
    productId: Joi.string().custom(objectId).required().messages({
      "any.invalid": `productId must be a valid object ID`,
      "any.required": `productId is a required field`,
    }),
    quantity: Joi.number().optional(),
  }),
};

const getOrderItem = {
  params: Joi.object().keys({
    orderId: Joi.custom(objectId).required(),
  }),

};


const update = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      quantity: Joi.number().optional().messages({
        "any.invalid": `quantity must be a valid number`,
        "any.required": `quantity is required field`,
      }),
      orderId: Joi.string().custom(objectId).optional().messages({
        "any.required": `orderId is required field`,
      }),
      productId: Joi.string().custom(objectId).optional().messages({
        "any.invalid": `productId must be a valid object ID`,
        "any.required": `productId is a required field`,
      }),
    })
    .min(1), // Ensure at least one field is being updated
};

const deleteOrderItem = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),

};

module.exports = {
  add,
  update,
  getOrderItem,
  deleteOrderItem
};
