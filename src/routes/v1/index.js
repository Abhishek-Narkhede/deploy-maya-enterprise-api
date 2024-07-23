const express = require('express');
// const config = require('../../config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route')
const productRoute = require('./product.route')
const ratingsRoute = require('./rating.route')
const categoryRoute = require('./category.route')
const brandRoute = require('./brand.route')
const bannerImgRoute = require('./bannerImg.route')
const sliderImgRoute = require('./sliderImg.route')
const prescriptionImgRoute = require('./prescriptionImg.route')
const cartRoute = require('./cart.route')
const globalConfigRoute = require('./globalConfig.route')
const currencyRoute = require('./currency.route')
const orderRoute = require('./order.route')
const dashboardRoute = require('./dashboard.route')
const orderItemRoute = require('./orderItem.route')
const addressRoute = require('./address.route')
const checkoutRoute = require('./checkout.route')
const stepperProgressRoute = require('./stepperprogress.route')
const emailSubscriptionRoute = require('./emailSubscription.route')
const paymentHistoryRoute = require('./paymentHistory.route')

const { uploadFile, uploadThumbnail } = require('../../utils/fileUpload');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/rating',
    route: ratingsRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/brand',
    route: brandRoute,
  },
  {
    path: '/bannerImg',
    route: bannerImgRoute,
  },
  {
    path: '/sliderImg',
    route: sliderImgRoute,
  },
  {
    path: '/prescription',
    route: prescriptionImgRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/global-config',
    route: globalConfigRoute,
  },
  {
    path: '/currency',
    route: currencyRoute,
  },
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/order-item',
    route: orderItemRoute,
  },
  {
    path: '/payment',
    route: checkoutRoute,
  },
  {
    path: '/stepper-progress',
    route: stepperProgressRoute,
  },
  {
    path: '/email-subscribe',
    route: emailSubscriptionRoute,
  },
  {
    path: '/payment-history',
    route: paymentHistoryRoute,
  },

];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route('/upload-file').post(uploadFile);
router.route('/upload-thumbnail').post(uploadThumbnail);




/* istanbul ignore next */


module.exports = router;
