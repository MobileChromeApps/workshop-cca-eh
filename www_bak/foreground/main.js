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

function attemptLogin() {
  function hitEndpoint(token, endpoint, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(JSON.parse(xhr.responseText));
        } else {
          console.error('Failed with status ' + xhr.status + '.');
        }
      }
    };
    xhr.open('GET', endpoint);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.send(null);
  };

  var opts = {
    interactive: true,
    //accountHint: 'cordovium1@gmail.com'  // mobile only, if cached account only
  };

  chrome.identity.getAuthToken(opts, function(token, account) {
    //console.log(token, account);

    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    hitEndpoint(token, 'https://www.googleapis.com/oauth2/v3/userinfo', function(response) {
      /*
        {
          "sub": "106555950828035514001",
          "name": "Michal Mocny",
          "given_name": "Michal",
          "family_name": "Mocny",
          "profile": "https://plus.google.com/+MichalMocny",
          "picture": "https://lh5.googleusercontent.com/-RNQzA-cLvqk/AAAAAAAAAAI/AAAAAAAADC4/ePw3ie0F5CU/photo.jpg",
          "gender": "male",
          "locale": "en"
        }
      */
      var name = response.name || (response.given_name + ' ' + response.family_name) || account.replace(/\@.*/, '');
      console.log(name);
      if (!name) return;
      window.opener.identifySelfEh(name);
    });
  });
}

/******************************************************************************/

function main() {
  attemptLogin();
  updateUI();
}

/******************************************************************************/

//document.addEventListener('DOMContentLoaded', function() {
window.addEventListener('polymer-ready', function(e) {
  main();
});

/******************************************************************************/
