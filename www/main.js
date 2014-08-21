'use strict';

/******************************************************************************/

var GCM_SENDERID = '90031296475';
var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

/******************************************************************************/

chrome.runtime.onStartup.addListener(function() {
  connectGcm();
});

chrome.gcm.onMessage.addListener(function(msg) {
  console.log(JSON.stringify(msg.data, null, 2));
});

chrome.gcm.onSendError.addListener(function() {
  console.error.apply(console, arguments);
});

chrome.gcm.onMessagesDeleted.addListener(function() {
  console.error.apply(console, arguments);
});

/******************************************************************************/

function sendMessage(data, success) {
  var message = {
    'destinationId' : GCM_SENDER,
    'messageId' : String(Math.random()),
    'timeToLive' : 10,
    'data' : data
  };

  try {
    chrome.gcm.send(message, function(msgid) {
      if (msgid === -1) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (typeof success !== 'function')
        return;
      success(msgid);
    });
  } catch (e) {
    console.error(e);
  }
}

/******************************************************************************/

function connectGcm() {
  chrome.gcm.register([GCM_SENDERID], function(regid) {
    if (regid === -1) {
      console.error(chrome.runtime.lastError);
      return;
    }

    sendMessage({ 'registration_id': regid });

  });
}

/******************************************************************************/

function testGcm() {
  sendMessage({'test': 'test'});
}

function identifySelfEh(displayName, callback) {
  sendMessage({'type': 'identifySelfEh', 'name': 'Michal'}, callback);
}

function onUserListChangeEh(callback) {
}

function onIncomingMessageEh(callback) {
}

function sendEh(userid, callback) {
  sendMessage({'type': 'sendEh', 'to': userid}, callback);
}

