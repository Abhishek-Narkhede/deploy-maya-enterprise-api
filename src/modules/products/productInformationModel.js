const mongoose = require('mongoose');

const productInformationSchema = mongoose.Schema(
    {
        brandId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        categoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        introduction: {
            type: String,
            trim: true,
            default: '',
        },
        uses: {
            type: String,
            trim: true,
            default: '',
        },
        therapeuticEffects: {
            type: String,
            trim: true,
            default: '',
        },
        interaction: {
            type: String,
            trim: true,
            default: '',
        },
        moreInformationabout: {
            type: String,
            trim: true,
            default: '',
        },
        howtoconsume: {
            type: String,
            trim: true,
            default: '',
        },
        safetyAdvices: {
            pregnancy: {
                type: String,
                trim: true,
                default: '',
            },
            breastFeeding: {
                type: String,
                trim: true,
                default: '',
            },
            lungs: {
                type: String,
                trim: true,
                default: '',
            },
            liver: {
                type: String,
                trim: true,
                default: '',
            },
            alcohol: {
                type: String,
                trim: true,
                default: '',
            },
            driving: {
                type: String,
                trim: true,
                default: '',
            }
        },
        sideEffects: {
            type: String,
            trim: true,
            default: '',
        },
        wordofAdvice: {
            type: String,
            trim: true,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('ProductInformation', productInformationSchema);

module.exports = Product;
