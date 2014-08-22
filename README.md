wat-pddays-cca-eh
=================

0. What are [chrome apps](https://developer.chrome.com/apps/about_apps)?  [for mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile)? Why?

  > Prove that web apps can be comparable to native apps, and that they deserve integration into the Play Store.
  > There's some truth in opinions against webview-based apps, but our goal is to showcase why they actually are the best approach in some cases.

  * [API Docs](https://developer.chrome.com/apps/api_index), [API Status for Android](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/APIStatus.md)

1. [cca](https://github.com/MobileChromeApps/mobile-chrome-apps) vs [cadt](https://github.com/MobileChromeApps/chrome-app-developer-tool)

2. Getting Hello World up and running
  * On Android, install [Custom build of CADT](https://github.com/mmocny/wat-pddays-cca-eh/releases/download/CADT/ChromeAppDeveloperTool-debug-unaligned.apk)
  * `npm install -g cca` or [Install Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en)
  * `git clone https://github.com/mmocny/wat-pddays-cca-eh.git`
  * Run, then try Chrome remote inspector
  * Bonus: Help others!

3. Stub Out API and start building prototype UX

```
identifySelfEh(displayName, callback)
onUserListChangeEh(userlist)
onIncomingEh(from_userid)
sendEh(userid, callback)
```

  * Bonus: promises instead of callbacks
  * Bonus: UI with Polymer

4. Add Local Notifications using [chrome.notifications](https://developer.chrome.com/apps/notifications)
  * Bonus: [Add HTML5 Audio](http://stackoverflow.com/questions/25384476/is-it-possible-to-make-chrome-app-notifications-make-a-sound)
  * Bonus: Experiment with [chrome.alarms](https://developer.chrome.com/apps/alarms) firing delayed local notifications while app is in background

5. Use [chrome.gcm](https://developer.chrome.com/apps/gcm) to implement in this order:
  1. Implement `identifySelfEh`

```
// Outgoing gcm msg with 'data' value of:
{
  'type': 'identifySelfEh',
  'name': your_chosen_display_name
}
```

  2. Implement `onUserListChangeEh`

```
// Incoming gcm msg with 'data' value of:
{
  'type': 'userListChangeEh',
  'users': [[userid1, username1], [userid2, username2], ...]
}
```

  3. Implement `onIncomingEh`

```
// Incoming gcm msg with 'data' value of:
{
  'type': 'incomingEh',
  'from_userid': source_userid
}
```

  4. Implement `sendEh`

```
// Outgoing gcm msg with 'data' value of:
{
  'type': 'sendEh',
  'to_userid': target_userid
}
```

6. Make it shine!
