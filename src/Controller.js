const path = require('path');
const { mongoose } = require('../mongoose');
const { ExceptionManager } = require('./Exceptions/ExceptionManager');
const { Response } = require('./Response/Response');
const { View } = require('./Response/View');
const { Json } = require('./Response/Json');
const { Socket } = require('./Response/Socket');

exports.Controller = class Controller
{
    /**
     * @param {Request} request: Request object
     * @param res
     * @param socket
     * @param config
     * @param curSocket
     * @param params
     */
    constructor(request, res, socket, config, curSocket = null, ...params) {
        this.request = request !== null ? request : {};
        this._res = res;
        this.config = config;
        this.socket = {
            current: curSocket,
            global: socket
        };
        this.request.params = params;
    }

    /**
     * Handler of the method to execute
     * @param {string} method: method to execute
     */
    execute(method) {
        try {
            let resp = this[method]();
            if (resp instanceof Socket) {
                this.socket.emit(resp.name, resp.data);
            } else {
                if (typeof resp === 'string' || typeof resp === 'number') {
                    resp = new Response(resp);
                }
                if (resp === undefined && this._res !== null) {
                    this._res.sendStatus(200);
                }
                // If the resp is a View object
                else if (resp instanceof View) {
                    resp.setConfig(this.config);
                    resp.send(this._res);
                }
                else if (typeof resp === 'object' || Array.isArray(resp)) {
                    resp = new Json(resp);
                }
                // If the resp is a Resp object
                else if (this._res !== null) {
                    resp.send(this._res);
                }
            }
        } catch (err) {
            console.log(err);
            const exceptionMng = new ExceptionManager(this.config, err);
            const response = new Response(exceptionMng.getMessage(), exceptionMng.getStatus());
            response.send(this._res);
        }
    }

    /**
     * Get Mongoose model
     * @param modelName
     */
    model(modelName) {
        const schema = require(path.resolve(this.config.app.appDir, './schemas/', modelName + '.js'))[modelName];
        return mongoose.model(modelName, schema);
    }
};