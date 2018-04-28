const fs = require('fs');
const path = require('path');
const { Response } = require('./Response');
const Mustache = require('mustache');

exports.View = class View extends Response
{
    constructor(file, context) {
        super();
        this.file = file;
        this.config = null;
        this.context = context;
    }

    setConfig(config) {
        this.config = config;
    }

    send(res) {
        if (this.config === null) throw new Error('Config has not been passed to View object.');
        fs.readFile(path.resolve(this.config.app.appDir, '../app/resources/views/', this.file), 'utf-8', (err,
                                                                                                          content) => {
            if (err) throw err;

            res.status(this.status).send(Mustache.render(content, this.context));
        });
    }
};