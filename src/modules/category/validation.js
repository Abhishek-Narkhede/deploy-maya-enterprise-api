const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const add = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `Name must contain value`,
      "any.required": `Name is a required field`,
    }),
    description: Joi.string().required().messages({
      "string.empty": `description must contain value`,
      "any.required": `description is a required field`,
    }),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    description: Joi.string().allow(""),
  }).min(1), // Ensure at least one field is being updated
};
const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  add,
  update,
  deleteCategory,
};
