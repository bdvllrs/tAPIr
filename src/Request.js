
class Request
{
    /**
     * @param req: express request object
     */
    constructor(req) {
        this.req = req;
    }

    /**
     * Returns the value of the given request (query)
     * @param {string} key
     */
    get(key) {
        return this.req.query[key];
    }
}

exports.Request = Request;