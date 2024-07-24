const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emailSubscriptionValidation = require('../../modules/emailSubscription/validation');
const emailSubscriptionController = require('../../modules/emailSubscription/controller/emailSubscription.controller');

const router = express.Router();

router.post('/add', validate(emailSubscriptionValidation.addEmailSubscription), auth("manageUsers"), emailSubscriptionController.addEmailSubscription);
router.put('/update-by-user/:id', emailSubscriptionController.updateSubscriptionByUserId);
router.post('/get-all', emailSubscriptionController.getAllSubscriptions);
router.post('/get-all/unsubscriber', emailSubscriptionController.getAllUnSubscriber);
router.get('/get-by-user/:id', emailSubscriptionController.getSubscriptionByUserId);
router.delete('/delete-by-userId/:id', emailSubscriptionController.deleteSubscriptionByUserId);

module.exports = router;