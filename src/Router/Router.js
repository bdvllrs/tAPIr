const {GetRoute, PostRoute, PutRoute, PatchRoute, DeleteRoute, SocketRoute} = require('./Route');


exports.Router = class Router {
    /**
     * Action callback
     * @callback action
     */

    /**
     * Get route
     * @param {string} path
     * @param {action} action
     * @param {Array} middlewares
     * @returns {GetRoute}
     */
    static get(path, action, middlewares=[]) {
        return new GetRoute(path, action, middlewares);
    }

    /**
     * Post route
     * @param {string} path
     * @param {action} action
     * @param {Array} middlewares
     * @returns {PostRoute}
     */
    static post(path, action, middlewares=[]) {
        return new PostRoute(path, action, middlewares);
    }

    /**
     * Put route
     * @param {string} path
     * @param {action} action
     * @param {Array} middlewares
     * @returns {PutRoute}
     */
    static put(path, action, middlewares=[]) {
        return new PutRoute(path, action, middlewares);
    }

    /**
     * Patch route
     * @param {string} path
     * @param {action} action
     * @param {Array} middlewares
     * @returns {PutRoute}
     */
    static patch(path, action, middlewares=[]) {
        return new PatchRoute(path, action, middlewares);
    }

    /**
     * Delete route
     * @param {string} path
     * @param {action} action
     * @param {Array} middlewares
     * @returns {DeleteRoute}
     */
    static delete(path, action, middlewares=[]) {
        return new DeleteRoute(path, action, middlewares);
    }

    /**
     * Socket route
     * @param {string} path
     * @param {action} action
     * @param {Array} middlewares
     * @returns {SocketRoute}
     */
    static socket(path, action, middlewares=[]) {
        return new SocketRoute(path, action, middlewares);
    }
};
