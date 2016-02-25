'use strict';

const fs = require('fs');
const path = require('path');

const suncalc = require('suncalc');
const moment = require('moment');

const Feeder = require('./lib/feeder');
const Tweeter = require('./lib/tweeter');
const video = require('./lib/video');

const config = fs.existsSync('./local.config.js') ?
    require('./local.config.js') :
    require('./config.js');

const T = new Tweeter(config.twitterAPI);

const bot = () => {

    const now = moment('2015-02-25T08:32:21.196+0100');
    const sun = suncalc.getTimes(now, 42.66, -8.11);

    const dusk = moment(sun.dusk);
    const dawn = moment(sun.dawn);

    if(now > dawn && now < dusk) {
        console.log('é polo dia');
    } else {
        console.log('é pola noite');
    }

    // const satelliteFeed = new Feeder(new Date('February 24, 2016 13:24:00'), config.imagesPath, 24, config);
    const satelliteFeed = new Feeder(new Date(), config.imagesPath, 24, config);

    satelliteFeed.getSeries()
        .then(() => video(config.imagesPath + '/%d.jpg', path.join(__dirname, 'current.mp4')))
        .then(video => {
            satelliteFeed.clean();
            return T.tweetVideo('A última hora de Galicia a vista de páxaro espacial', video);
        })
        .then(id => process.stdout.write(id))
        .catch(error => {
            process.stderr.write(error.message);
        });
};

bot();