exports.Exception = class Exception
{
    constructor(err) {
        this.error = err;
        this.status = 200;
        this.message = null;
    }

    handle() {}
};