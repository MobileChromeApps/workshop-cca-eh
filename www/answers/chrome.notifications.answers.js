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
}

/******************************************************************************/
