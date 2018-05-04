const path = require('path');
const { Controller } = require('./Controller');
const { Model } = require('./Model');
const { Request } = require('./Request');
const { Response } = require('./Response/Response');
const { View } = require('./Response/View');
const { Json } = require('./Response/Json');
const { Socket } = require('./Response/Socket');
const { router, Router } = require('./Router');

const { Exception } = require('./Exceptions/Exception');

const { walkDirectory, loadConfig } = require('./utils');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io')(http);

exports.Controller = Controller;

exports.Model = Model;

exports.Request = Request;

exports.Response = Response;
exports.View = View;
exports.Json = Json;
exports.Socket = Socket;

// Utils
exports.walkDirectory = walkDirectory;
exports.loadConfig = loadConfig;

// Router
exports.Router = Router;

exports.router = router;

exports.Exception = Exception;

exports.listen = function (configDir) {
    const config = loadConfig(configDir);

    /* Reading the route folder to load the routes */
    const routeFiles = walkDirectory(path.resolve(config.app.appDir, './routes'));

    router.setConfig(config);

    router.register(routeFiles);

    router.listen(express, app, http, socket, config.app.port, config.app.host, () => {
        console.log('Server listing on ' + config.app.host + ':' + config.app.port);
    });
};

