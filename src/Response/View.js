const fs = require('fs');
const path = require('path');
const { Response } = require('./Response');

exports.View = class View extends Response
{
    constructor(file) {
        super();
        this.file = file;
        this.config = null;
    }

    setConfig(config) {
        this.config = config;
    }

    send(res) {
        fs.readFile(path.resolve(this.config.app.appDir, '../app/resources/views/', this.file), 'utf-8', (err, content) => {
            if (err) throw err;
            res.status(this.status).send(content);
        });
    }
};