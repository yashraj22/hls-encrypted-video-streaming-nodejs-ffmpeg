const fs = require('fs-extra');
const path = require('path');

async function updateJsonData(title, videoPath, thumbPath) {
  const dataFilePath = path.join(__dirname, '..', 'public', 'data.json');
  const data = fs.readJsonSync(dataFilePath);

  data.videos.push({
    video: videoPath,
    thumb: thumbPath,
    title,
  });

  fs.writeJsonSync(dataFilePath, data, { spaces: 2 });
}

module.exports = { updateJsonData };
