'use strict';

/******************************************************************************/

function updateUI() {
  var userlist = window.opener.userlist;
  var contacts = Object.keys(userlist).map(function(userid) {
    return {
      name: userlist[userid].isCurrentlySendingMessageEh ? '...' : userlist[userid].name
    };
  });
  document.getElementById('contacts').contacts = contacts;
}

function main() {
  updateUI();
}

/******************************************************************************/

//document.addEventListener('DOMContentLoaded', function() {
window.addEventListener('polymer-ready', function(e) {
  main();
});

/******************************************************************************/
