const pick = require("../../../utils/pick");
const Product = require("../../products/model");
const OrderItem = require("../model");
const mongoose = require("mongoose");

const addOrderItem = async (body) => {
  try {

    const { orderId, productId, quantity } = body;

    const existingOrderItem = await OrderItem.findOne({ orderId, productId });
    if (existingOrderItem) {
      return { data: "Product already added to this order", status: false, code: 400 };
    }

    const product = await Product.findById({ _id: productId })
    console.log("eee", product)
    if (product?.productQuantity >= quantity) {
      const addResult = await OrderItem.create(body);
      if (addResult) {
        return { data: addResult, status: true, code: 201 };
      } else {
        return { data: "OrderItem not created", status: false, code: 400 };
      }
    } else {
      return { data: "Item quantity should be less than total product quantity", status: false, code: 400 };
    }

  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

const updateOrderItem = async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  try {
    let filterQuery = {
      _id: mongoose.Types.ObjectId(id),
    };

    const updatedResult = await OrderItem.findOneAndUpdate(
      filterQuery,
      req.body,
      { new: true }
    );
    if (updatedResult?.orderId) {
      const getUpdatedOrderItems = await getOrderItemByOrderId(updatedResult?.orderId)
      return { data: getUpdatedOrderItems?.data, status: true, code: 200 };
    } else {
      return { data: "OrderItem not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

const getOrderItemByOrderId = async (orderId) => {
  try {
    let orderIdObject = mongoose.Types.ObjectId(orderId);

    const orders = await OrderItem.aggregate([
      { $match: { orderId: orderIdObject } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          total_price: { $multiply: ['$productDetails.discountedPrice', '$quantity'] }
        }
      },

    ]);

    if (orders && orders.length > 0) {
      return { data: orders, status: true, code: 200 };
    } else {
      return { data: "Orders not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

const deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    let filterQuery = {
      _id: mongoose.Types.ObjectId(id),
    };

    const deletedResult = await OrderItem.findByIdAndDelete(filterQuery);
    if (deletedResult) {
      return res.status(200).json({ data: deletedResult, status: true, code: 200 });
    } else {
      return res.status(400).json({ data: "OrderItem not found", status: false, code: 400 });
    }
  } catch (error) {
    return res.status(500).json({ data: error.message, status: false, code: 500 });
  }
};


module.exports = {
  addOrderItem,
  updateOrderItem,
  getOrderItemByOrderId,
  deleteOrderItem
};
