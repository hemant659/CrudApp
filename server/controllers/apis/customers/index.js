'use strict';

const
    express = require('express'),
    customerService = require('../../../services/customers');

let router = express.Router();

// router.get('/', customerService.homeRoute);
router.get('/', customerService.getAllCustomers);
router.get('/:id', customerService.getCustomerWithID);
router.post('/', customerService.createNewUser);
router.put('/:id', customerService.updateUser);
router.delete('/:id', customerService.deleteUser);

module.exports = router;
