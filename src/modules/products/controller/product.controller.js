const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const productService = require('../service/product.service');
const pick = require('../../../utils/pick');
const addProductController = catchAsync(async (req, res) => {
    console.log('asdfasdfsdfsdfsdfsdf', req?.body)
    try {
        const { name, price, bannerImg, images, brandId, isPrescription, avgRating, discountedPrice,
            marketer, saltComposition, origin, categoryId, stripCapsuleQty, productQuantity } = req?.body;


        let productObj = {
            name,
            isPrescription,
            avgRating, discountedPrice,
            marketer, saltComposition, origin,
            price,
            bannerImg,
            images,
            categoryId,
            brandId,
            stripCapsuleQty,
            productQuantity
        };

        const productRes = await productService.addProduct(productObj);
        const product = productRes.product;
        if (productRes?.data?.status) {
            sendResponse(res, httpStatus.CREATED, { product, msg: productRes?.data }, null)
        } else {
            sendResponse(res, productRes?.code, { product, msg: productRes?.data }, null)
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            code: httpStatus.INTERNAL_SERVER_ERROR,
            status: false,
            data: 'something went wrong',
        });
    }
});
const getAllProducts = catchAsync(async (req, res) => {
    try {
        const { sortIndex, page, limit } = req.body;
        const productRes = await productService.fetchAllProducts(sortIndex, page, limit);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Products not found");
        }
        const product = productRes.products;
        const pagination = productRes.pagination;
        sendResponse(res, httpStatus.CREATED, { product, pagination, msg: "All Products Fetched successfully" }, null)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            code: httpStatus.INTERNAL_SERVER_ERROR,
            status: false,
            data: 'something went wrong',
        });
    }
});


const getProductsByBrandId = catchAsync(async (req, res) => {
    try {
        const { id } = await pick(req.params, ['id'])
        const { page, limit, sortIndex } = req.body;
        const productRes = await productService.fetchProductsByBrandId(id, page, limit, sortIndex);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Products not found");
        }
        const product = productRes.products;
        const pagination = productRes.pagination;
        sendResponse(res, httpStatus.CREATED, { product, pagination, msg: "Products by Brand id Fetched successfully" }, null)
    } catch (error) {
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, { msg: error, code: httpStatus.INTERNAL_SERVER_ERROR, status: false }, null)
    }
});
// const getProductCategoriesById = catchAsync(async (req, res) => {
//     try {
//         const { id } = await pick(req.params, ['id'])
//         const productRes = await productService.fetchProductsByBrandId(id);
//         const product = productRes.product;
//         sendResponse(res, httpStatus.CREATED, { product, msg: "Products by Brand id Fetched successfully" }, null)
//     } catch (error) {
//         sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, { msg: error, code: httpStatus.INTERNAL_SERVER_ERROR, status: false }, null)
//     }
// });
const getTopRatedProducts = catchAsync(async (req, res) => {
    try {
        const productRes = await productService.fetchTopRatedProducts();
        const product = productRes.product;
        sendResponse(res, httpStatus.OK, { product, msg: "Top Rated Products Fetched successfully" }, null)
    } catch (error) {
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, { msg: error, code: httpStatus.INTERNAL_SERVER_ERROR, status: false }, null)
    }
});

