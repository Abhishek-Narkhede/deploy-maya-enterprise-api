const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const cartService = require("../service/cartService");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const addCartItem = catchAsync(async (req, res) => {
  const body = req.body;
  const cart = await cartService.addCartItem(body);
  if (cart.status) {
    sendResponse(res, httpStatus.CREATED, cart.data, null);
  } else {
    if (cart.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    } else if (cart.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, cart.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    }
  }
});

const getCartItemByUser = catchAsync(async (req, res) => {
  const { userId } = await pick(req.params, ['userId']);
  const cart = await cartService.getCartItemByUser(userId);
  if (cart.status) {
    sendResponse(res, httpStatus.OK, cart.data, null);
  } else {
    if (cart.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    } else if (cart.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, cart.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    }
  }
});

const updateCart = catchAsync(async (req, res) => {
  const cart = await cartService.updateCart(req, res);
  if (cart.status) {
    sendResponse(res, httpStatus.OK, cart.data, null);
  } else {
    if (cart.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    } else if (cart.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, cart.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    }
  }
});
const deleteCartItem = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const cart = await cartService.deleteCartItem(id);
  if (cart.status) {
    sendResponse(res, httpStatus.OK, cart.data, null);
  } else {
    if (cart.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    } else if (cart.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, cart.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    }
  }
});
const removeUserCart = catchAsync(async (req, res) => {
  let userId = req.user?._id;
  console.log(req.user);
  const cart = await cartService.removeUserCartData(userId);
  if (cart.status) {
    sendResponse(res, httpStatus.OK, cart.data, null);
  } else {
    if (cart.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    } else if (cart.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, cart.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, cart.data);
    }
  }
});

module.exports = {
  addCartItem,
  getCartItemByUser,
  deleteCartItem,
  updateCart,
  removeUserCart
};
