const path = require('path');
const fs = require('fs');

function checkban(DeviceID) {
  // Construct an absolute path to the banned.json file
  const filePath = path.join(__dirname, '../database/banned.json');

  try {
    // Read and parse the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check if the device ID is in the banned list
    return data.bannedList.includes(DeviceID);
  } catch (err) {
    console.error('Error reading banned.json:', err);
    return false;
  }
}

module.exports = checkban;