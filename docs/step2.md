## Step 2: Google Cloud Messaging

### Connect to GCM

Let's connect to the Eh server using the [chrome.gcm APIs](https://developer.chrome.com/apps/cloudMessaging).  Note: For this workshop, you may use our pre-existing server, which saves you some management hassle.  Fear not, however, as we will discuss how you can run your own server at the end, and all the server code is provided.

#### Permissions

First, the application manifest (`manifest.json`) needs to be updated with new permissions. Add the string "`gcm`" to the list:

    "permissions": [
      ...
      "gcm",
      ...
    ],

#### Code

At the bottom of `background.js`, add this boilerplate block:

    // The GCM_SENDERID is a magic number you get from your application API console.
    // For this workshop, feel free to use these values to access our existing server.
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

Additionaly, inside `manifest.json`, we need to specify both the application "key", and the API "scopes" we'd like to request:

    "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgz1mTPskjtGVirMpr858hRWdaZPpVkcxX6oCIYbOxkYW2GF4hW6Wc6zwasTl+l2yY61qTEEj9VIgrZLYIlFmDNJDpQ5KXeoPpOpfqflSI9GXRw6Eolj3puEVgU2dH5naAxJTHBudAdOLAxdkhiAElNaLxZ3VnccXc6GokuuKhCsTdjAi6dwuCxEteIgyb1H4t/FHe0v42FugZvEqg2xUVZRQHIlgKx1frVPtJdwTuGsuFKA97ItOYbZ7W9vO/tTKqtHqO6sS2BVFBzh0ElpjxFHuUtn5qggB/UMeNAgrvOfwTicpjXcJOU3mUgoVWhkiHPh8fW9tOBpCD8hPASdWXQIDAQAB",

    "oauth2": {
      "client_id": "197187574279-0vp4o4vg2ra448hlotnq0b3md981r7em.apps.googleusercontent.com",
      "scopes": [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gcm_for_chrome",
        "https://www.googleapis.com/auth/gcm_for_chrome.readonly"
      ]
    },

Notes:
* `"key"` is only required for local development.  When you ship your app to the store, it isn't needed.
_Keen observers will note that the `client_id` contains our `GCM_SENDERID` from above. This is the ID of the workshop Developer Console project and provided Eh GCM endpoint. The key is included here, as your local Chrome extension ID won't properly match the workshop's project. This isn't necessary for apps you develop yourself._

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
