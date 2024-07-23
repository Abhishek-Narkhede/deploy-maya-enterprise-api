const express = require("express");
const validate = require("../../middlewares/validate");
const validation = require("../../modules/orderItem/validation");
const controller = require("../../modules/orderItem/controller/orderItemController");

const router = express.Router();
router.post("/add", validate(validation.add), controller.addOrderItem);
router.get("/:orderId", validate(validation.getOrderItem), controller.getOrderItemByOrderId);
router.put("/update/:id", validate(validation.update), controller.updateOrderItem);
router.delete("/delete/:id", validate(validation.deleteOrderItem), controller.deleteOrderItem);

module.exports = router;
