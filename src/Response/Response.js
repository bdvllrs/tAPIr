exports.Response = class Response
{
    /**
     * @param {string} content
     * @param {number} status
     * @param ready
     */
    constructor(content = '', status = 200) {
        this.content = content;
        this.status = status;
    }

    /**
     * Send the response
     * @param res: express response object
     */
    send(res) {
        res.status(this.status).send(this.content);
    }
};