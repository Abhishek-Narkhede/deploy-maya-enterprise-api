const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const  dashboardService  = require("../service/dashboard.service");
const { sendResponse } = require("../../../utils/responseHandler");

const getTotalCountForDashboard = catchAsync(async (req, res) => {
  const brand = await dashboardService.getTotalCountForDashboard();
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
  getTotalCountForDashboard
};
