exports.Exception = class Exception
{
    constructor(err) {
        this.err = err;
    }

    handle() {
        return false;
    }
};