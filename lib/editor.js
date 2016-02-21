'use strict';

const gm = require('gm').subClass({
    imageMagick: true
});

module.exports = (stream, timestamp) => {
    return new Promise((resolve, reject) => {
        gm(stream)
            .rotate('white', -19)
            .crop(640, 360, 300, 152)
            .stream((error, out) => {
                if (!error) {
                    gm(out)
                        .gravity('SouthEast')
                        .fontSize(18)
                        .fill('rgba(255,255,255,0.8)')
                        .drawText(25, 20, timestamp)
                        .stream((error, out) => {
                            if (!error) {
                                return resolve(out);
                            } else {
                                return reject(error);
                            }
                        });
                } else {
                    reject(error);
                }
            });
    });
};