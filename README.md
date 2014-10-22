## workshop-cca-eh

Eh is a real-world messaging application, built with [Chrome Apps for Mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile), that brings out the inner Canadian in all of us.

This repository contains the final version of Eh, plus a workshop to build it on your own. It incorporates a bit of [Polymer](https://www.polymer-project.org/) and [Material Design](https://www.google.com/design/spec) elements, but mostly focuses on Chrome Apps APIs and development workflow.

### Background

* What are [Chrome Apps](https://developer.chrome.com/apps/about_apps)? [For mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile)? Why?

  > To prove that web apps can be comparable to native apps, and that they deserve integration into the Play Store.
  > There's some truth in opinions against webview-based apps, but our goal is to show why they actually are the best approach in some cases.

  * [API Docs](https://developer.chrome.com/apps/api_index), [API Status for Android](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/APIsAndLibraries.md)

* Two workflow choices:
  * Command Line: [`cca`](https://github.com/MobileChromeApps/mobile-chrome-apps)
  * IDE: [Chrome Dev Editor](https://github.com/dart-lang/chromedeveditor) (for your desktop) plus [Chrome App Developer Tool](https://github.com/MobileChromeApps/chrome-app-developer-tool) (for your Android)

### Prerequisites

Lets configure your development environment and run a sample app to make sure you can get started.

* Clone this repository:

        git clone https://github.com/MobileChromeApps/workshop-cca-eh.git

* Go get a USB cable, and connect your Android to the desktop.
  * Make sure you have [Developer Options and USB Debugging enabled](http://developer.android.com/tools/device.html#developer-device-options).

> To access these settings, open the Developer options in the system Settings. On Android 4.2 and higher, the Developer options screen is hidden by default. To make it visible, go to **Settings > About phone** and tap **Build number** seven times. Return to the previous screen to find Developer options at the bottom.

Usually you would also need to configure [GCM](https://developer.android.com/google/gcm/index.html), but this workshop uses an previously configured endpoint to talk between clients.

### Prerequisites for IDE workflow

* Install the [Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en) (CDE, recommended) on your desktop.

* Install the [Chrome App Developer Tool](https://drive.google.com/uc?export=download&confirm=fjug&id=0B0UdPHoQPXheQjAwdmZfOENrQjQ) (CADT) on your Android Device.
  * Note: its important to install *this* version of CADT and not the official version.  That is because `chrome.gcm` requires that you register your application, and for this workshop I've specifically done so for this special build of the CADT.  (Nothing special, it just required a specific packageId).

* Run the Chrome Dev Editor (Find it in `chrome://apps` page or the Chrome App launcher), and open the `app/` folder from the repo you cloned earlier (using `Menu -> Open Folder...`).
  * Try to run the app locally (using the Play button).
  * Try to deploy to mobile from CDE (using `Menu -> Deploy to Mobile...`).
    * Start CADT on your Android device first!

* If this works, you are good to go!

#### Prerequisites for CLI Workflow

* Install the [`cca`](https://www.npmjs.org/package/cca) tool by following [this installation guide](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md).

* Create a new project and import the `app/` folder from this repo (which you should have cloned earlier), using `cca create EhApp --copy-from ../PATH_TO/app/`.
  * Try to run the app on your device with `cd EhApp` and `cca run android --device`.
  * On OS X, you can also `cca run chrome` to preview the app locally.

* If this works, you are good to go!

* If you want to get fancy, you can also use the CADT together with `cca` for rapid deployment, using `cca push --watch`.
  * I'll leave that for you to figure out.  (Hint: `cca --help`.)

#### Totally Optional Steps for Hacking on UI

If you want to update Eh's custom elements and Polymer dependencies, you will need to install:

* [Bower](http://bower.io), and
* [Vulcanize](https://www.npmjs.org/package/vulcanize)

You can then run `common/prepare.sh` to update the custom elements used to build the app's UI.

> This is required because of the [Content Security Policy](https://developer.chrome.com/extensions/contentSecurityPolicy), which disallows inline scripts inside Chrome Apps, an important part of Polymer.

### Lets Get Started, Eh!

Now that you have your development environment set up, you can start building the Eh app on desktop or mobile.  This workshop will walk through each step to build it from scratch.

_**Continue to [Step 1: Getting Started &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step1.md)**_
