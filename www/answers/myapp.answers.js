'use strict';

/******************************************************************************/

var MY_DISPLAY_NAME = 'Anonymous Coward';

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

function identifySelfEh(displayName, callback) {
  sendGcmMessage({
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
  createLocalNotification(from_userid, {
    type:'basic',
    title:'Eh',
    message: userlist[from_userid].name + ' x' + userlist[from_userid].inboundEhCount
  });
  play("assets/sounds/ASDIC.wav");

  updateUI();
}

function sendEh(userid, callback) {
  userlist[userid].outboundEhCount++;
  userlist[userid].isCurrentlySendingMessageEh = true;
  updateUI();

  sendGcmMessage({
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

/******************************************************************************/
/******************************************************************************/

//chrome.runtime.onStartup.addListener(function() {
document.addEventListener('DOMContentLoaded', function() {
  connectGcm(function(regid) {
    console.log('Successfully Registered with reg_id:', regid)
    identifySelfEh(MY_DISPLAY_NAME);
  });
});

/******************************************************************************/
