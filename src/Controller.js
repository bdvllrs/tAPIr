const { Response } = require('./Response/Response');

exports.Controller = class Controller
{
    /**
     * @param {Request} request: Request object
     * @param res
     */
    constructor(request, res, config) {
        this.request = request;
        this._res = res;
        this.config = config;
    }

    /**
     * Handler of the method to execute
     * @param {string} method: method to execute
     */
    execute(method) {
        const resp = this[method]();
        if (resp === undefined) {
            this._res.sendStatus(200);
        }
        // If the resp is a View object
        else if(resp instanceof View) {
            resp.setConfig(self.config);
            resp.send(this._res);
        }
        // If the resp is a Resp object
        else if (resp instanceof Response) {
            resp.send(this._res);
        }
    }
};