'use strict';

const
    express = require('express'),
    customersController = require('../../controllers/apis/customers');

let router = express.Router();

router.use('/customers', customersController);

module.exports = router;
