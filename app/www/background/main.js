'use strict';

/******************************************************************************/

var MY_DEFAULT_DISPLAY_NAME = 'Anonymous Coward';

/******************************************************************************/

function identifySelfEh(displayName, callback) {
  sendGcmMessage({
    'type': 'identifySelfEh',
    'name': displayName
  });
  updateUIs();
}

function onUserListChangeEh(userlist) {
  updateUserList(userlist);
  updateUIs();
}

function remindMeAgainEh(callback) {
  sendGcmMessage({
    'type': 'remindMeAgainEh'
  });
}

function onIncomingEh(from_userid) {
  console.log('received Eh from', from_userid);

  userlist[from_userid].inboundEhCount++;

  // TODO: only if app is in background
  createLocalNotification(from_userid, {
    type:'basic',
    title:'Eh',
    message: userlist[from_userid].name + ' x' + userlist[from_userid].inboundEhCount
  });

  var sounds = [
    "/common/assets/sounds/computer.wav",
    "/common/assets/sounds/funylook.wav",
    "/common/assets/sounds/jock.wav",
    "/common/assets/sounds/loonybin.wav",
    "/common/assets/sounds/loonybin2.wav",
    "/common/assets/sounds/takeoff3.wav",
    "/common/assets/sounds/whiplash.wav",
  ];
  play(sounds[Math.floor(Math.random() * sounds.length)]); // TODO: replace this

  updateUIs();
}

function sendEh(userid, callback) {
  userlist[userid].outboundEhCount++;
  userlist[userid].isCurrentlySendingMessageEh = true;

  sendGcmMessage({
    'type': 'sendEh',
    'to_userid': userid
  }, function() {
    userlist[userid].isCurrentlySendingMessageEh = false;
    // Gcm call returns so fast, we introduce an artificial delay
    callback();
  });
}

/******************************************************************************/

function handleIncomingGcmMessage(msg) {
  if (typeof msg.data.type !== 'string') {
    console.error('Invalid message format:', JSON.stringify(msg, null, 2));
    return;
  }

  switch(msg.data.type) {
    case 'userListChangeEh': {
      onUserListChangeEh(JSON.parse(msg.data.users));
      break;
    };
    case 'incomingEh': {
      onIncomingEh(msg.data.from_userid);
      break;
    };
    default: {
      console.error('Invalid message type:', JSON.stringify(msg, null, 2));
      return;
    }
  }
}

function handleNotificationClick(notificationId) {
}

function updateUIs() {
  chrome.app.window.getAll().forEach(function(appWindow) {
    appWindow.contentWindow.updateUI();
  });
}

/******************************************************************************/

// TODO: add support for chrome.runtime.onStartup.addListener
(function main() {
  onIncomingGcmMessageCallbacks.push(handleIncomingGcmMessage);

  connectGcm(function(regid) {
    console.log('Successfully Registered with GCM server')
    identifySelfEh(MY_DEFAULT_DISPLAY_NAME);
  });
}());