const addProductInformationController = catchAsync(async (req, res) => {
    console.log("Add Product");
    try {
        const {
            brandId, categoryId, productId, introduction, uses,
            therapeuticEffects, interaction, moreInformationabout, howtoconsume,
            safetyAdvices, sideEffects, wordofAdvice, isActive
        } = req.body;

        let productInformationObj = {
            brandId,
            categoryId,
            productId,
            introduction,
            uses,
            therapeuticEffects,
            interaction,
            moreInformationabout,
            howtoconsume,
            safetyAdvices,
            sideEffects,
            wordofAdvice,
            isActive
        };

        const productRes = await productService.addProductInformation(productInformationObj);
        const product = productRes.product;
        sendResponse(res, httpStatus.CREATED, { product, msg: "Product Created successfully" }, null);
    } catch (error) {
        console.error("Error in registration", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateProductInformationController = catchAsync(async (req, res) => {
    console.log("Update Product");
    try {
        const { id } = req.params;
        const productInfoId = id
        console.log("Product Information::", productInfoId)
        const updateFields = req.body;

        const productRes = await productService.updateProductInformation(productInfoId, updateFields);
        if (!productRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Product not found");
        }

        const product = productRes.product;
        sendResponse(res, httpStatus.OK, { product, msg: "Product updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


const deleteProductInformationController = catchAsync(async (req, res) => {
    console.log("Soft Delete Product");
    try {
        const { id } = req.params;
        const productInfoId = id

        const productRes = await productService.softDeleteProductInformation(productInfoId);
        if (!productRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Product not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "Product deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getAllProductInformationController = catchAsync(async (req, res) => {
    try {
        console.log("Get Product All Information");

        const productRes = await productService.getAllProductInformation();
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Product not found");
        }

        sendResponse(res, productRes.code, productRes.product, null);
    } catch (error) {
        console.error("Error in getting product information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getProductInformationByIdController = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Get Product Information by ID", id);

        const productRes = await productService.getProductInformationById(id);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Product not found");
        }

        sendResponse(res, productRes.code, productRes.product, null);
    } catch (error) {
        console.error("Error in getting product information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getProductInformationByProductIdController = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Get Product Information by Product ID", id);

        const productRes = await productService.getProductInformationByProductId(id);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Product not found");
        }

        sendResponse(res, productRes.code, productRes.product, null);
    } catch (error) {
        console.error("Error in getting product information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});
const getProductsBasedOnCategories = catchAsync(async (req, res) => {
    try {
        const productRes = await productService.fetchProductsBasedOnCategories();
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Products not found");
        }

        sendResponse(res, productRes.code, productRes.products, null);
    } catch (error) {
        console.error("Error in getting product information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});
const globalSearchProducts = catchAsync(async (req, res) => {
    try {
        const { keyword } = req.body;
        const productRes = await productService.fetchGlobalSearchProducts(keyword);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Products not found");
        }

        sendResponse(res, productRes.code, productRes.products, null);
    } catch (error) {
        console.error("Error in getting products", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});
const updateDiscountedPrice = catchAsync(async (req, res) => {
    try {
        const { id } = await pick(req.params, ['id'])
        const { discountedPrice } = req.body
        if (!id) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, "Id Not Found");
        }
        const productRes = await productService.updateProductDiscountedPrice(discountedPrice, id);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Products not found");
        }

        sendResponse(res, httpStatus.OK, productRes.data, null);
    } catch (error) {
        console.error("Error in Updating product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getProductDetailsAndInformationByProductId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Get Product details and Information by Product ID", id);

        const productRes = await productService.getProductDetailsAndInformationByProductId(id);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Product not found");
        }

        sendResponse(res, productRes.code, productRes.product, null);
    } catch (error) {
        console.error("Error in getting product information", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

// For admin
const deleteProductById = catchAsync(async (req, res) => {
    console.log("Soft Delete Product");
    try {
        const { id } = req.params;

        const productRes = await productService.softDeleteProductById(id);
        if (!productRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Product not found");
        }

        sendResponse(res, httpStatus.OK, { msg: "Product deleted successfully" }, null);
    } catch (error) {
        console.error("Error in deleting product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const getProductById = catchAsync(async (req, res) => {
    console.log("Get Product by id");
    try {
        const { id } = req.params;

        const productRes = await productService.getProductById(id);
        if (!productRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Product not found");
        }

        sendResponse(res, httpStatus.OK, { data: productRes, msg: "Product Get successfully" }, null);
    } catch (error) {
        console.error("Error in get product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

const updateProductById = catchAsync(async (req, res) => {
    console.log("Update Product By Id");
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const productRes = await productService.updateProductById(id, updateFields);
        if (!productRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, "Product not found");
        }

        const product = productRes.product;
        sendResponse(res, httpStatus.OK, { product, msg: "Product updated successfully" }, null);
    } catch (error) {
        console.error("Error in updating product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});


const getProductsOfNoOredrItems = catchAsync(async (req, res) => {
    try {
        const { orderId } = req.body;
        const productRes = await productService.fetchProductsOfNoOrderItems(orderId);
        if (!productRes.status) {
            return sendResponse(res, productRes.code, null, "Products not found");
        }
        const product = productRes.products;
        const pagination = productRes.pagination;
        sendResponse(res, httpStatus.CREATED, { product, pagination, msg: "All Products Fetched successfully" }, null)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            code: httpStatus.INTERNAL_SERVER_ERROR,
            status: false,
            data: error,
        });
    }
});


const addFieldToAllProducts = catchAsync(async (req, res) => {
    console.log("Update Product feild");
    try {

        const productRes = await productService.addFieldToAllProducts();
        if (!productRes.status) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, productRes.message);
        }
        const product = productRes.product;
        sendResponse(res, httpStatus.OK, { product, msg: productRes.message }, null);
    } catch (error) {
        console.error("Error in updating product", error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, error.message);
    }
});

module.exports = {
    addProductController,
    addProductInformationController,
    updateProductInformationController,
    deleteProductInformationController,
    getAllProductInformationController,
    getProductInformationByIdController,
    getProductInformationByProductIdController,
    getAllProducts,
    getProductsByBrandId,
    getTopRatedProducts,
    getProductsBasedOnCategories,
    globalSearchProducts,
    updateDiscountedPrice,
    getProductDetailsAndInformationByProductId,
    deleteProductById,
    getProductById,
    updateProductById,
    getProductsOfNoOredrItems,
    addFieldToAllProducts
};
