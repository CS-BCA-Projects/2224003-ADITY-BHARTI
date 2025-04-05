const fs = require('fs');
const path = require('path');

function getTodayFreedomImages(folderPath) {
  let imageData = [];

  try {
    if (!fs.existsSync(folderPath)) {
      console.warn("Freedom archive folder not found:", folderPath);
      return [];
    }

    const files = fs.readdirSync(folderPath);
    const todayStr = new Date().toDateString();

    // ✅ Define todayImages before using it
    const todayImages = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return false;

      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      return new Date(stats.mtime).toDateString() === todayStr;
    });

    // Shuffle images randomly
    const shuffled = todayImages.sort(() => 0.5 - Math.random());

    // Pick only 2 images
    const selected = shuffled.slice(0, 2);

    // Prepare image data
    imageData = selected.map(file => ({
      image: `/images/freedom-archive/${file}`,
      title: "Freedom Fighter"
    }));

  } catch (err) {
    console.error('Error reading archive folder:', err.message);
  }

  return imageData;
}

module.exports = getTodayFreedomImages;
