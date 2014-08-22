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
    };
  } else {
    userlist[userid].name = name;
  }
}

function increaseInboundEhCount(userid) {
  userlist[userid].inboundEhCount++;
}

function increaseOutboundEhCount(userid) {
  userlist[userid].outboundEhCount++;
}

/******************************************************************************/

//chrome.runtime.onStartup.addListener(function() {
document.addEventListener('DOMContentLoaded', function() {
  connectGcm(function(regid) {
    console.log('Successfully Registered with reg_id:', regid)
    identifySelfEh('Michal');
  });
});

/******************************************************************************/

function sendMessage(data, success) {
  var message = {
    'destinationId' : GCM_SENDER,
    'messageId' : String(Math.random()),
    'timeToLive' : 10,
    'data' : data
  };

  try {
    chrome.gcm.send(message, function(msgid) {
      if (msgid === -1) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (typeof success !== 'function')
        return;
      success(msgid);
    });
  } catch (e) {
    console.error(e);
  }
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
    case 'sendEh': {
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

var numIds = 0;
function createNotification(options, callback) {
  var notificationId = 'id' + numIds;
  numIds++;
  if (!('iconUrl' in options)) {
    options.iconUrl = 'assets/inbox-64x64.png';
  }
  options.message = options.message || 'notificationId = ' + notificationId;
  chrome.notifications.create(notificationId, options, function(notificationId) {
    if (callback) callback(notificationId);
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
  increaseInboundEhCount(from_userid);
  createNotification({
    type:'basic',
    title:'Basic Notification',
    message: 'the quick slick thick brown fox jumps over the gosh darned lazy hazy brazy mazy dog.'
  });
  updateUI();
}

function sendEh(userid, callback) {
  increaseOutboundEhCount(userid);
  sendMessage({
    'type': 'sendEh',
    'to_userid': userid
  }, updateUI);
}

/******************************************************************************/

function updateUI() {
  document.body.innerHTML = "";
  Object.keys(userlist).forEach(function(userid) {
    var div = document.createElement('div');
    div.classList.add('user');
    div.innerText = userlist[userid].name;
    div.innerText += '[ <' + userlist[userid].inboundEhCount + ' ]';
    div.innerText += '[ >' + userlist[userid].outboundEhCount + ' ]';
    div.onclick = sendEh.bind(null, userid);
    document.body.appendChild(div);
  });
}
