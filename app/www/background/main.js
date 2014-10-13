'use strict';

/******************************************************************************/

var MY_DEFAULT_DISPLAY_NAME = 'Anonymous Coward';

/******************************************************************************/

function identifySelfEh(displayName, callback) {
  sendGcmMessage({
    'type': 'identifySelfEh',
    'name': displayName
  });
}

function onUserListChangeEh(userlist) {
  updateUserList(userlist);
  updateUIs();
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

  play("/assets/sounds/ASDIC.wav"); // TODO: replace this

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
