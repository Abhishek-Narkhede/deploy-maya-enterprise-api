const mongoose = require('mongoose');
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: '',
        },
        avgRating: { type: Number, min: 0, max: 5, default: 0 },
        isPrescription: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number,
            default: 0
        },
        images:{
            type: Array,
            default: []
        },
        stripCapsuleQty: {
            type: Number,
            default: 0
        },
        productQuantity: {
            type: Number,
            default: 0
        },
        discountedPrice: {
            type: Number,
            default: 0
        },
        bannerImg: {
            type: String,
            default: 'https://test-env-ci-platform.s3.eu-west-2.amazonaws.com/uploads/1683631172390Group-2829-%281%29.png'
        },
        marketer: {
            type: String,
            default: ''
        },
        saltComposition: {
            type: String,
            default: ''
        },
        origin: {
            type: String,
            default: ''
        },
        brandId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        categoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('products', productSchema);

module.exports = Product;
