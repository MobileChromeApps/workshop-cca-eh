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
  if (!userid in userlist) {
    userlist[userid] = {
      name: name,
      inboundEhCount: 0,
      outboundEhCount: 0,
    };
  } else {
    userlist[user].name = name;
  }
}

function increaseInboundEhCount(userid) {
  userlist[userid].increaseInboundEhCount++;
}

function increaseOutboundEhCount(userid) {
  userlist[userid].outboundEhCount++;
}

/******************************************************************************/

chrome.runtime.onStartup.addListener(function() {
  connectGcm();
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

function connectGcm() {
  chrome.gcm.register([GCM_SENDERID], function(regid) {
    if (regid === -1) {
      console.error(chrome.runtime.lastError);
      return;
    }
  });
  console.log('Successfully Registered with reg_id:', regid)
}

/******************************************************************************/

function identifySelfEh(displayName, callback) {
  sendMessage({
    'type': 'identifySelfEh',
    'name': displayName
  }, callback);
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
}

function onIncomingEh(from_userid) {
  increaseInboundEhCount(from_userid);
}

function sendEh(userid, callback) {
  increaseOutboundEhCount(userid);
  sendMessage({
    'type': 'sendEh',
    'to_userid': userid
  }, callback);
}

/******************************************************************************/

