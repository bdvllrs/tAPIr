const path = require('path');
const { Controller } = require('./Controller');
const { Request } = require('./Request');
const { Response } = require('./Response/Response');
const { View } = require('./Response/View');
const {router, Router} = require('./Router');
const {GetRoute, PostRoute, PutRoute, DeleteRoute} = require('./Router');

const {Exception} = require('./Exceptions/Exception');

const {walkDirectory, loadConfig} = require('./utils');

const express = require('express');
const app = express();

exports.Controller = Controller;

exports.Request = Request;

exports.Response = Response;
exports.View = View;

// Utils
exports.walkDirectory = walkDirectory;
exports.loadConfig = loadConfig;

// Router
exports.Router = Router;

exports.router = router;

exports.GetRoute = GetRoute;
exports.PostRoute = PostRoute;
exports.PutRoute = PutRoute;
exports.DeleteRoute = DeleteRoute;

exports.Exception = Exception;

exports.listen = function(configDir) {
    const config = loadConfig(configDir);

    /* Reading the route folder to load the routes */
    const routeFiles = walkDirectory(path.resolve(config.app.appDir, './routes'));

    router.setConfig(config);

    router.register(routeFiles);

    router.listen(express, app, config.app.port, config.app.host, () => {
        console.log('Server listing on ' + config.app.host + ':' + config.app.port);
    });
};

