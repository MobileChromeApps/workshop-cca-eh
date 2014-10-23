## Step 3: Contacts

### The Userlist

Now that you've authorized and connected to GCM, let's find out who else is using Eh. This includes those who have just started up the 'final' version of our app.

When your client connects to GCM, or when any new clients connect, the Eh backend will send down a `userListChangeEh` message with the entire new list of online users. Let's listen for this inside `background.js`:

        // Incoming GCM data: we'll add callback here later [1].
        switch(msg.data.type) {
          case 'userListChangeEh': {
            onUserListChangeEh(JSON.parse(msg.data.users));
            break;
          }
          default: {
            console.warn('Unhandled message', msg);
            return;
          }
        }

Now, the `onUserListChangeEh` method needs to be added. This will just refresh a global variable, `allUsers`, which lives on the background page. Add this block avove our `main()` method:

    var allUsers = {};

    function onUserListChangeEh(users) {
      var update = {};

      users.forEach(function(user) {
        var userid = user[0];
        var username = user[1];

        // Create a profile if this user wasn't already known.
        var profile = allUsers[userid];
        if (!profile) {
          profile = {
            userid: userid,
            inboundEhCount: 0,
            outboundEhCount: 0,
            isCurrentlySendingMessageEh: false
          };
        }
        profile.name = username;
        update[userid] = profile;
      });

      allUsers = update;
      updateUIs();
    }

### Update UI

The above snippet calls `updateUIs()`, which we haven't defined yet. We need to hint to all visible windows - which on mobile, will just be a single window; on Desktop, it may be many - that the userlist has changed.

Let's add this method, again in `background.js`:

    function updateUIs() {
      chrome.app.window.getAll().forEach(function(appWindow) {
        appWindow.contentWindow.updateUI(allUsers);
      });
    }

Then open `main.js` and define the `updateUI()` method:

    function updateUI(allUsers) {
      var contacts = Object.keys(allUsers).map(function(userid) { return allUsers[userid]; });
      console.info('updateUI got', contacts.length, 'users');
      document.getElementById('contacts').contacts = contacts;
    }

This will pass an `Array` of users to the custom Polymer element that renders contacts.

_You might also want to remove or comment out the test code that added some contacts. These will be quickly replaced with real contacts, but you don't want your users to be confused._

    // var contacts = [
    //    { name: "Loonie" },
    //    { name: "Toonie" }
    // ];
    // document.getElementById('contacts').contacts = contacts;

If you run now, you might see some peers - but only those who have already completed the next step or who are running the final version of Eh. There's one more step in our way.

### Who Goes There, Eh?

Our client needs to identify itself to the server, on startup and when we get the user's display name. Inside `background.js`, we want to call our identify method:

    // Connected OK: we'll add callback here later [2].
    identifySelfEh('Anonymous Coward');

And we need to define it - plus the actual GCM sender, which needs to do slightly more than just fire the message and forget. Add this within the same file:

    function sendGcmMessage(data, callback) {
      chrome.gcm.send({
        'destinationId': GCM_SENDER,
        'messageId': String(Math.random()),  // should be globally unique, fine for now
        'data': data
      }, function(msgid) {
        if (chrome.runtime.lastError || msgid === -1) {
          console.error(chrome.runtime.lastError);
          return;
        }
        console.debug('GCM message sent OK', data);
        if (callback) {
          callback(msgid);
        }
      });
    }

    function identifySelfEh(displayName) {
      sendGcmMessage({
        'type': 'identifySelfEh',
        'name': displayName
      });
    }

Finally, inside `main.js` - the code for our foreground page - make sure we also call the identify method with our updated name:

          // Identified OK: we'll add callback here later [3].
          window.opener.identifySelfEh(name);

Run the app again, and make sure you inspect the console of the background page: you'll hopefully see successful message send information.

### Next Up...

The code for this step is in [step3](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/step3).

_**Continue to [Step 4: Eh, for sure &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step4.md)**_
