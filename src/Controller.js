const { ExceptionManager } = require('./Exceptions/ExceptionManager');
const { Response } = require('./Response/Response');
const { View } = require('./Response/View');
const { Json } = require('./Response/Json');

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
        try {
            let resp = this[method]();
            if (typeof resp === 'object' || Array.isArray(resp)) {
                resp = new Json(resp);
            }
            else if (typeof resp === 'string' || typeof resp === 'number') {
                resp = new Response(resp);
            }
            if (resp === undefined) {
                this._res.sendStatus(200);
            }
            // If the resp is a View object
            else if (resp instanceof View) {
                resp.setConfig(this.config);
                resp.send(this._res);
            }
            // If the resp is a Resp object
            else {
                resp.send(this._res);
            }
        } catch (err) {
            const exceptionMng = new ExceptionManager(this.config, err);
            const response = new Response(exceptionMng.getMessage(), exceptionMng.getStatus());
            response.send(this._res);
        }
    }
};