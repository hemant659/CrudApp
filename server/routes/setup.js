'use strict';

const
    apiRoute = require('./customers/route.js');


function init(server) {
    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });

    server.get('/', function (req, res) {
        res.redirect('/home');
    });

    server.use('/api/customers', apiRoute);
}

module.exports = {
    init: init
};
