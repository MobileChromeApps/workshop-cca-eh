## Step 2: Google Cloud Messaging

### Connect to GCM

Let's connect to the provided Eh server using the GCM APIs. These are (standard for Chrome apps or extensions)[https://developer.chrome.com/apps/cloudMessaging], and require signed-in Chrome users.

First, the application manifest `manifest.json` needs to be updated with new permissions. Add a brand new permissions section in above `"app": {`-

    "permissions": [
      "gcm",
      "identity",
      "<all_urls>"
    ],

We'll use `identity` later, and we'll need to request Google's authentication URLs.

At the bottom of `background.js`, add this boilerplate block-

    var GCM_SENDERID = '197187574279';
    var GCM_SENDER = GCM_SENDERID + '@gcm.googleapis.com';

    (function main() {
      var errorLogger = function() {
        console.error.apply(console, arguments);
      };
      chrome.gcm.onSendError.addListener(errorLogger);
      chrome.gcm.onMessagesDeleted.addListener(errorLogger);

      chrome.gcm.onMessage.addListener(function(msg) {
        console.info('got GCM message', msg);
        // Incoming GCM data: we'll add callback here later [1].
      });

      chrome.gcm.register([GCM_SENDERID], function(regid) {
        if (chrome.runtime.lastError || regid === -1) {
          console.error(chrome.runtime.lastError);
          return;
        }
        console.info('GCM connect success, reg', regid);
        // Connected OK: we'll add callback here later [2].
      });
    }());

This code will connect to GCM, listen for incoming messages, and log any errors.
If you run your application now, you should see a few logging messages inside the (background page's console)[http://stackoverflow.com/a/10082021/1099216] - hopefully including `GCM connect success, reg __regID__`.

If you have trouble, make sure you've correctly added permissions and restarted your app via CDE or the `cca`.
_Also, you must be signed in via Chrome or yor mobile device for GCM to correctly register._

### Identity

While not strictly part of GCM, let's use Google's (identity APIs)[https://developer.chrome.com/apps/identity] to authenticate and get the signed-in user's name so they can be properly identified inside Eh.

#### Scopes

Firstly, inside `manifest.json`, we need to let Chrome know the default scopes we'd like to request. Add this key and our `oauth2` scopes below the `permissions` block-

    "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgz1mTPskjtGVirMpr858hRWdaZPpVkcxX6oCIYbOxkYW2GF4hW6Wc6zwasTl+l2yY61qTEEj9VIgrZLYIlFmDNJDpQ5KXeoPpOpfqflSI9GXRw6Eolj3puEVgU2dH5naAxJTHBudAdOLAxdkhiAElNaLxZ3VnccXc6GokuuKhCsTdjAi6dwuCxEteIgyb1H4t/FHe0v42FugZvEqg2xUVZRQHIlgKx1frVPtJdwTuGsuFKA97ItOYbZ7W9vO/tTKqtHqO6sS2BVFBzh0ElpjxFHuUtn5qggB/UMeNAgrvOfwTicpjXcJOU3mUgoVWhkiHPh8fW9tOBpCD8hPASdWXQIDAQAB",

    "oauth2": {
      "client_id": "197187574279-0vp4o4vg2ra448hlotnq0b3md981r7em.apps.googleusercontent.com",
      "scopes": [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gcm_for_chrome",
        "https://www.googleapis.com/auth/gcm_for_chrome.readonly"
      ]
    },

_Keen observers will note that the `client_id` contains our `GCM_SENDERID` from above. This is the ID of the workshop Developer Console project and provided Eh GCM endpoint._ The key is included as your local Chrome extension ID won't properly match the workshop's project.

#### Idenity and user info

The identity flow needs to be interactive, as Chrome or your mobile device will prompt you for your user detail.
The code therefore needs to be inside `main.js`, which is run by the foreground page
Inside the `ready` listener, add a method call-

    window.addEventListener('polymer-ready', function(e) {
      attemptLogin();
    });

Above the `ready` listener, let's add a helper to make HTTP requests, using XMLHTTPRequest (level 2)-

    function dialURL(token, url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', endpoint, true);
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

And finally, let's add the `attemptLogin()` method itself-

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

Again, let's run this sample. If all goes well, your Chrome console should look something like-

![Preview](https://github.com/MobileChromeApps/workshop-cca-eh/raw/master/docs/assets/step2-console.png)

### Next up

The code for this step is in [step2](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/step2).

_**Continue to [Step 3: Contacts &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step3.md)**_