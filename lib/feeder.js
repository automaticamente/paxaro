'use strict';

const fs = require('fs');
const path = require('path');

const request = require('request');
const moment = require('moment');
const rimraf = require('rimraf');

const editor = require('./editor');

class Feeder {
    constructor(startTime, outputFolder, number, config) {
        this.startTime = startTime.set('hour', startTime.hour()).set('minute', 0).utc();
        this.outputFolder = outputFolder;

        //sorry
        if (!fs.existsSync(this.outputFolder)) {
            fs.mkdirSync(this.outputFolder);
        }

        this.number = number || 12;

        this.baseUrl = 'http://es.sat24.com/image?type=visual5HDComplete&region=sp&timestamp=';
        this.dateFormat = 'YYYYMMDDHHmm';
        this.config = config;
    }

    getSeries() {

        let n = this.number;
        const promises = [];
        promises.push(this._getImage(this._getTimestamp(), n));

        while (n > 0) {
            promises.push(this._getImage(this._getTimestamp(5), n));
            n--;
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then((files) => {
                    const images = [];

                    for (let fileName of files) {
                        images.push(fileName);
                    }

                    return resolve(images);
                })
                .catch((error) => {
                    return reject(error);
                });

        });
    }

    clean() {
        return rimraf.sync(this.outputFolder);
    }

    _getTimestamp(delta, unit) {
        unit = unit || 'minutes';
        return this.startTime.subtract(delta, unit).utc().format(this.dateFormat);
    }

    _getImage(timestamp, number) {
        return new Promise((resolve, reject) => {
            editor(request(this.baseUrl + timestamp), this.startTime.local().format('DD/MM/YY HH:mm'), this.config.font)
                .then(stream => {
                    const fileName = path.join(this.outputFolder, number + '.jpg');
                    const outputStream = stream.pipe(fs.createWriteStream(fileName));

                    outputStream.on('close', () => {
                        return resolve(fileName);
                    });

                    outputStream.on('error', (error) => {
                        return reject(error);
                    });

                });

        });
    }

}


module.exports = Feeder;