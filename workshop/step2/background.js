/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 800, height: 600}
    }
  );
});

var GCM_SENDERID = 'YOUR_SENDER_ID';
var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

(function main() {
  var errorLogger = function() {
    console.error.apply(console, arguments);
  };
  chrome.gcm.onSendError.addListener(errorLogger);
  chrome.gcm.onMessagesDeleted.addListener(errorLogger);

  chrome.gcm.onMessage.addListener(function(msg) {
    console.info('got GCM message', msg);
    // Incoming GCM data: we'll add callback here later [1].
  });

  chrome.gcm.register([GCM_SENDERID], function(regid) {
    if (chrome.runtime.lastError || regid === -1) {
      console.error(chrome.runtime.lastError);
      return;
    }
    console.info('GCM connect success, reg', regid);
    // Connected OK: we'll add callback here later [2].
  });
}());
