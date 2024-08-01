const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PublicUrl = "https://deploy-maya-enterprise-web-five.vercel.app";
const Order = require("../../order/model");
const OrderItem = require("../../orderItem/model");
const Product = require("../../products/model");
const { getConfigForCheckout } = require("../../globalconfig/service/globalconfig.service");

const createCheckout = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const customerEmail = req.user.email;
    const customerName = req.user.name;
    const orderType = req.body && req.body.orderType;
    const orderMode = req.body && req.body.mode;

    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return { code: 404, status: false, data: "Order not found" };
    }

    const orderItems = await OrderItem.find({ orderId: orderId })
    console.log('orderItems', orderItems);
    // Fetching product details concurrently
    const productPromises = orderItems.map(item =>
      Product.findById(item.productId).then(productDetails => ({
        ...item.toObject(),
        productDetails
      })).catch(error => {
        console.error(`Error fetching product details for item ${item._id}:`, error.message);
        return null;
      })
    );
    console.log("productPromises", productPromises);
    // Resolved all product promises and filter out null values
    const populatedOrderItems = (await Promise.all(productPromises)).filter(item => item !== null);
    console.log('populatedOrderItems', populatedOrderItems);

    const lineItems = populatedOrderItems?.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item?.productDetails?.name,
          },
          unit_amount: item?.productDetails?.discountedPrice * 100,
        },
        quantity: item?.quantity,
      };
    });

    console.log('lineItems', lineItems);

    const globalConfigData = await getConfigForCheckout();
    const deliveryCharges = globalConfigData?.config[0]?.deliveryCharges * 100 || 0
    const packagingCharges = globalConfigData?.config[0]?.packagingCharges * 100 || 0
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

    if (lineItems.length !== 0) {
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
      console.log(populatedOrderItems.length, lineItems.length);
      if (populatedOrderItems.length === lineItems.length - 2) {
        const session = await stripe.checkout.sessions.create(sessionParams);
        return { code: 201, status: true, data: { url: session.url } };
      } else {
        return { code: 400, status: false, data: 'Error while placing the order' };
      }
    }

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
