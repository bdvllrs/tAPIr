const path = require('path');
const {walkDirectory} = require('../utils');

exports.ExceptionManager = class ExceptionManager {
    constructor(config, err) {
        this.err = err;
        this.exceptionFiles = walkDirectory(path.resolve(config.app.appDir, 'exceptions'));
        this.message = null;
        this.status = 200;
        this.sendToExceptionsFiles();
    }

    sendToExceptionsFiles() {
        for(let i=0; i < this.exceptionFiles.length; i++) {
            const name = this.exceptionFiles[i].filename.split('.')[0];
            const Exception = require(this.exceptionFiles[i].path)[name];
            const exception = new Exception(this.err);
            exception.handle();
            if(exception.status !== 200) {
                this.message = exception.message;
                this.status = exception.status;
                break;
            }
        }
    }

    /**
     * Returns the error message to send to the browser
     * @returns {string}: error message
     */
    getMessage() {
        return this.message;
    }

    /**
     * Returns the status code to send to the browser
     * @returns {number}: status
     */
    getStatus() {
        return this.status;
    }


};