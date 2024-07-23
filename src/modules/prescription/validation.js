const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');


const addPresecriptionImg = {
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `userId must be a valid object ID`,
            "any.required": `userId is a required field`
        }),
        prescriptionImgUrl: Joi.string().required().messages({
            "string.empty": `Prescription Image url must contain value`,
            "any.required": `Prescription Image url is a required field`
        }),
        title: Joi.string().allow('').optional(),
    })
};

const updatePrescriptionImg = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Prescription Id must be a valid object ID`,
            "any.required": `Prescription Id is a required field`
        })
    }),
    body: Joi.object().keys({
        prescriptionImgUrl: Joi.string().optional().messages({
            "string.empty": `Prescription Image url must contain value`,
            "any.required": `Prescription Image url is a required field`
        }),
        title: Joi.string().allow('').optional(),
        addressId: Joi.string().custom(objectId).optional().messages({
            "any.invalid": `AddressId Id must be a valid object ID`,
            "any.required": `AddressId Id is a required field`
        }),
        type: Joi.string().allow('').optional(),
        durationUnit: Joi.string().allow('').optional(),
        durationOfDosage: Joi.number().optional()
    })
};

const deletePrescriptionImg = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Prescription Id must be a valid object ID`,
            "any.required": `Prescription Id is a required field`
        })
    })
};



module.exports = {
    addPresecriptionImg,
    updatePrescriptionImg,
    deletePrescriptionImg,
};
