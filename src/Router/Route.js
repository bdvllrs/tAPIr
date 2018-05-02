
class Route {

    constructor(path, action, middlewares=[]) {
        this.path = path;
        this.action = action;
        this.middlewares = middlewares;
    }

    /**
     * Register route to the routeManager
     * @param {RouterManager} routerManager
     */
    attach(routerManager) {
        throw new Error('You have to implement the method Route.apply');
    }

}

exports.GetRoute = class GetRoute extends Route {
    attach(routerManager) {
        routerManager.get(this.path, this.action, this.middlewares)
    }
};

exports.PostRoute = class PostRoute extends Route {
    attach(routerManager) {
        routerManager.post(this.path, this.action, this.middlewares)
    }
};

exports.PutRoute = class PutRoute extends Route {
    attach(routerManager) {
        routerManager.put(this.path, this.action, this.middlewares)
    }
};

exports.PatchRoute = class PatchRoute extends Route {
    attach(routerManager) {
        routerManager.patch(this.path, this.action, this.middlewares)
    }
};

exports.DeleteRoute = class DeleteRoute extends Route {
    attach(routerManager) {
        routerManager.delete(this.path, this.action, this.middlewares)
    }
};

exports.SocketRoute = class SocketRoute extends Route {
    attach(routerManager) {
        routerManager.socket(this.path, this.action, this.middlewares)
    }
};
