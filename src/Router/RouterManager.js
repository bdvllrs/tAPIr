const path = require('path');
const { Request } = require('../Request');

class RouterManager
{
    /**
     * Action callback
     * @callback action
     */

    constructor() {
        this.routes = [];
    }

    /**
     * Add a get route
     * @param {string} path: path to match
     * @param {action|string} action
     * @param {Array} middlewares
     */
    get(path, action, middlewares = []) {
        this.routes.push({
            path,
            action,
            method: 'get',
            middlewares: middlewares
        });
    }

    /**
     * Add a post route
     * @param {string} path: path to match
     * @param {action|string} action
     * @param {Array} middlewares
     */
    post(path, action, middlewares = []) {
        this.routes.push({
            path,
            action,
            method: 'post',
            middlewares: middlewares
        });
    }

    /**
     * Add a put route
     * @param {string} path: path to match
     * @param {action|string} action
     * @param {Array} middlewares
     */
    put(path, action, middlewares = []) {
        this.routes.push({
            path,
            action,
            method: 'put',
            middlewares: middlewares
        });
    }

    /**
     * Add a patch route
     * @param {string} path: path to match
     * @param {action|string} action
     * @param {Array} middlewares
     */
    patch(path, action, middlewares = []) {
        this.routes.push({
            path,
            action,
            method: 'patch',
            middlewares: middlewares
        });
    }

    /**
     * Add a delete route
     * @param {string} path: path to match
     * @param {action|string} action
     * @param {Array} middlewares
     */
    delete(path, action, middlewares = []) {
        this.routes.push({
            path,
            action,
            method: 'delete',
            middlewares: middlewares
        });
    }

    /**
     * Register all Route object
     * @param {Array} routeFiles: list of all Route object
     */
    register(routeFiles) {
        routeFiles.forEach(file => {
            const routesInFile = require(file.path);
            // If the file contains routes
            if (Array.isArray(routesInFile) && routesInFile.length > 0) {
                // We register all routes in the routerManager
                routesInFile.forEach(route => {
                    route.attach(this);
                });
            }
        });
    }

    /**
     * Start the express server
     * @param express
     * @param app: express app
     * @param {number} port:
     * @param {string} host:
     * @param callback
     */
    listen(express, app, port, host = '127.0.0.1', callback = () => {}) {
        app.use(express.static(path.resolve(this.config.app.appDir, './public')));

        /* Register all routes to express */
        this.routes.forEach(route => {
            const path = route.path[0] === '/' ? route.path : '/' + route.path;
            switch (route.method) {
                case 'post':
                    app.post(path, ...route.middlewares, this.getRouteCallback(route));
                    break;
                case 'put':
                    app.put(path, ...route.middlewares, this.getRouteCallback(route));
                    break;
                case 'patch':
                    app.patch(path, ...route.middlewares, this.getRouteCallback(route));
                    break;
                case 'delete':
                    app.delete(path, ...route.middlewares, this.getRouteCallback(route));
                    break;
                default:
                    app.get(path, ...route.middlewares, this.getRouteCallback(route));
            }
        });

        /* Start the server */
        app.listen(port, host, callback);
    }

    /**
     * Get the correct callback
     * @param {Object} route:
     * @param {string} route.path
     * @param {string} route.method
     * @param {action|string} route.action
     * @returns {function(*=, *=): *}
     */
    getRouteCallback(route) {
        if (typeof route.action === 'string') {
            // action is of form Controler@action
            const action = route.action.split('@');
            // Import the controllers from the file
            const Controllers = require(path.resolve(this.config.app.appDir, './controllers', action[0] + '.js'));

            let nameController = action[0].split('/');
            // Get the name of the wanted controller
            nameController = nameController[nameController.length - 1];
            // Return the callback
            return (req, res) => {
                // Initialize controller with request and response
                const request = new Request(req);
                const controller = new Controllers[nameController](request, res, this.config);
                // Return the action
                return controller.execute(action[1]);
            };
        } else {
            return (req, res) => route.action(req, res);
        }
    }

    setConfig(config) {
        this.config = config;
    }
}

router = new RouterManager();

exports.router = router;