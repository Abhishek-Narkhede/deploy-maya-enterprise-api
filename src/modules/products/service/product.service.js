const mongoose = require("mongoose");
const { uploadThumbnail } = require('../../../utils/fileUpload');
const { objectId } = require('../../../validations/custom.validation');
const Product = require('../model');
const ProductInformation = require('../productInformationModel');
const OrderItem = require("../../orderItem/model");


const addProduct = async (productBody) => {
    try {
        const { name, price, discountedPrice } = productBody;
        if (discountedPrice >= price) {
            return { code: 400, status: false, data: 'Discounted price should be less than the original price' };
        }
        console.log("rrr", productBody)
        const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingProduct) {
            return { code: 409, status: false, data: 'Product with this name already exists' };
        }

        const product = await Product.create(productBody);

        return { code: 201, status: true, product };
    } catch (error) {
        return { code: 500, status: false, data: error.message };
    }
}



const addProductInformation = async (productInfoBody) => {
    try {
        const product = await ProductInformation.create(productInfoBody);
        return { code: 201, status: true, product };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};
const fetchAllProducts = async (sortIndex = '', page = 1, limit = 10) => {
    try {
        let query = {
            isActive: true
        };

        if (sortIndex) {
            query.name = { $regex: sortIndex, $options: 'i' };  // Case-insensitive match
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await Product.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
        // Fetch the total number of documents that match the query
        const totalProducts = await Product.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            code: 201,
            status: true,
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};


const updateProductInformation = async (productInfoId, updateFields) => {
    try {
        const product = await ProductInformation.findByIdAndUpdate(productInfoId, updateFields, { new: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const softDeleteProductInformation = async (productInfoId) => {
    try {
        const product = await ProductInformation.findByIdAndUpdate(productInfoId, { isActive: false }, { new: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};


const getAllProductInformation = async () => {
    try {
        const product = await ProductInformation.find({ isActive: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, product: null, error: error.message };
    }
};

const getProductInformationById = async (id) => {
    try {
        const product = await ProductInformation.find({ _id: id, isActive: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, product: null, error: error.message };
    }
};

const getProductInformationByProductId = async (id) => {
    try {
        const product = await ProductInformation.find({ productId: id, isActive: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, product: null, error: error.message };
    }
};

const fetchProductsByBrandId = async (id, page = 1, limit = 10, sortIndex = '',) => {
    try {
        console.log("id", id);
        // const product = await Product.find({ brandId: objectId(id) });
        let query = {
            isActive: true,
            brandId: objectId(id)
        };

        if (sortIndex) {
            query.name = { $regex: sortIndex, $options: 'i' };  // Case-insensitive match
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;
        console.log(query);
        // Fetch products with pagination
        const products = await Product.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
        // Fetch the total number of documents that match the query
        const totalProducts = await Product.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / limit);
        console.log('products', products);
        return {
            code: 201,
            status: true,
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}
const fetchTopRatedProducts = async () => {
    try {
        const product = await Product.aggregate([
            { $sort: { avgRating: -1 } }
        ]);
        return { code: 201, status: true, product };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}
const fetchGlobalSearchProducts = async (keyword) => {
    try {
        const pipeline = [
            // Match stage to filter products by name
            { $match: { name: { $regex: keyword, $options: 'i' } } },
            // Sort stage to sort by avgRating
            { $sort: { avgRating: -1 } },
        ];
        const products = await Product.aggregate(pipeline);
        return { code: 201, status: true, products };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}
const updateProductDiscountedPrice = async (discountedPrice, id) => {
    console.log(id);
    try {
        let filterQuery = {
            _id: objectId(id),
            isActive: true,
        };
        console.log(discountedPrice, id);
        const updatedResult = await Product.findOneAndUpdate(
            filterQuery,
            { "discountedPrice": discountedPrice },
            { new: true }
        );
        if (updatedResult) {
            return { data: updatedResult, status: true, code: 200 };
        } else {
            return { data: [], msg: "Product not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}
const fetchProductsBasedOnCategories = async () => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: '$categoryInfo.name',
                    products: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    products: 1
                }
            }
        ]);
        console.log("products", products);


        return { code: 200, status: true, products };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const getProductDetailsAndInformationByProductId = async (id) => {
    try {
        console.log("in service", id);
        const productDetails = await ProductInformation.aggregate([
            {
                $match: { productId: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            }
        ]);

        if (!productDetails || productDetails.length === 0) {
            return { status: false, code: 404, product: null };
        }

        return { status: true, code: 200, product: productDetails[0] };
    } catch (error) {
        return { status: false, code: 500, product: null, error: error.message };
    }
};

// for admin
const softDeleteProductById = async (id) => {
    try {
        const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const getProductById = async (id) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            return { status: false, code: 404, product: null };
        }

        const productData = product.toObject();

        return { status: true, code: 200, product: productData };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};

const updateProductById = async (id, updateFields) => {
    try {
        console.log("rrr", updateFields)
        const objectId = mongoose.Types.ObjectId;
        const productId = objectId(id);
        const product = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
        if (!product) {
            return { status: false, code: 404, product: null };
        }
        return { status: true, code: 200, product };
    } catch (error) {
        return { status: false, code: 500, data: error.message };
    }
};



const fetchProductsOfNoOrderItems = async (id) => {
    try {
        const objectId = mongoose.Types.ObjectId;
        const orderIdToExclude = objectId(id);

        const products = await OrderItem.aggregate([
            {
                $match: {
                    orderId: { $ne: orderIdToExclude }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $match: {
                    'productDetails.productQuantity': { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: '$productId',
                    productDetails: { $first: '$productDetails' },
                    orderItemId: { $first: '$_id' },
                    orderId: { $first: '$orderId' },
                    quantity: { $first: '$quantity' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        _id: '$orderItemId',
                        orderId: '$orderId',
                        productId: '$_id',
                        quantity: '$quantity',
                        productDetails: '$productDetails'
                    }
                }
            }
        ]);

        return {
            code: 200,
            status: true,
            products,
        };
    } catch (error) {
        return {
            code: 500,
            status: false,
            data: error.message,
        };
    }
};


const addFieldToAllProducts = async () => {
    try {
        const updateResult = await Product.updateMany({}, { $set: { ["productQuantity"]: 20 } });
        if (updateResult) {
            return {
                status: true,
                code: 200,
                message: `Added  documents.`
            };
        } else {
            return {
                status: false,
                code: 400,
                message: `Something went wrong.`
            };
        }

    } catch (error) {
        return {
            status: false,
            code: 500,
            message: error.message
        };
    }
};




module.exports = {
    addProduct,
    fetchAllProducts,
    fetchProductsByBrandId,
    fetchTopRatedProducts,
    addProductInformation,
    updateProductInformation,
    softDeleteProductInformation,
    getProductInformationById,
    getProductInformationByProductId,
    getAllProductInformation,
    fetchProductsBasedOnCategories,
    fetchGlobalSearchProducts,
    updateProductDiscountedPrice,
    getProductDetailsAndInformationByProductId,
    softDeleteProductById,
    getProductById,
    updateProductById,
    fetchProductsOfNoOrderItems,
    addFieldToAllProducts
}
