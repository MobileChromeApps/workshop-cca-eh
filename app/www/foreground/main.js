'use strict';

/******************************************************************************/

var bg = null;

/******************************************************************************/

function updateUI() {
  var userlist = bg.userlist;
  if (Object.keys(userlist).length == 0) {
    userlist = {
      0: {
        name: "Foo",
        isCurrentlySendingMessageEh: false,
      },
      1: {
        name: "Bar",
        isCurrentlySendingMessageEh: false,
      },
    };
  }
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

document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.getBackgroundPage(function(bgpage) {
    // TODO: chrome desktop calls this once with null.  bug?
    if (!bgpage)
      return;
    bg = bgpage;
    //window.addEventListener('polymer-ready', function(e) {
      main();
    //});
  });
});

/******************************************************************************/
