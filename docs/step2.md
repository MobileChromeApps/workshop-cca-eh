## Step 2: Google Cloud Messaging

### Setting up a Server

#### Google Developers Console

The place to activate APIs and generate the appropriate IDs and keys is the [Google Developers Console](https://console.developers.google.com).

The instructions for activating GCM can be found [here](https://developer.android.com/google/gcm/gs.html); the instructions for identity are [here](https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-identity).

Once complete, you should have:
1. Created a new Project in the console (The "`Project Number`" is your GCM "`Sender ID`")
2. Created an "API Key" for Android (The "`API Key`" is your GCM password)
3. Created a "Client ID" for Android (Required for `chrome.identity`)
4. Enabled the "GCM for Android" API

Your Andorid Package ID is the `packageId` listed in `www/manifest.mobile.json`

To get the SHA1 of your debug keystore:

    cca exec keytool -list -v -keystore $HOME/.android/debug.keystore -storepass android

For Windows:

    cca exec keytool -list -v -keystore %USERPROFILE%/.android/debug.keystore -storepass android

#### Running a Server

Put your APK Key and Sender ID (Project Number) into `gcmServer/gcm_auth_info.json`

Start the server:

    python gcmServer/python/server.py

### Connect to GCM

Let's connect to the Eh server using the [chrome.gcm APIs](https://developer.chrome.com/apps/cloudMessaging).

#### Permissions

First, the application manifest (`manifest.json`) needs to be updated with new permissions. Add the string "`gcm`" to the list:

    "permissions": [
      ...
      "gcm",
      ...
    ],

#### Code

At the bottom of `background.js`, add this boilerplate block:

    // The GCM_SENDERID is the project number you get from your application API console.
    var GCM_SENDERID = '197187574279';
    var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

    // We don't expect errors, but let's be good citizens and register error handlers
    var errorLogger = function() {
      console.error.apply(console, arguments);
    };
    chrome.gcm.onSendError.addListener(errorLogger);
    chrome.gcm.onMessagesDeleted.addListener(errorLogger);


    // This event handles incoming messages
    chrome.gcm.onMessage.addListener(function(msg) {
      // Who says comments don't get read?
      console.info('got GCM message', msg);

      // Incoming GCM data: we'll add callback here later [1].

    });


    // First things first, register with the GCM server at application start.
    chrome.gcm.register([GCM_SENDERID], function(regid) {
      if (chrome.runtime.lastError || regid === -1) {
        console.error(chrome.runtime.lastError);
        return;
      }
      console.info('GCM connect success, reg', regid);

      // Connected OK: we'll add callback here later [2].

    });

This code will connect to GCM, listen for incoming messages, and log any errors.
If you run your application now, you should see a few logging messages inside the [background page's console](http://stackoverflow.com/a/10082021/1099216) - hopefully including `GCM connect success, reg __regID__`.


### Identity

Lets use another cool API, [chrome.identity](https://developer.chrome.com/apps/identity), to ask for permission to automatically get the signed-in user's name.

#### Permissions

First, the application manifest (`manifest.json`) needs to be updated with new permissions.  Add `identity` to the list:

    "permissions": [
      ...
      "identity",
      ...
    ],

#### Scopes

Additionaly, inside `manifest.json`, we need to specify the API "scopes" we'd like to request:

    "oauth2": {
      "scopes": [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gcm_for_chrome",
        "https://www.googleapis.com/auth/gcm_for_chrome.readonly"
      ]
    },

Notes:
* To have this work as a Desktop Chrome App, you'll also need to specify a `client_id` and `key`. Refer to notes in the [identity plugin](https://github.com/MobileChromeApps/cordova-plugin-chrome-apps-identity).

#### Code

The identity flow needs to be interactive, as Chrome or your mobile device will prompt you for your user detail.
The code therefore needs to be inside `main.js`, which is run by the foreground page.
Inside the `ready` listener, add a method call:

    window.addEventListener('polymer-ready', function(e) {
      attemptLogin(); // add this line
      // ...
    });

Above the `ready` listener, let's add a helper to make HTTP requests, using XMLHttpRequest (level 2):

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

And finally, let's add the `attemptLogin()` method itself:

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
        });
      });
    }

Again, let's run this sample. If all goes well, your Chrome console should look something like:

![Preview](https://github.com/MobileChromeApps/workshop-cca-eh/raw/master/docs/assets/step2-console.png)

If you run this on your Android device, you'll see an authorization prompt:

![Auth](https://github.com/MobileChromeApps/workshop-cca-eh/raw/master/docs/assets/step2-auth.png)


Once we have the user's identity coming back from the service, we should update the UI! Add this line to
the `attemptLogin()` method, to announce the user's name:

    // Identified OK: we'll add callback here later [3].
    setAppTitle("It's " + name + ", eh");

And add the `setAppTitle()` method below it:

    function setAppTitle(title) {
      var toolbar = document.querySelector('core-toolbar h3');
      while (toolbar.firstChild) {
        toolbar.removeChild(toolbar.firstChild);
      }
      var titleNode = document.createTextNode(title);
      toolbar.appendChild(titleNode);
    }


### Next Up...

The code for this step is in [step2](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/step2).

_**Continue to [Step 3: Contacts &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step3.md)**_
