const express = require('express');
const validate = require('../../middlewares/validate');
const uservalidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.get('/all-users', validate(uservalidation.listUsers), userController.getUsers);

router.get('/getUserIpDetails', userController.getUserIpDetails)

router.post('/check-wallet', userController.checkWalletExisted)

router.put('/updateStatus/:id', validate(uservalidation.updateUserStatus), userController.updateUserStatus)

router.get('/:id', validate(uservalidation.getUserById), userController.getUserById)
    .post('/update-profile/:id', validate(uservalidation.updateProfile), userController.updateProfile);

router.put('/delete-profile/:id', validate(uservalidation.deleteProfile), userController.deleteUser)

router.post('/update-user', auth(), validate(uservalidation.updateUser), userController.updateUser)

router.post('/get-all-users-with-pagination',userController.getAllUsersWithPagination)
module.exports = router;

