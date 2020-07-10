'use strict';

const
    express = require('express'),
    expressHandlebars = require('express-handlebars'),
    bodyParser = require('body-parser');

    let server = express();
    let config = require('./configs')

    function create(config) {
        let routes = require('./server/routes/setup.js');

        // Server settings
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        server.set('viewDir', config.viewDir);

        // Returns middleware that parses json
        server.use(bodyParser.json());

        // Set up routes
        routes.init(server);
    };

    function start(){
        let hostname = server.get('hostname'),
            port = server.get('port');

        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };

    create(config);
    start();
