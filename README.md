wat-pddays-cca-eh
=================

0. What are chrome apps?  for mobile?  why?

1. cca vs cadt

2. Getting Hello World up and running
  * `git clone https://github.com/mmocny/wat-pddays-cca-eh.git`
  * Bonus: Help others!

3. Stub Out API and start building prototype

```
identifySelfEh(displayName, callback)
onUserListChangeEh(userlist)
onIncomingEh(from_userid)
sendEh(userid, callback)
```

  * Bonus: promises instead of callbacks
  * Bonus: UI with Polymer?

4. Fire Local Notification, handle callback
  * Bonus: use chrome.alarms to fire delayed notification from background
  * Bonus: add audio que

5. Use chrome.gcm to:
  1. Implement `identifySelfEh`
  2. Implement `onUserListChangeEh`
  3. Implement `onIncomingEh`
  4. Implement `sendEh`

6. Make it shine!
