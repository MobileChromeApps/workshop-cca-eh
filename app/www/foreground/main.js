'use strict';

/******************************************************************************/

function updateUI() {
  var userlist = window.opener.userlist;
  var contacts = Object.keys(userlist).map(function(userid) { return userlist[userid]; });
  document.getElementById('contacts').contacts = contacts;
}

function sendEhTo(contactInfo) {
  console.log('start sending eh to', contactInfo.userid);
  window.opener.sendEh(contactInfo.userid, function() {
    console.log('finish sending eh to', contactInfo.userid);
    setTimeout(updateUI, 500);
  });
  updateUI();
}

/******************************************************************************/

function main() {
  updateUI();
}

/******************************************************************************/

//document.addEventListener('DOMContentLoaded', function() {
window.addEventListener('polymer-ready', function(e) {
  main();
});

/******************************************************************************/
