const fs = require('fs');
const path = require('path');

function isVerified(key) {
  const filePath = path.join(__dirname, '../database/verified.json');

  try {
    // Read and parse the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check if the key is in the verified list
    return data.verified.includes(key);
  } catch (err) {
    console.error('Error reading verified.json:', err);
    return false;
  }
}

module.exports = isVerified;