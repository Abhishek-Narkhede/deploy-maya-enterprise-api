const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');


const addEmailSubscription = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            "string.empty": `Email must contain value`,
            "any.required": `Email is a required field`,
            "string.email": `Email must be a valid email`
        }),
        userId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Banner Id must be a valid object ID`,
            "any.required": `Banner Id is a required field`
        }),
        isEmailSubscribed:Joi.boolean().optional()

    })
};

// const updateBannerImg = {
//     params: Joi.object().keys({
//         id: Joi.string().custom(objectId).required().messages({
//             "any.invalid": `Banner Id must be a valid object ID`,
//             "any.required": `Banner Id is a required field`
//         })
//     }),
//     body: Joi.object().keys({
//         bannerImgUrl: Joi.string().required().messages({
//             "string.empty": `Banner Image url must contain value`,
//             "any.required": `Banner Image url is a required field`
//         })
//     })
// };

// const deleteBannerImg = {
//     params: Joi.object().keys({
//         id: Joi.string().custom(objectId).required().messages({
//             "any.invalid": `Banner Id must be a valid object ID`,
//             "any.required": `Banner Id is a required field`
//         })
//     })
// };



module.exports = {
    addEmailSubscription,
    // updateBannerImg,
    // deleteBannerImg,
};
