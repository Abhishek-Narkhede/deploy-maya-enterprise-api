const pick = require("../../../utils/pick");
const Cart = require("../model");
const mongoose = require("mongoose");


const addCartItem = async (body) => {
  const { userId, productId, quantity } = body;
  try {
    // Check if the cart item already exists
    const existingCartItem = await Cart.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      const updatedCartItem = await existingCartItem.save();
      return { data: updatedCartItem, status: true, code: 200 };
    } else {
      // Create a new cart item
      const newCartItem = await Cart.create(body);
      return { data: newCartItem, status: true, code: 201 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};




const getCartItemByUser = async (userId) => {
  try {
    let userObjectId = mongoose.Types.ObjectId(userId);

    const carts = await Cart.aggregate([
      { $match: { userId: userObjectId } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $addFields: {
          total_price: { $multiply: ['$productDetails.discountedPrice', '$quantity'] }
        }
      }
    ]);

    if (carts && carts.length > 0) {
      return { data: carts, status: true, code: 200 };
    } else {
      return { data: [], msg: "Carts not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};




const updateCart = async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  try {
    let filterQuery = {
      _id: mongoose.Types.ObjectId(id),
    };

    const updatedResult = await Cart.findOneAndUpdate(
      filterQuery,
      req.body,
      { new: true }
    );
    if (updatedResult) {
      return { data: updatedResult, status: true, code: 200 };
    } else {
      return { data: "Cart not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};




const deleteCartItem = async (id) => {
  try {
    const deleteResult = await Cart.findByIdAndDelete(id);

    if (deleteResult) {
      return { data: deleteResult, status: true, code: 200 };
    } else {
      return { data: "Cart not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

const removeUserCartData = async (id) => {
  try {
    const deleteResult = await Cart.deleteMany({ userId: id });

    if (deleteResult.deletedCount > 0) {
      return { data: deleteResult, status: true, code: 200 };
    } else {
      return { data: "Cart not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = {
  updateCart,
  addCartItem,
  getCartItemByUser,
  deleteCartItem,
  removeUserCartData
};
