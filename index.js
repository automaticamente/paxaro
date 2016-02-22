'use strict';

const fs = require('fs');
const path = require('path');

const Feeder = require('./lib/feeder');
const Tweeter = require('./lib/tweeter');
const video = require('./lib/video');

const config = fs.existsSync('./local.config.js') ?
    require('./local.config.js') :
    require('./config.js');

const T = new Tweeter(config.twitterAPI);

const satelliteFeed = new Feeder(new Date('February 22, 2016 13:24:00'), config.imagesPath, 12);
// const satelliteFeed = new Feeder(new Date(), outputFolder, 12);

satelliteFeed.getSeries()
    .then(() => video(config.imagesPath + '/%d.jpg', path.join(__dirname, 'current.mp4')))
    .then(video => {
        satelliteFeed.clean();
        return T.tweet('A última hora de Galicia a vista de páxaro espacial', video);
    })
    .then(id => process.stdout.write(id))
    .catch(error => {
        process.stderr.write(error.message);
    });