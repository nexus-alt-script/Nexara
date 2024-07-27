// restart.js
const { spawn } = require('child_process');
const path = require('path');

// Path to your main application file
const appPath = path.join(__dirname, 'index.js');

function startApp() {
  const child = spawn('node', [appPath], {
    stdio: 'inherit'
  });

  // Restart the application every 30 minutes
  setTimeout(() => {
    child.kill();
    startApp();
  }, 30 * 60 * 1000); // 30 minutes in milliseconds
}

startApp();