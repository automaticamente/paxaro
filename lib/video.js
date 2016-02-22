'use strict';

const spawn = require('child_process').spawn;

module.exports = (glob, output) => {
    return new Promise((resolve, reject) => {
        let ffmpegProcess;
        const args = ['-y', '-r', '4', '-i', glob, '-c:v', 'libx264', output];

        console.log('ffmpeg', args.join(' '));

        try {
            ffmpegProcess = spawn('ffmpeg', args);
        } catch(error) {
            return reject(error);
        }

        ffmpegProcess.on('error', function(error) {
            return reject(error);
        });

        ffmpegProcess.on('close', function (code, signal) {
            if(code !== 0) {
                return reject(new Error('fuck!'));
            } else {
                return resolve(output);
            }
        });
    });
};