const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');

const addProduct = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            "string.empty": `Name must contain value`,
            "any.required": `Name is a required field`
        }),
        marketer: Joi.string().required().messages({
            "string.empty": `Marketer must contain value`,
            "any.required": `Marketer is a required field`
        }),
        saltComposition: Joi.string().required().messages({
            "string.empty": `Salt Composition must contain value`,
            "any.required": `Salt Composition is a required field`
        }),
        origin: Joi.string().required().messages({
            "string.empty": `Origin must contain value`,
            "any.required": `Origin is a required field`
        }),
        categoryId: Joi.string().required().messages({
            "string.empty": `Category id must contain value`,
            "any.required": `Category id is a required field`
        }),
        // ratings: Joi.number().min(0).max(5).messages({
        //     "number.base": `Ratings must be a number`,
        //     "number.min": `Ratings must be at least 0`,
        //     "number.max": `Ratings must be at most 5`,
        //     "any.required": `Ratings is a required field`
        // }),
        avgRating: Joi.number().min(0).max(5).messages({
            "number.base": `Ratings must be a number`,
            "number.min": `Ratings must be at least 0`,
            "number.max": `Ratings must be at most 5`,
            "any.required": `Ratings is a required field`
        }),
        isPrescription: Joi.boolean().required().messages({
            "boolean.base": `isPrescription must be a boolean value`,
            "any.required": `isPrescription is a required field`
        }),
        price: Joi.number().positive().required().messages({
            "number.base": `Price must be a number`,
            "number.positive": `Price must be a positive value`,
            "any.required": `Price is a required field`
        }),
        stripCapsuleQty: Joi.number().positive().required().messages({
            "number.base": `stripCapsuleQty must be a number`,
            "number.positive": `stripCapsuleQty must be a positive value`,
            "any.required": `stripCapsuleQty is a required field`
        }),
        productQuantity: Joi.number().positive().required().messages({
            "number.base": `productQuantity must be a number`,
            "number.positive": `productQuantity  must be a positive value`,
            "any.required": `productQuantity  is a required field`
        }),
        bannerImg: Joi.string().uri().required().messages({
            "string.uri": `bannerImg must be a valid URI`,
            "any.required": `bannerImg is a required field`
        }),
        images: Joi.array().items(Joi.string().uri()).messages({
            "array.base": `Images must be an array`,
            "array.includes": `Images must contain valid URIs`,
            "any.required": `Images is a required field`
        }),
        discountedPrice: Joi.number().positive().optional().messages({
            "number.base": `Discounted Price must be a number`,
            "number.positive": `Discounted Price must be a positive value`
        }),
        brandId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `brandId must be a valid object ID`,
            "any.required": `brandId is a required field`
        })
    }),
};

const addProductInformation = {
    body: Joi.object().keys({
        brandId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `brandId must be a valid object ID`,
            "any.required": `brandId is a required field`
        }),
        categoryId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `categoryId must be a valid object ID`,
            "any.required": `categoryId is a required field`
        }),
        productId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `productId must be a valid object ID`,
            "any.required": `productId is a required field`
        }),
        introduction: Joi.string().required().messages({
            "string.empty": `Introduction to Ace must contain value`,
            "any.required": `Introduction to Ace is a required field`
        }),
        uses: Joi.string().required().messages({
            "string.empty": `Uses of Ace must contain value`,
            "any.required": `Uses of Ace is a required field`
        }),
        therapeuticEffects: Joi.string().allow('').optional(),
        interaction: Joi.string().allow('').optional(),
        moreInformationabout: Joi.string().allow('').optional(),
        howtoconsume: Joi.string().allow('').optional(),
        safetyAdvices: Joi.object().keys({
            pregnancy: Joi.string().allow('').optional(),
            breastFeeding: Joi.string().allow('').optional(),
            lungs: Joi.string().allow('').optional(),
            liver: Joi.string().allow('').optional(),
            alcohol: Joi.string().allow('').optional(),
            driving: Joi.string().allow('').optional()
        }).optional(),
        sideEffects: Joi.string().allow('').optional(),
        wordofAdvice: Joi.string().allow('').optional(),
        isActive: Joi.boolean().optional().messages({
            "boolean.base": `isActive must be a boolean value`
        })
    })
};

const updateProductInformation = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Product Info Id must be a valid object ID`,
            "any.required": `Produc tInfo Id is a required field`
        })
    }),
    body: Joi.object().keys({
        brandId: Joi.string().custom(objectId).optional().messages({
            "any.invalid": `brandId must be a valid object ID`
        }),
        categoryId: Joi.string().custom(objectId).optional().messages({
            "any.invalid": `categoryId must be a valid object ID`
        }),
        productId: Joi.string().custom(objectId).optional().messages({
            "any.invalid": `productId must be a valid object ID`
        }),
        introduction: Joi.string().required().messages({
            "string.empty": `Introduction to Ace must contain value`,
            "any.required": `Introduction to Ace is a required field`
        }),
        uses: Joi.string().allow('').optional(),
        therapeuticEffects: Joi.string().allow('').optional(),
        interaction: Joi.string().allow('').optional(),
        moreInformationabout: Joi.string().allow('').optional(),
        howtoconsume: Joi.string().allow('').optional(),
        safetyAdvices: Joi.object().keys({
            pregnancy: Joi.string().allow('').optional(),
            breastFeeding: Joi.string().allow('').optional(),
            lungs: Joi.string().allow('').optional(),
            liver: Joi.string().allow('').optional(),
            alcohol: Joi.string().allow('').optional(),
            driving: Joi.string().allow('').optional()
        }).optional(),
        sideEffects: Joi.string().allow('').optional(),
        wordofAdvice: Joi.string().allow('').optional(),
        isActive: Joi.boolean().optional().messages({
            "boolean.base": `isActive must be a boolean value`
        })
    })
};

const deleteProductInformation = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Product Info Id must be a valid object ID`,
            "any.required": `Produc tInfo Id is a required field`
        })
    })
};

const getProductInformationById = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Product Info Id must be a valid object ID`,
            "any.required": `Produc tInfo Id is a required field`
        })
    })
};

const getProductInformationByProductId = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Product Info Id must be a valid object ID`,
            "any.required": `Produc tInfo Id is a required field`
        })
    })
};


module.exports = {
    addProduct,
    addProductInformation,
    updateProductInformation,
    deleteProductInformation,
    getProductInformationById,
    getProductInformationByProductId
};
