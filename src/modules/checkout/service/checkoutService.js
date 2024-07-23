const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PublicUrl = "http://localhost:3000";
const Order = require("../../order/model");
const OrderItem = require("../../orderItem/model");
const Product = require("../../products/model");
const { getConfigForCheckout } = require("../../globalConfig/service/globalconfig.service");

const createCheckout = async (req, res) => {
  try {
    // const { items } = req.body;
    const { orderId } = req.params;
    const userId = req.user._id;
    const customerEmail = req.user.email;
    const customerName = req.user.name;
    const orderType = req.body && req.body.orderType;
    const orderMode = req.body && req.body.mode;

    // Find the order by orderId and userId
    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return { code: 404, status: false, data: "Order not found" };
    }

    const orderItems = await OrderItem.find({ orderId: orderId })
    const populatedOrderItems = await Promise.all(orderItems.map(async (item) => {
      const productDetails = await Product.findById(item.productId);
      return {
        ...item.toObject(),
        productDetails
      };
    }));
    // return { code: 201, status: true, data: populatedOrderItems };
    const lineItems = populatedOrderItems.map((item) => {
      // Calculate the discounted price, ensuring it does not go below zero
      // const discountedPrice = Math.max(item.productDetails?.price - item.productDetails?.discountedPrice, 0);
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productDetails.name,
          },
          unit_amount: item.productDetails?.discountedPrice * 100,
        },
        quantity: item.quantity,
      };
    });

    const globalConfigData = await getConfigForCheckout();
    // return { code: 201, status: true, data: globalConfigData };
    const deliveryCharges = globalConfigData?.config[0]?.deliveryCharges * 100 || 0
    const packagingCharges = globalConfigData?.config[0]?.packagingCharges * 100 || 0
    // Add delivery charges as a line item without quantity
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges,
      },
      quantity: 1,
    });

    // Add packaging charges as a line item without quantity
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Packaging Charges",
        },
        unit_amount: packagingCharges,
      },
      quantity: 1,
    });

    const sessionParams = {
      line_items: lineItems,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        orderId: orderId,
      },
      mode: "payment",
      success_url: `${PublicUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PublicUrl}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    };
    if (orderMode) {
      sessionParams.metadata.orderMode = orderMode;
    }

    if (orderType) {
      sessionParams.metadata.orderType = orderType;
    }
    const session = await stripe.checkout.sessions.create(sessionParams);

    return { code: 201, status: true, data: { url: session.url } };
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    return { code: 500, status: false, data: error.message };
  }
};

const getSessionInfo = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.session_id
    );
    const orderId = session.metadata.orderId;
    const orderMode = session.metadata.orderMode;
    const orderType = session.metadata.orderType;

    const orderItems = await OrderItem.find({ orderId });

    for (const item of orderItems) {
      const productId = item.productId;
      const quantity = item.quantity;

      const product = await Product.findById(productId);
      if (!product) {
        return { code: 404, status: false, data: `Product with ID ${productId} not found` };
      }
      console.log("KKKKKK", product.productQuantity, quantity, item)
      const ORDER = await Order.findById({ _id: item.orderId });
      if (ORDER?.status !== "paid") {
        console.log("DONEtttww", ORDER)
        const newProductQuantity = Math.max(product.productQuantity - quantity, 0);
        await Product.findByIdAndUpdate(productId, { productQuantity: newProductQuantity });
      } else {
        console.log("Elseoooerre", ORDER)
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );

        const finalData = {
          paymentIntent,
          metadata: session.metadata
        }

        return { code: 201, status: true, data: finalData };
      }

    }

    await Order.updateOne(
      { _id: orderId },
      { $set: { stripeSessionId: session.id } }
    );

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    const finalData = {
      paymentIntent,
      metadata: session.metadata
    }

    return { code: 201, status: true, data: finalData };
  } catch (error) {
    console.error("Error getting session Info:", error);
    return { code: 500, status: false, data: error.message };
  }
};

module.exports = { createCheckout, getSessionInfo };
