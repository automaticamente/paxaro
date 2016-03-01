'use strict';

const spawn = require('child_process').spawn;

module.exports = (glob, output) => {
    return new Promise((resolve, reject) => {
        let ffmpegProcess;

        // With audio
        // ffmpeg -y -r 2 -i images/%d.jpg -i audio/background.mp3 -c:v libx264 -filter_complex "[1:0] apad" -shortest current.mp4

        const args = ['-y', '-r', '2', '-i', glob, '-c:v', 'libx264', output];

        try {
            ffmpegProcess = spawn('ffmpeg', args);
        } catch (error) {
            return reject(error);
        }

        ffmpegProcess.on('error', function(error) {
            return reject(error);
        });

        ffmpegProcess.on('close', function(code, signal) {
            if (code !== 0) {
                return reject(new Error('fuck!'));
            } else {
                return resolve(output);
            }
        });
    });
};
