'use strict';

const
    express = require('express'),
    customerController = require('../../controllers/customers/controller.js'),
    customerValidator = require('../../validator/customers/validator.js');

let router = express.Router();

router.get('/', customerValidator.validateGetAll, customerController.getAllCustomers);
router.get('/:id', customerValidator.validateGetWithID, customerController.getCustomerWithID);
router.post('/login', customerValidator.validateCreate, customerController.signUpLogin);
router.put('/:id', customerValidator.validateUpate, customerController.updateUser);
router.delete('/:email', customerValidator.validateDelete, customerController.deleteUser);
router.post('/verifyOTP', customerValidator.validateVerifyOTP, customerController.verifyOTP);

module.exports = router;
