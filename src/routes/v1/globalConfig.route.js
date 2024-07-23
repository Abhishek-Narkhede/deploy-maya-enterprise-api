
const express = require('express');
// const path = require('path');
// const ConfigController = require(path.resolve(__dirname, '../../modules/globalConfig/controller/globalconfig.controller'));
const ConfigController = require('../../modules/globalConfig/controller/globalconfig.controller');


const router = express.Router();

router.post('/add-config', ConfigController.addConfig);
router.post('/add-or-update-config', ConfigController.addOrUpdateConfig);
router.get('/get-config', ConfigController.getConfig);
router.put('/update-config/:id', ConfigController.updateConfigById);
router.put('/delete-config/:id', ConfigController.deleteConfigById);

module.exports = router;