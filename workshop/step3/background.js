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

var allUsers = {};

function onUserListChangeEh(users) {
  var update = {};

  users.forEach(function(user) {
    var userid = user[0];
    var username = user[1];

    // Create a profile if this user wasn't already known.
    var profile = allUsers[userid];
    if (!profile) {
      profile = {
        userid: userid,
        inboundEhCount: 0,
        outboundEhCount: 0,
        isCurrentlySendingMessageEh: false
      };
    }
    profile.name = username;
    update[userid] = profile;
  });

  allUsers = update;
  updateUIs();
}

function sendGcmMessage(data, callback) {
  chrome.gcm.send({
    'destinationId': GCM_SENDER,
    'messageId': String(Math.random()),  // should be globally unique, fine for now
    'data': data
  }, function(msgid) {
    if (chrome.runtime.lastError || msgid === -1) {
      console.error(chrome.runtime.lastError);
      return;
    }
    console.debug('GCM message sent OK', data);
    if (callback) {
      callback(msgid);
    }
  });
}

function identifySelfEh(displayName) {
  sendGcmMessage({
    'type': 'identifySelfEh',
    'name': displayName
  });
}

function updateUIs() {
  chrome.app.window.getAll().forEach(function(appWindow) {
    appWindow.contentWindow.updateUI(allUsers);
  });
}

(function main() {
  var errorLogger = function() {
    console.error.apply(console, arguments);
  };
  chrome.gcm.onSendError.addListener(errorLogger);
  chrome.gcm.onMessagesDeleted.addListener(errorLogger);

  chrome.gcm.onMessage.addListener(function(msg) {
    console.info('got GCM message', msg);
    // Incoming GCM data: we'll add callback here later [1].

    switch(msg.data.type) {
      case 'userListChangeEh': {
        onUserListChangeEh(JSON.parse(msg.data.users));
        break;
      }
      default: {
        console.warn('Unhandled message', msg);
        return;
      }
    }
  });

  chrome.gcm.register([GCM_SENDERID], function(regid) {
    if (chrome.runtime.lastError || regid === -1) {
      console.error(chrome.runtime.lastError);
      return;
    }
    console.info('GCM connect success, reg', regid);
    // Connected OK: we'll add callback here later [2].
    identifySelfEh('Anonymous Coward');
  });
}());
