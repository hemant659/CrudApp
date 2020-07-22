'use strict';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
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
    server.post('/voice/:contact', (req, res) => {
        const twiml = new VoiceResponse();
        twiml.dial(req.params.contact);
	    // res.play('http://demo.twilio.com/docs/classic.mp3');
	    console.log(twiml.toString());
	    res.send(twiml.toString());
    });
    server.use('/api/customers', apiRoute);
}

module.exports = {
    init: init
};
