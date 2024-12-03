const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const videoUrl ="https://www.youtube.com/watch?v=0G49Dgfxh-o"


// URL of the video you want to download

// Output file name
const outputFileName = 'downloaded_video.mp4';

// Download video using ytdl-core and save it to a file
ytdl(videoUrl, { quality: 'highestvideo' })
  .pipe(fs.createWriteStream(outputFileName))
  .on('finish', () => {
    console.log('Video download complete!');
  })
  .on('error', (err) => {
    console.error('Error downloading video:', err);
  });