'use strict';

const
    express = require('express'),
    customerService = require('../../controllers/customers/controller.js');

let router = express.Router();

// router.get('/', customerService.homeRoute);
router.get('/', customerService.getAllCustomers);
router.get('/:id', customerService.getCustomerWithID);
router.post('/', customerService.signUpLogin);
router.post('/verifyOTP', customerService.verifyOTP);
router.put('/:id', customerService.updateUser);
router.delete('/:id', customerService.deleteUser);

module.exports = router;
