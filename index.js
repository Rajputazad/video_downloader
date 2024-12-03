const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const port = 3000;

app.get('/download', async (req, res) => {
  const videoUrl = req.query.url; // http://localhost:3000/download?url=https://youtube.com/watch?v=0G49Dgfxh-o
//   const quality = req.query.quality || '360p';  // Default to highest video quality
  const quality = req.query.quality || 'lowestvideo';   // lowestaudio highestvideo lowestvideo highestaudio Default to highest video quality
  const format = req.query.format || 'mp4'; //mp3 mp4 
  if (!videoUrl) {
    return res.status(400).send('Missing video URL');
  }

  // Validate URL
  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  // Set the filename based on the video URL or a default name
  const fileName = 'downloaded_video.mp4';

  try {
    let fileName;
    if (format === 'mp3') {
      fileName = 'downloaded_audio.mp3';
      res.header('Content-Disposition', `attachment; filename=${fileName}`);
      res.header('Content-Type', 'audio/mp3');

      // Stream only the audio from the video and convert it to MP3
      ytdl(videoUrl, { filter: 'audioonly', quality })
        .pipe(res)
        .on('finish', () => {
          console.log('Audio download complete');
        })
        .on('error', (err) => {
          console.error('Error downloading audio:', err);
          res.status(500).send('Error downloading audio');
        });
    } else {
      fileName = 'downloaded_video.mp4';
      res.header('Content-Disposition', `attachment; filename=${fileName}`);
      res.header('Content-Type', 'video/mp4');

      // Stream the video in the specified quality
      ytdl(videoUrl, { quality })
        .pipe(res)
        .on('finish', () => {
          console.log('Video download complete');
        })
        .on('error', (err) => {
          console.error('Error downloading video:', err);
          res.status(500).send('Error downloading video');
        });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});
// async function getAvailableQualities(videoUrl) {
//     try {
//       const info = await ytdl.getInfo(videoUrl);
//       const formats = info.formats;
//       const availableQualities = formats.map(format => format.resolution || format.audioBitrate);
//       console.log(availableQualities);
//     } catch (err) {
//       console.error('Error fetching video info:', err);
//     }
//   }
  
//   getAvailableQualities('https://youtube.com/watch?v=0G49Dgfxh-o');
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
