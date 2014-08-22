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
  if (!('iconUrl' in options)) {
    options.iconUrl = 'assets/inbox-64x64.png';
  }
  options.message = options.message || 'Eh';
  chrome.notifications.create(notificationId, options, callback || function() {});
}

/******************************************************************************/
