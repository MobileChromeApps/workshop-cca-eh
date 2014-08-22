wat-pddays-cca-eh
=================

### Intro

* What are [chrome apps](https://developer.chrome.com/apps/about_apps)?  [for mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile)? Why?

  > Prove that web apps can be comparable to native apps, and that they deserve integration into the Play Store.
  > There's some truth in opinions against webview-based apps, but our goal is to showcase why they actually are the best approach in some cases.

  * [API Docs](https://developer.chrome.com/apps/api_index), [API Status for Android](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/APIStatus.md)

* [cca](https://github.com/MobileChromeApps/mobile-chrome-apps) vs [cadt](https://github.com/MobileChromeApps/chrome-app-developer-tool)

### Setup

* Getting Hello World up and running
  * On Android, install [Custom build of CADT](https://github.com/mmocny/wat-pddays-cca-eh/releases/download/CADT/ChromeAppDeveloperTool-debug-unaligned.apk)
  * On Laptop, `npm install -g cca` or [Install Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en)
  * `git clone https://github.com/mmocny/wat-pddays-cca-eh.git`
  * Run, then try Chrome remote inspector
  * Bonus: Help others!

### Lets Get Started, Eh!

* Stub Out API and start building prototype UX

```
identifySelfEh(displayName, callback)
onUserListChangeEh(userlist)
onIncomingEh(from_userid)
sendEh(userid, callback)
```

  * Bonus: promises instead of callbacks
  * Bonus: UI with Polymer

* Add Local Notifications using [chrome.notifications](https://developer.chrome.com/apps/notifications)
  * Bonus: [Add HTML5 Audio](http://stackoverflow.com/questions/25384476/is-it-possible-to-make-chrome-app-notifications-make-a-sound)
  * Bonus: Experiment with [chrome.alarms](https://developer.chrome.com/apps/alarms) firing delayed local notifications while app is in background

* Use [chrome.gcm](https://developer.chrome.com/apps/gcm) to implement in this order:
  * Implement `identifySelfEh`

```
// Outgoing gcm msg with 'data' value of:
{
  'type': 'identifySelfEh',
  'name': your_chosen_display_name
}
```

  * Implement `onUserListChangeEh`

```
// Incoming gcm msg with 'data' value of:
{
  'type': 'userListChangeEh',
  'users': '[[userid1, username1], [userid2, username2], ...]' // NOTICE string type, must pass through JSON.parse
}
```

  * Implement `onIncomingEh`

```
// Incoming gcm msg with 'data' value of:
{
  'type': 'incomingEh',
  'from_userid': source_userid
}
```

  * Implement `sendEh`

```
// Outgoing gcm msg with 'data' value of:
{
  'type': 'sendEh',
  'to_userid': target_userid
}
```

* You can debug GCM with the help of a "test" message.  Just call `sendGcmMessage({'test':'test'})` and you should receive a reply.

### Now Make it Shine!

* Please submit Pull Requests to fix any issues with this repo
