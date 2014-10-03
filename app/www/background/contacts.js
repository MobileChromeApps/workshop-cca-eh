'use strict';

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

function updateUserList(userlist) {
  var userids = [];
  userlist.forEach(function(user) {
    var userid = user[0];
    var username = user[1];
    userids.push(userid);
    addOrUpdateUser(userid, username);
  });
  pruneUsersNotInList(userids);
}

/******************************************************************************/
/******************************************************************************/
