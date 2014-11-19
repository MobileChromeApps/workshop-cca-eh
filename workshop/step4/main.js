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

function getAuth(callback) {
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
      callback(name);
    });
  });
}

function attemptLogin() {
  chrome.storage.local.get(function(values) {
    var name = values['displayName'];
    if (name) {
      console.log('Retreived display name from storage: ' + name);
      window.opener.identifySelfEh(name);
      setAppTitle("It's " + name + ", eh");
    } else {
      getAuth(function(name) {
        chrome.storage.local.set({ 'displayName': name });
        // Identified OK: we'll add callback here later [3].
        window.opener.identifySelfEh(name);
        setAppTitle("It's " + name + ", eh");
      });
    }
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
  contacts.sort(function(a, b) { return b.lastEhTime - a.lastEhTime; });
  document.getElementById('contacts').contacts = contacts;
}

function sendEhTo(contactInfo) {
  console.info('start sending eh to', contactInfo.userid);
  window.opener.sendEh(contactInfo.userid, function() {
    console.info('finish sending eh to', contactInfo.userid);
  });
}

window.addEventListener('polymer-ready', function(e) {
  updateUI(window.opener.allUsers);
  attemptLogin();
});
