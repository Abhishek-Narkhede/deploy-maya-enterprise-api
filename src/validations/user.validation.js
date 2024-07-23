const Joi = require('joi');
const { password, emailCustom, objectId } = require('./custom.validation');

const listUsers = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    filter: Joi.string().allow(''),
    sort: Joi.object(),
  }),
};

const getUserById = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    profilePic: Joi.string().allow(""),
    phoneNo: Joi.string().allow(""),
    email: Joi.string().allow("")
  }),
};

const updateUserStatus = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  })
};

const updateProfile = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    profilePic: Joi.string().allow(""),
    nickname: Joi.string().allow(""),
    bio: Joi.string().allow(""),
    role: Joi.string().allow("")
  }),
};
const deleteProfile = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateProfile,
  deleteProfile
};