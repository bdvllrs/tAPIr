const { Response } = require('./Response');

exports.Json = class Json extends Response
{
    /**
     * Send json response
     * @param res: express response object
     */
    send(res) {
        res.status(this.status).json(this.content);
    }
};