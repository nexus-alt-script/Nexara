const express = require('express');
const app = express();
const fs = require('fs');
const checkban = require('./nexara/system/checkBAN.js');
const isVerified = require('./nexara/system/checkVerification.js');
const login = require('fca-unofficial');

app.get('/isBanned', (req, res) => {
  const deviceID = req.query.deviceID;
  if (!deviceID) return res.send('Error');
  if (checkban(deviceID)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get('/isVerified', (req, res) => {
  if (isVerified(req.query.key)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/bg.png');
});

login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
  if (err) return;

  api.listenMqtt((err, event) => {
    if (err) return console.log(err);

    // Log the entire event object for inspection
    

    // Ensure event type is 'message' and event.body is defined
    if (event.type === 'message' && event.body) {
      const args = event.body.trim().split(/ +/);

      if (args[0] === "/verify") {
        if (!args[1]) {
          api.sendMessage("No KEY Provided.", event.threadID, event.messageID);
          api.setMessageReaction("💢", event.messageID, (err) => {}, true);
        } else {
          if (!args[1].includes("NX-")) return api.sendMessage("Invalid ID.", event.threadID, event.messageID);
          let data = JSON.parse(fs.readFileSync('./nexara/database/verified.json', 'utf8'));
          data.verified.push(args[1]);
          fs.writeFileSync('./nexara/database/verified.json', JSON.stringify(data, null, 2), 'utf8');
          api.sendMessage("Verified Success! You can now use your script.", event.threadID, event.messageID);
          api.setMessageReaction("😍", event.messageID, (err) => {}, true);
        }
      }

      if (args[0] === "/ban") {
        if (event.senderID !== "100006664923252") {
          return api.sendMessage("You don't have permission to use this command.", event.threadID, event.messageID);
        }
        if (!args[1]) {
          api.sendMessage("No ID Provided.", event.threadID, event.messageID);
          api.setMessageReaction("💢", event.messageID, (err) => {}, true);
        } else {
          if (!args[1].includes("DV-")) return api.sendMessage("Invalid ID.", event.threadID, event.messageID);
          let data = JSON.parse(fs.readFileSync('./nexara/database/banned.json', 'utf8'));
          data.bannedList.push(args[1]);
          fs.writeFileSync('./nexara/database/banned.json', JSON.stringify(data, null, 2), 'utf8');
          api.sendMessage("ID Banned Successfully.", event.threadID, event.messageID);
          api.setMessageReaction("😍", event.messageID, (err) => {}, true);
        }
      }
    } else {
      console.log('Event body is undefined.');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});