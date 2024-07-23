const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const  brandService  = require("../service/brandService");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const addBrand = catchAsync(async (req, res) => {
  const body = req.body;
  const brand = await brandService.addBrand(body);
  if (brand.status) {
    sendResponse(res, httpStatus.CREATED, brand.data, null);
  } else {
    if (brand.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    } else if (brand.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, brand.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    }
  }
});

const getBrand = catchAsync(async (req, res) => {
  const { page, limit, searchQuery } = req.body;
  const brand = await brandService.getBrand(page, limit, searchQuery);
  if (brand.status) {
    sendResponse(res, httpStatus.OK, brand.data, null);
  } else {
    const statusCode = brand.code === 400 ? httpStatus.BAD_REQUEST :
                       brand.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR :
                       httpStatus.BAD_REQUEST;
    sendResponse(res, statusCode, null, brand.data);
  }
});

const getBrandById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const brand = await brandService.getBrandById(id);
  if (brand.status) {
    sendResponse(res, httpStatus.OK, brand.data, null);
  } else {
    if (brand.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    } else if (brand.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, brand.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    }
  }
});
const getBrandsByCategoryId = catchAsync(async (req, res) => {
  const { categoryId } = await pick(req.params, ['categoryId'])
  const brand = await brandService.getBrandsByCategoryId(categoryId);
  if (brand.status) {
    sendResponse(res, httpStatus.OK, brand.data, null);
  } else {
    if (brand.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    } else if (brand.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, brand.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    }
  }
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await brandService.updateBrand(req,res);
  if (brand.status) {
    sendResponse(res, httpStatus.OK, brand.data, null);
  } else {
    if (brand.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    } else if (brand.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, brand.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    }
  }
});

const deleteBrand = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const brand = await brandService.deleteBrand(id);
  if (brand.status) {
    sendResponse(res, httpStatus.OK, brand.data, null);
  } else {
    if (brand.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    } else if (brand.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, brand.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, brand.data);
    }
  }
});

module.exports = {
  getBrand,
  updateBrand,
  deleteBrand,
  addBrand,
  getBrandById,
  getBrandsByCategoryId
};
