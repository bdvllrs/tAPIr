const { Controller } = require('./Controller');
const { Request } = require('./Request');
const { Response } = require('./Response/Response');
const { View } = require('./Response/View');
const {router, Router} = require('./Router');
const {GetRoute, PostRoute, PutRoute, DeleteRoute} = require('./Router');

const {walkDirectory, loadConfig} = require('./utils');

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

