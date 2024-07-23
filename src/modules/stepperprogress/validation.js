const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const add = {
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `userId must be a valid object ID`,
            "any.required": `userId is a required field`,
        }),
        addressId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `addressId must be a valid object ID`,
            "any.required": `addressId is a required field`,
        }),
        prescriptionId: Joi.string().custom(objectId).optional(),
        mode: Joi.string()
            .valid('order', 'enquiry')
            .optional(),
        orderType: Joi.string()
            .valid('cod', 'online')
            .optional(),
        enquiryType: Joi.string()
            .valid('asPerPrescription', 'call')
            .optional(),
        durationUnit: Joi.string().allow('').optional(),
        durationOfDosage: Joi.number().optional(),
        stripeSessionId: Joi.string().optional(),
        totalPayment: Joi.string().optional(),
    }),
};

const deleteOrder = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.required": `id is required field`,
        }),
    }),
};
const getOrderByUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            "any.required": `userId is required field`,
        }),
    }),
};

const getOrderById = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.required": `id is required field`,
        }),
    }),
};

const update = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            addressId: Joi.string().custom(objectId).optional(),
            stripeSessionId: Joi.string().optional(),
            status: Joi.string()
                .valid("pending", "shipped", "delivered", "cancelled")
                .optional(), // Enum for status
            enquiryStatus: Joi.string()
                .valid("fulfilled", "awaiting_response", "in_progress")
                .optional(),
            userId: Joi.string().custom(objectId).optional(),
            totalPayment: Joi.number().optional(),
            mode: Joi.string()
                .valid('order', 'enquiry')
                .optional(),
            orderType: Joi.string()
                .valid('cod', 'online')
                .optional(),

        })
        .min(1), // Ensure at least one field is being updated
};
const allOrders = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.string().allow(""),
        sort: Joi.object(),
    }),
};

const allOrdersEnauiries = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.string().allow(""),
        sort: Joi.object(),
    }),
};

module.exports = {
    add,
    deleteOrder,
    getOrderByUser,
    update,
    getOrderById,
    allOrders,
    allOrdersEnauiries
};
