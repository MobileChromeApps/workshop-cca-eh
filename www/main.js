'use strict';

/******************************************************************************/

var GCM_SENDERID = '90031296475';
var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

/******************************************************************************/

var userlist = {};

/******************************************************************************/

function pruneUsersNotInList(userids) {
  Object.keys(userlist).forEach(function(userid) {
    if (userids.indexOf(userid) == -1) {
      delete userids[userid];
    }
  });
}

function addOrUpdateUser(userid, name) {
  if (!(userid in userlist)) {
    userlist[userid] = {
      name: name,
      inboundEhCount: 0,
      outboundEhCount: 0,
      isCurrentlySendingMessageEh: false
    };
  } else {
    userlist[userid].name = name;
  }
}

/******************************************************************************/

//chrome.runtime.onStartup.addListener(function() {
document.addEventListener('DOMContentLoaded', function() {
  connectGcm(function(regid) {
    console.log('Successfully Registered with reg_id:', regid)
    identifySelfEh('Other Michal');
  });
});

/******************************************************************************/

function sendMessage(data, callback) {
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

chrome.gcm.onMessage.addListener(function(msg) {
  if (typeof msg.data.type !== 'string') {
    console.error('Invalid message format:', JSON.stringify(msg, null, 2));
    return;
  }

  switch(msg.data.type) {
    case 'userListChangeEh': {
      onUserListChangeEh(JSON.parse(msg.data.users));
      break;
    };
    case 'incomingEh': {
      onIncomingEh(msg.data.from_userid);
      break;
    };
    default: {
      console.error('Invalid message type:', JSON.stringify(msg, null, 2));
      return;
    }
  }
});

/******************************************************************************/

chrome.gcm.onSendError.addListener(function() {
  console.error.apply(console, arguments);
});

chrome.gcm.onMessagesDeleted.addListener(function() {
  console.error.apply(console, arguments);
});

/******************************************************************************/

chrome.notifications.onClosed.addListener(function(notificationId, byUser) {
  logger('onClosed fired. notificationId = ' + notificationId + ', byUser = ' + byUser);
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  logger('onClicked fired. notificationId = ' + notificationId);
  chrome.notifications.clear(notificationId, function(wasCleared) {});
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  logger('onButtonClicked fired. notificationId = ' + notificationId + ', buttonIndex = ' + buttonIndex);
});

/******************************************************************************/

function createNotification(notificationId, options, callback) {
  if (!('iconUrl' in options)) {
    options.iconUrl = 'assets/inbox-64x64.png';
  }
  options.message = options.message || 'Eh';
  chrome.notifications.create(notificationId, options, callback);
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

function identifySelfEh(displayName, callback) {
  sendMessage({
    'type': 'identifySelfEh',
    'name': displayName
  }, updateUI);
}

function onUserListChangeEh(userlist) {
  var userids = [];
  userlist.forEach(function(user) {
    var userid = user[0];
    var username = user[1];
    userids.push(userid);
    addOrUpdateUser(userid, username);
  });
  pruneUsersNotInList(userids);
  updateUI();
}

function onIncomingEh(from_userid) {
  userlist[from_userid].inboundEhCount++;
  createNotification(from_userid, {
    type:'basic',
    title:'Eh',
    message: userlist[from_userid].name + ' x' + userlist[from_userid].inboundEhCount
  });
  updateUI();
}

function sendEh(userid, callback) {
  userlist[userid].outboundEhCount++;
  userlist[userid].isCurrentlySendingMessageEh = true;
  updateUI();

  sendMessage({
    'type': 'sendEh',
    'to_userid': userid
  }, function() {
    userlist[userid].isCurrentlySendingMessageEh = false;
    // Gcm call returns so fast, we introduce an artificial delay
    setTimeout(updateUI, 250);
  });
}

/******************************************************************************/

function createBlock(text, onclick) {
  var div = document.createElement('div');
  div.innerText = text;
  div.onclick = onclick;
  document.body.appendChild(div);
  return div;
}

function updateUI() {
  document.body.innerHTML = "";

  if (Object.keys(userlist).length == 0) {
    var div = createBlock('Waiting for users');
  }

  Object.keys(userlist).forEach(function(userid) {
    var text = userlist[userid].isCurrentlySendingMessageEh ? '...' : userlist[userid].name;
    var div = createBlock(text, sendEh.bind(null, userid));
    div.classList.add('user');
  });
}
