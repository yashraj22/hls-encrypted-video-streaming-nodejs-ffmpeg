const fs = require('fs-extra');
const path = require('path');

async function clearTempUploads() {
  try {
    await fs.emptyDir(path.join(__dirname, '..', 'temp-uploads'));
    console.log('Temp-uploads directory cleared.');
  } catch (err) {
    console.error('Error clearing temp-uploads directory:', err);
  }
}

module.exports = { clearTempUploads };
