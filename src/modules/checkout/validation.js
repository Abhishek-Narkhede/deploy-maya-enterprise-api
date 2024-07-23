const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const createCheckout = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required().messages({
      "any.required": `orderId is required field`,
    }),
  }),
};
const getSessionInfo = {
  params: Joi.object().keys({
    session_id: Joi.string().required().messages({
      "any.required": `sessionId is required field`,
    }),
  }),
};

module.exports = {
  createCheckout,
  getSessionInfo
};
