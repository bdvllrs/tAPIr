const path = require('path');
const {walkDirectory} = require('../utils');

exports.ExceptionManager = class ExceptionManager {
    constructor(config, err) {
        this.err = err;
        this.exceptionFiles = walkDirectory(path.resolve(config.app.appDir, 'exceptions'));
        this.exceptionReturns = [];
        this.sendToExceptionsFiles();
    }

    sendToExceptionsFiles() {
        this.exceptionFiles.forEach(file => {
            const name = file.filename.split('.')[0];
            const Exception = require(file.path)[name];
            const exception = new Exception(this.err);
            this.exceptionReturns.push(exception.handle());
        });
    }

    /**
     * Returns the error message to send to the browser
     * @returns {string}: error message
     */
    getMessage() {
        return 'Error';
    }

    /**
     * Returns the status code to send to the browser
     * @returns {number}: status
     */
    getStatus() {
        return 500;
    }


};