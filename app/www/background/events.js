'use strict';

/******************************************************************************/

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('/foreground/index.html', {}, function(win) {
  });
});

/******************************************************************************/

chrome.gcm.onMessage.addListener(function(msg) {
  handleIncomingGcmMessage(msg);
});

chrome.gcm.onSendError.addListener(function() {
  console.error.apply(console, arguments);
});

chrome.gcm.onMessagesDeleted.addListener(function() {
  console.error.apply(console, arguments);
});

/******************************************************************************/

chrome.notifications.onClosed.addListener(function(notificationId) {
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.notifications.clear(notificationId, function(wasCleared) {
  });
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
});

/******************************************************************************/

