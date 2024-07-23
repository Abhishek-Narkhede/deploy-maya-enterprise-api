const User = require("../../../models/user.model");
const Brand = require("../../brand/model");
const Product = require("../../products/model");
const Order = require("../../order/model");
const Prescription = require("../../prescription/model");
const Banner = require("../../bannerImg/model");
const Slider = require("../../sliderImages/model");
const Category = require("../../category/model");

const getTotalCountForDashboard = async () => {
    try {
      const filterQueryActive = { active: true };
      const filterQueryIsActive = { isActive: true };
  
      // Promises to get counts for each collection where isActive is true
      const usersPromise = User.countDocuments(filterQueryActive).exec();
      const brandPromise = Brand.countDocuments(filterQueryActive).exec();
      const productsPromise = Product.countDocuments(filterQueryIsActive).exec();
      const ordersPromise = Order.countDocuments().exec();
      const prescriptionsPromise = Prescription.countDocuments(filterQueryIsActive).exec();
      const bannersPromise = Banner.countDocuments(filterQueryIsActive).exec();
      const slidersPromise = Slider.countDocuments(filterQueryIsActive).exec();
      const categoriesPromise = Category.countDocuments(filterQueryActive).exec();
  
      // Await all promises concurrently
      const [
        userCount,
        brandCount,
        productCount,
        orderCount,
        prescriptionCount,
        bannerCount,
        sliderCount,
        categoryCount
      ] = await Promise.all([
        usersPromise,
        brandPromise,
        productsPromise,
        ordersPromise,
        prescriptionsPromise,
        bannersPromise,
        slidersPromise,
        categoriesPromise
      ]);
  
      return {
        data: {
        userCount,
          brandCount,
          productCount,
          orderCount,
          prescriptionCount,
          bannerCount,
          sliderCount,
          categoryCount
        },
        status: true,
        code: 200
      };
    } catch (error) {
      return { data: error.message, status: false, code: 500 };
    }
  };
  
  

module.exports = {
  getTotalCountForDashboard
};
