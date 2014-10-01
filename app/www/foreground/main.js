'use strict';

/******************************************************************************/

var DEFAULT_DISPLAY_NAME = 'Anonymous Coward';

/******************************************************************************/

var userlist = {};
var helpers = null;

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

function handleIncomingGcmMessage(msg) {
  if (typeof msg.data.type !== 'string') {
    console.error('Invalid message format:', JSON.stringify(msg, null, 2));
    return;
  }
  // TODO: move this out to helpers?
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
}


/******************************************************************************/

function identifySelfEh(displayName, callback) {
  helpers.sendGcmMessage({
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
  console.log(from_userid);
  userlist[from_userid].inboundEhCount++;
  helpers.createLocalNotification(from_userid, {
    type:'basic',
    title:'Eh',
    message: userlist[from_userid].name + ' x' + userlist[from_userid].inboundEhCount
  });
  play("/assets/sounds/ASDIC.wav");

  updateUI();
}

function sendEh(userid, callback) {
  userlist[userid].outboundEhCount++;
  userlist[userid].isCurrentlySendingMessageEh = true;
  updateUI();

  helpers.sendGcmMessage({
    'type': 'sendEh',
    'to_userid': userid
  }, function() {
    userlist[userid].isCurrentlySendingMessageEh = false;
    // Gcm call returns so fast, we introduce an artificial delay
    setTimeout(updateUI, 250);
  });
}

/******************************************************************************/

// TODO: Replace this with Polymer list data-binding
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

/******************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.getBackgroundPage(function(bgpage) {
    if (!bgpage)
      return; // TODO: chrome desktop calls this once with null.  bug?
    bgpage.onIncomingGcmMessageCallbacks.push(handleIncomingGcmMessage);
    helpers = bgpage;

    identifySelfEh(DEFAULT_DISPLAY_NAME);
  });
});

/******************************************************************************/
