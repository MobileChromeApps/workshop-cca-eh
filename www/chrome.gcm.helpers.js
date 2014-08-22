'use strict';

/******************************************************************************/

var GCM_SENDERID = '90031296475';
var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

/******************************************************************************/

function sendGcmMessage(data, callback) {
  var message = {
    'destinationId' : GCM_SENDER,
    'messageId' : String(Math.random()),
    'timeToLive' : 10,
    'data' : data
  };

  chrome.gcm.send(message, function(msgid) {
    if (msgid === -1) {
      console.error(chrome.runtime.lastError);
      //return;
    }
    if (typeof callback !== 'function')
      return;
    callback(msgid);
  });
}

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
