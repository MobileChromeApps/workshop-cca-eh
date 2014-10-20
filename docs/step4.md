## Step 4: Eh, for sure

### Sending an Eh

Ok, now you have a contact list. If you tap on an online contact, you'll actually see an error in your foreground page: the custom elements are configured to call a method called `sendEhTo`. Let's add that method inside `main.js`-

    function sendEhTo(contactInfo) {
      console.info('start sending eh to', contactInfo.userid);
      window.opener.sendEh(contactInfo.userid, function() {
        console.info('finish sending eh to', contactInfo.userid);
        // GCM call returns so fast, we introduce an artificial delay
        window.setTimeout(updateUI, 500);
      });
      updateUI();
    }

Most of the above code is logging and calling the `updateUI`` method. Our custom Polymer element is configured to visualize when we are sending an Eh.

The `sendEhTo` method needs `sendEh` on the background page, let's add it inside `background.js`-

    function sendEh(userid, callback) {
      allUsers[userid].outboundEhCount++;
      allUsers[userid].isCurrentlySendingMessageEh = true;

      sendGcmMessage({
        'type': 'sendEh',
        'to_userid': userid
      }, function() {
        allUsers[userid].isCurrentlySendingMessageEh = false;
        callback();
      });
    }

If you run the app, you should be able to Eh everyone using the app! However, we don't yet do anything 

### Recieving an Eh

If you were to recieve an Eh right now, your client will simply log a warning saying that the message recieved is unsupported. Let's fix that inside `background.js`, adding a new case to our `select` block near here-

        // Incoming GCM data: we'll add callback here later [1].
        ...
        switch(msg.data.type) {
          case 'incomingEh': {
            onIncomingEh(msg.data.from_userid);
            break;
          }
          ...

And add a top-level `onIncomingEh` function, which does something sensible and shows a short notification-

    function onIncomingEh(from_userid) {
      var profile = allUsers[from_userid];
      if (!profile) {
        console.warn('no profile for Eh-sender', from_userid);
        return;
      }
      console.log('received Eh from', from_userid);
      profile.inboundEhCount++;

      // Incoming Eh: we'll update the notification here later [4].
      var options = {
        type: 'basic',
        title: 'Eh',
        message: profile.name + ' x' + profile.inboundEhCount
      };
      chrome.notifications.create(from_userid, options, function() {});
    }

### Permissions

As the very last step, we actually have to enable the `notifications` permission inside `manifest.json`. Without this, you'll see a log but an error when we try to show a Desktop or mobile notification. Update the permissions section to look like this-

    "permissions": [
      "gcm",
      "identity",
      "notifications",
      "<all_urls>"
    ],

With that, you're all done! Congratulations, eh! Reward yourself with some poutine.

### Next up

The code for this step is in [step4](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/step4).

_**Continue to [Extensions &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/extensions.md)**_