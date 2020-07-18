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
    server.post('/voice', (req, res) => {
        // Use the Twilio Node.js SDK to build an XML response
        const twiml = new VoiceResponse();
	    twiml.dial('+919554536474');
	    // res.play('http://demo.twilio.com/docs/classic.mp3');
	    console.log(twiml.toString());
	    res.send(twiml.toString());
    });
    server.use('/api/customers', apiRoute);
}

module.exports = {
    init: init
};
