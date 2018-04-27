const {router} = require('./RouterManager');
const {Router} = require('./Router');
const {GetRoute, PostRoute, PutRoute, DeleteRoute} = require('./Route');

exports.Router = Router;

exports.router = router;

exports.GetRoute = GetRoute;
exports.PostRoute = PostRoute;
exports.PutRoute = PutRoute;
exports.DeleteRoute = DeleteRoute;
