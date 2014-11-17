## Extensions, Eh?

Hopefully you've built your very own Eh app by now. However, you'll probably want to give it a little unique touch of your very own - we've got some ideas of how to extend it.

### Hacking on UI

If you want to update Eh's custom elements and Polymer dependencies, you will need to install:

* [Vulcanize](https://www.npmjs.org/package/vulcanize) with `npm install -g vulcanize`
* [Bower](http://bower.io) with `npm install -g bower`

Then you can update the custom components inside the `ui/` folder, and run the `ui/prepare.sh` script to commit your changes.

The `ui/prepare.sh` script runs the `vulcanize` tool, which is required because of the default [Content Security Policy](https://developer.chrome.com/extensions/contentSecurityPolicy) that disallows inline scripts.


### Audio

This is _eh_ well and good, but we'd like to draw a user's attention closer to a notification when it happens. To do this, let's use the [Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/).

Add this helper method inside your `background.js`, as this audio will play regardless of where a user is-

    var audioCtx = new window.AudioContext;
    function play(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        audioCtx.decodeAudioData(request.response, function(buffer) {
          var source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.start(0);
        }, function(e) {
          console.log('Error decoding audio', e);
        });
      }

      request.send();
    }

Then, we need to update where we create a notification to also play a sound. Good news! We've included some audio for you. Around where we create the notification, inside the `onIncomingEh()` method, let's add-

      // Incoming Eh: we'll update the notification here later [4].
      play('assets/sounds/jake.wav');

      // ...

If you'd prefer some other audio, you can add your own file in.


### Eh Icons

The icons that CDE or the `cca` configure for Eh are definitely the 'defaults'. If you'd like to update them to use something that shows your proud heritage (well, someone's proud heritage, if you're not from Canada) then you can update the `manifest.json` file. Instead of these icons-

      "icons": {
        "16": "assets/icon_16.png",
        "128": "assets/icon_128.png"
      },

Try changing them to the provided icons in the common `ui` folder-

      "icons": {
        "16": "ui/assets/icons/icon16.png",
        "128": "ui/assets/icons/icon128.png",
      },


### Offline Userlist

Support offline by caching the userlist on disk using the `chrome.storage` api.  Maybe also queue outgoing eh's to send when you come back online.
