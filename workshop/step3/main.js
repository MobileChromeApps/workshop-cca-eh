function dialURL(token, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';

  xhr.onload = function(e) {
    if (this.status == 200) {
      callback(this.response);
    } else {
      console.error('request', url, 'failed', xhr.status);
    }
  };

  xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  xhr.send();
}

function attemptLogin() {
  chrome.identity.getAuthToken({
    interactive: true
  }, function(token, account) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    console.info('chosen account', account, token);

    // Successfully obtained token from Chrome Identity, use to get user profile.
    dialURL(token, 'https://www.googleapis.com/oauth2/v3/userinfo', function(response) {
      var name = response.name
          || (response.given_name + ' ' + response.family_name)
          || account.replace(/\@.*/, '');
      console.info('user identified as', name, 'from', response);
      // Identified OK: we'll add callback here later [3].
      window.opener.identifySelfEh(name);
      setAppTitle("It's " + name + ", eh");
    });
  });
}

function setAppTitle(title) {
  var toolbar = document.querySelector('core-toolbar h3');
  while (toolbar.firstChild) {
    toolbar.removeChild(toolbar.firstChild);
  }
  var titleNode = document.createTextNode(title);
  toolbar.appendChild(titleNode);
}

function updateUI(allUsers) {
  var contacts = Object.keys(allUsers).map(function(userid) { return allUsers[userid]; });
  console.info('updateUI got', contacts.length, 'users');
  document.getElementById('contacts').contacts = contacts;
}

window.addEventListener('polymer-ready', function(e) {
  attemptLogin();
});
