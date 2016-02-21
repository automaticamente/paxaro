'use strict';

const path = require('path');
const Feeder = require('./lib/feeder');

const satelliteFeed = new Feeder(new Date(), path.join(__dirname, 'images'), 12);

satelliteFeed.getSeries()
    .then(images => {
        console.log(images);
    })
    .catch(error => console.log(error));

//ffmpeg -r 4 -i %d.jpg -c:v libx264 test.mp4