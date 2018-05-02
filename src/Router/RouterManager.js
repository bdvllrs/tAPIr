const path = require('path');
const { Request } = require('../Request');
const mongoose = require('mongoose');


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
     * Add a socket route
     * @param {string} path: path to match
     * @param {action|string} action
     * @param {Array} middlewares
     */
    socket(path, action, middlewares = []) {
        this.routes.push({
            path,
            action,
            method: 'socket',
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
     * @param http
     * @param socket
     * @param {number} port:
     * @param {string} host:
     * @param callback
     */
    listen(express, app, http, socket, port, host = '127.0.0.1', callback = () => {}) {
        app.use(express.static(path.resolve(this.config.app.appDir, './public')));

        /* Register all routes to express */
        this.routes.forEach(route => {
            const path = route.path[0] === '/' ? route.path : '/' + route.path;
            switch (route.method) {
                case 'get':
                    app.get(path, ...route.middlewares, this.getRouteCallback(route));
                    break;
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
            }
        });

        /* SOCKET Routes */
        const socketRoutes = this.routes.filter(route => route.method === 'socket');

        socket.on('connection', (s) => {
            socketRoutes.forEach(route => {
                if(route.path === 'connection') {
                    this.getRouteCallback(route)();
                } else {
                    s.on(route.path, this.getRouteCallback(route));
                }
            });
        });

        /* Connect to MongoDB */
        try {
            if(this.config.db.host) {
                let connectVar = 'mongodb://';
                if (this.config.db.username && this.config.db.password) {
                    connectVar += this.config.db.username + ':' + this.config.db.password + '@';
                }
                connectVar += this.config.db.host;
                if (this.config.db.port) {
                    connectVar += ':' + this.config.db.port;
                }
                mongoose.connect(connectVar);
            }
        } catch (e) {
            console.log(e);
        }

        /* Start the server */
        http.listen(port, host, callback);
    }

    /**
     * Get the correct callback
     * @param {Object} route:
     * @param {string} route.path
     * @param {string} route.method
     * @param {action|string} route.action
     * @returns {function(*=, *=): *}
     */
    getRouteCallback(route, socket) {
        if (typeof route.action === 'string') {
            // action is of form Controler@action
            const action = route.action.split('@');
            // Import the controllers from the file
            const Controllers = require(path.resolve(this.config.app.appDir, './controllers', action[0] + '.js'));

            let nameController = action[0].split('/');
            // Get the name of the wanted controller
            nameController = nameController[nameController.length - 1];
            // Return the callback
            if (route.method !== 'socket') {

                return (req, res) => {
                    // Initialize controller with request and response
                    const request = new Request(req);
                    const controller = new Controllers[nameController](request, res, socket, this.config);
                    // Return the action
                    return controller.execute(action[1]);
                };
            } else {
                return (curSocket, ...params) => {
                    // Initialize controller with request and response
                    const controller = new Controllers[nameController](null, null, socket, this.config, curSocket, ...params);
                    // Return the action
                    return controller.execute(action[1]);
                };
            }
        } else {
            if (route.method !== 'socket') {
                return (req, res) => route.action(req, res);
            } else {
                return (socket, ...params) => route.action(socket, ...params);
            }
        }
    }

    setConfig(config) {
        this.config = config;
    }
}

router = new RouterManager();

exports.router = router;