'use strict';

const path = require('path');
const Feeder = require('./lib/feeder');
const video = require('./lib/video');

const outputFolder = path.join(__dirname, 'images');

const satelliteFeed = new Feeder(new Date('February 21, 2016 9:24:00'), outputFolder, 12);

satelliteFeed.getSeries()
    .then(() => video('images/%d.jpg', 'current.mp4'))
    .then(output => console.log(output))
    .catch(error => new Error(error));
