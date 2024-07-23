const express = require("express");
const validate = require("../../middlewares/validate");
const validation = require("../../modules/order/validation");
const controller = require("../../modules/order/controller/orderController");
const auth = require("../../middlewares/auth");
const router = express.Router();
router.post("/add", validate(validation.add), controller.addOrder);
router.post("/get-user-orders/:userId",validate(validation.getOrderByUser),controller.getOrderByUser);
router.get("/:id", validate(validation.getOrderById), controller.getOrderById);

router.post("/all", validate(validation.allOrders), controller.getAllOrders);
router.put("/update/:id", validate(validation.update), controller.updateOrder);
router.post("/all-enquiries", validate(validation.allOrdersEnauiries), controller.getAllOrdersEnquiries);
router.post("/user-enquiries/:userId", auth(), validate(validation.getAllUserEnquiries), controller.getAllUserEnquiries);

module.exports = router;
