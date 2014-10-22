'use strict';

/******************************************************************************/

var GCM_SENDERID = '197187574279';
var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

/******************************************************************************/

function connectGcm(callback) {
  chrome.gcm.register([GCM_SENDERID], function(regid) {
    if (regid === -1) {
      console.error(chrome.runtime.lastError);
      return;
    }
    if (typeof callback === 'function') {
      callback(regid);
    }
  });
}

/******************************************************************************/

function sendGcmMessage(data, callback) {
  var message = {
    'destinationId' : GCM_SENDER,
    'messageId' : String(Math.random()), // TODO: instead of random can we just leave this off?
    'timeToLive' : 10, // TODO: optional?
    'data' : data
  };

  chrome.gcm.send(message, function(msgid) {
    if (msgid === -1) {
      console.error(chrome.runtime.lastError);
    }
    if (typeof callback !== 'function')
      return;
    callback(msgid);
  });
}

/******************************************************************************/

// TODO: why doesn't javascript have a pub/sub EventEmitter, bah
var onIncomingGcmMessageCallbacks = []
function handleIncomingGcmMessage(msg) {
  onIncomingGcmMessageCallbacks.forEach(function(callback) {
    callback(msg);
  });
}

/******************************************************************************/

function createLocalNotification(notificationId, options, callback) {
  options = options || {};
  options.iconUrl = options.iconUrl || '/common/assets/icons/icon128.png';
  options.message = options.message || 'Eh';
  callback = callback || function() {}
  chrome.notifications.create(notificationId, options, callback);
}

/******************************************************************************/

