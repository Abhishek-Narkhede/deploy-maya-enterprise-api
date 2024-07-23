const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const add = {
  body: Joi.object().keys({
    brandImgUrl: Joi.string().required().messages({
      "string.empty": `brandImgUrl must contain value`,
      "any.required": `brandImgUrl is a required field`,
    }),
    name: Joi.string().required().messages({
      "string.empty": `Name must contain value`,
      "any.required": `Name is a required field`,
    }),
    description: Joi.string().required().messages({
      "string.empty": `Description must contain value`,
      "any.required": `Description is a required field`,
    }),
    categoryId: Joi.array().items(objectId).required().messages({
      "any.required": `Categories are required`,
    }),
    rating: Joi.number().min(0).max(5).optional(),
    location: Joi.string().optional(),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    brandImgUrl: Joi.string().optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    categoryId: Joi.array().items(objectId).optional(),
    location: Joi.string().optional(),
    rating: Joi.number().min(0).max(5).optional(),
    active: Joi.boolean().optional()
  }).min(1), // Ensure at least one field is being updated
};

const deleteBrand = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};
const getBrandById = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};
const getBrandsByCategoryId = {
  params: Joi.object().keys({
    categoryId: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  add,
  update,
  getBrandById,
  deleteBrand,
  getBrandsByCategoryId
};
