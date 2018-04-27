const fs = require('fs');
const path = require('path');
const { Response } = require('./Response');

exports.View = class View extends Response
{
    constructor(file) {
        super();
        this.ready = false;
        this.read = false;
        this.res = null;

        fs.readFile(path.resolve(__dirname, '../../../../app/resources/views/', file), 'utf-8', (err, content) => {
            if (err) throw err;
            this.content = content;
            this.read = true;
            if (this.ready) {
                this.send(this.res);
            }
        });
    }

    send(res) {
        if (this.read) {
            res.status(this.status).send(this.content);
        } else {
            this.ready = true;
            this.res = res;
        }
    }
};