const express = require('express');
const validate = require('../../middlewares/validate');
const stepperProgressValidation = require('../../modules/stepperprogress/validation');
const stepperprogressController = require('../../modules/stepperprogress/controller/stepperprogressController');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add-stepper-progress/:userId', stepperprogressController.addStepperProgress);
router.put('/update-stepper-progress/:userId', stepperprogressController.updateStepperProgress);
router.get('/user-stepper-progress/:userId', stepperprogressController.userSteppeprProgress);
router.delete('/delete-stepper-progressByUserId/:userId', stepperprogressController.deleteSteppeprProgressByUserId);

module.exports = router;
