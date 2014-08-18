'use strict';

function testGcm() {
  var testTimeout = 2000;
  var senderid = '90031296475';
  var sender = senderid+ "@gcm.googleapis.com";

  /*
  chrome.gcm.send
  chrome.gcm.register
  chrome.gcm.unregister
  chrome.gcm.onMessage
  chrome.gcm.onSendError
  chrome.gcm.onMessagesDeleted
  */

  var listener = function(msg) {
    console.log(msg);
  }

  chrome.gcm.register([senderid], function(regid) {
    console.log(regid);
    //chrome.runtime.lastError
    //chrome.gcm.unregister(function() {
      //chrome.runtime.lastError
    //});
    chrome.gcm.onMessage.addListener(listener);
    //chrome.gcm.onMessage.removeListener(listener);

    var message = {
      'destinationId' : sender,
      'messageId' : '0',
      'timeToLive' : 10,
      'data' : { 'test' : 'test' }
    };

    try {
      chrome.gcm.send(message, function(msgid) {
        console.log(msgid);
        //chrome.runtime.lastError
      });
    } catch (e) {
      console.error(e);
    }
  });
};
