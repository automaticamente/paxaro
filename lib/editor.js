'use strict';

const gm = require('gm').subClass({
    imageMagick: true
});

module.exports = (stream, timestamp, font) => {
    return new Promise((resolve, reject) => {
        gm(stream)
            // .rotate('white', -19)
            .crop(800, 450, 280, 40)
            .stream((error, out) => {
                if (!error) {
                    gm(out)
                        .gravity('SouthEast')
                        .font(font)
                        .fontSize(30)
                        .fill('rgba(0,0,0,0.8)')
                        .drawText(25, 20, timestamp)
                        .fill('rgba(255,255,255,0.8)')
                        .drawText(26, 21, timestamp)
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