/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
function createUiWindow() {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 800, height: 600}
    }
  );
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  createUiWindow();
});

var GCM_SENDERID = '197187574279';
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

function sendEh(userid, callback) {
  allUsers[userid].outboundEhCount++;
  allUsers[userid].isCurrentlySendingMessageEh = true;

  sendGcmMessage({
    'type': 'sendEh',
    'to_userid': userid
  }, function() {
    allUsers[userid].isCurrentlySendingMessageEh = false;
    callback();
  });
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

function onIncomingEh(from_userid) {
  var profile = allUsers[from_userid];
  if (!profile) {
    console.warn('no profile for Eh-sender', from_userid);
    return;
  }
  console.log('received Eh from', from_userid);
  profile.inboundEhCount++;

  // Incoming Eh: we'll update the notification here later [4].
      play('assets/sounds/jake.wav');
  var options = {
    type: 'basic',
    title: 'Eh',
    iconUrl: '/assets/icons/icon128.png',
    message: profile.name + ' x' + profile.inboundEhCount
  };
  chrome.notifications.create(from_userid, options, function() {});

  chrome.notifications.onClicked.addListener(function(id) {
    var windows = chrome.app.window.getAll();
    if (windows) {
      windows[0].restore();
    } else {
      createUiWindow();
    }
    chrome.notifications.clear(id, function() {});
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
      case 'incomingEh': {
        onIncomingEh(msg.data.from_userid);
        break;
      }
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
  });
}());

    var audioCtx = new window.AudioContext;
    function play(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        audioCtx.decodeAudioData(request.response, function(buffer) {
          var source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.start(0);
        }, function(e) {
          console.log('Error decoding audio', e);
        });
      }

      request.send();
    }

