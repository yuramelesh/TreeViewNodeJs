#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
var data = require('./data');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
    user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
    password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
    port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
    database : process.env.OPENSHIFT_APP_NAME
});

//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: '78561245',
//    database: 'servernode'
//});


/**
 *  Define the sample application.
 */

var SampleApp = function () {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */

    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
        ;
    };

    /**
     *  Populate the cache.
     */

    self.populateCache = function () {
        if (typeof self.zcache === "undefined") {
            self.zcache = {'index.html': ''};
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };

    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */

    self.cache_get = function (key) {
        return self.zcache[key];
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */

    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */

    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */

    self.createRoutes = function () {
        self.routes = {};

        self.routes['/asciimo'] = function (req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html'));
        };
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */

    self.initializeServer = function () {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).

        self.app.use(express.static(__dirname + '/public'));
        self.app.use(express.bodyParser());

        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }

        for (var r in self.routes) {
            self.app.post(r, self.routes[r]);
        }

        self.app.post('/getData', function (req, res) {
            connection.query("SELECT * FROM companies WHERE 1", function (err, result) {
                res.send(result);
            });
        });

        self.app.post('/remove', function (req) {
            data.remove(req.body.id);
        });

        self.app.post('/update', function (req) {

            var updateName = 'UPDATE companies SET name = ? WHERE id=?';
            var updateEarnings = 'UPDATE companies SET earnings = ? WHERE id=?';
            var updateParent = 'UPDATE companies SET parent = ? WHERE id=?';

            //data.updating(req.body.id, req.body.name, req.body.earnings, req.body.parent);
            if (req.body.name !== '') {
                connection.query(updateName, [req.body.name, req.body.id], function (err, res) {
                    if (err) throw err;
                    else {
                    }
                });
            }

            if (req.body.earnings !== '') {
                connection.query(updateEarnings, [req.body.earnings, req.body.id], function (err, res) {
                    if (err) throw err;
                    else {
                    }
                });
            }

            if (req.body.parent !== '') {
                connection.query(updateParent, [req.body.parent, req.body.id], function (err, res) {
                    if (err) throw err;
                    else {
                    }
                });
            }
        });

        self.app.post('/add', function (req) {
            var newCompany = {name: req.body.name, earnings: req.body.earnings, parent: req.body.parent     };
            connection.query('INSERT INTO companies SET ?', newCompany, function (err, result) {
                //console.log(err);
                //console.log(result);
            });
           // data.adding(req.body.name, req.body.earnings, req.body.parent);
        });
    };

    /**
     *  Initializes the sample application.
     */

    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };

    /**
     *  Start the server (starts up the sample application).
     */

    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};
/*  Sample Application.  */

/**
 *  main():  Main code.
 */

var zapp = new SampleApp();
zapp.initialize();
zapp.start();