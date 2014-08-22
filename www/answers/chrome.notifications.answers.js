'use strict';

/******************************************************************************/

chrome.notifications.onClosed.addListener(function(notificationId) {
  console.log('onClosed fired. notificationId =', notificationId);
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  console.log('onClicked fired. notificationId =', notificationId);

  chrome.notifications.clear(notificationId, function(wasCleared) {
  });
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  console.log('onButtonClicked fired. notificationId =', notificationId, ', buttonIndex =', buttonIndex);
});

/******************************************************************************/

function createLocalNotification(notificationId, options, callback) {
  options.iconUrl = options.iconUrl || '';
  options.message = options.message || 'Eh';
  callback = callback || function() {}
  chrome.notifications.create(notificationId, options, callback);
  play("assets/sounds/ASDIC.wav");
}

/******************************************************************************/

function play(url) {
  var request = new XMLHttpRequest();

  request.open('GET', url, true)
  request.responseType = "arraybuffer"

  request.onload = function() {
    var audioCtx = new window.AudioContext;
    audioCtx.decodeAudioData(request.response, function(buffer) {
      var source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.loop = false;
      source.start(0);
    }, function(e) {
      console.log("Error decoding audio data" + e.err)
    });
  }

  request.send()
}
