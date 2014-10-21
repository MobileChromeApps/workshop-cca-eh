## workshop-cca-eh

Eh is a real-world messaging application, built with [Chrome Apps for Mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile), that brings out the inner Canadian in all of us.

This repository contains the final version of Eh, plus a workshop to build it on your own. It incorporates a bit of [Polymer](https://www.polymer-project.org/) and [Material Design](https://www.google.com/design/spec) elements, but mostly focuses on Chrome Apps Api's and development workflow.

### Background

* What are [chrome apps](https://developer.chrome.com/apps/about_apps)?  [for mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile)? Why?

  > Prove that web apps can be comparable to native apps, and that they deserve integration into the Play Store.
  > There's some truth in opinions against webview-based apps, but our goal is to showcase why they actually are the best approach in some cases.

  * [API Docs](https://developer.chrome.com/apps/api_index), [API Status for Android](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/APIsAndLibraries.md)

* Two workflow choices:
  * Command Line: [`cca`](https://github.com/MobileChromeApps/mobile-chrome-apps)
  * IDE: [Chrome Dev Editor](https://github.com/dart-lang/chromedeveditor) (for your Desktop) plus [Chrome App Developer Tool](https://github.com/MobileChromeApps/chrome-app-developer-tool) (for your Android)

### Prerequisites

Lets configure your development environment and run a sample app to make sure you can get started.

* Clone this repository:

        git clone https://github.com/MobileChromeApps/workshop-cca-eh.git

* Go get a USB Cable, and connect your Android to the Desktop.
  * Make sure you have [Developer Options and USB Debugging enabled](http://developer.android.com/tools/device.html#developer-device-options).

> To access these settings, open the Developer options in the system Settings. On Android 4.2 and higher, the Developer options screen is hidden by default. To make it visible, go to *Settings > About phone* and tap *Build number* seven times. Return to the previous screen to find Developer options at the bottom.

### Prerequisites for IDE workflow

* Install the [Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en) (CDE, recommended) on your Desktop.

* Install the [Chrome App Developer Tool](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/README.md#deploy-to-mobile) (CADT) on your Android Device.

* Run the Chrome Dev Editor (Find it in [chrome://apps](chrome://apps) or the chrome app launcher), and open the `app/www` folder from the repo you cloned earlier.
  * Try to run locally with the "Play" button.
  * Try to "Deploy to Mobile" over USB, which you can find in the menu.

* If this works, you are good to go!

#### Prerequisites for CLI workflow

* Install the [`cca`](https://www.npmjs.org/package/cca).  Just follow [this guide](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/Installation.md).

* Create a new project and import the the `app/www` folder from the repo you cloned earlier with `cca create EhApp --copy-from ../PATH_TO/app/www`.
  * Try to run on device with `cd EhApp` and `cca run android --device`.
  * On OSX you can also `cca run chrome` to preview the app locally.

* If this works, you are good to go!

#### Optional Prerequisites for hacking on UI

If you want to update Eh's custom elements and Polymer dependencies,  utility to run Eh, you will need to install (see [Install Your Development Tools](https://developer.chrome.com/apps/chrome_apps_on_mobile#step-1-install-your-development-tools)):

* [Node.js](http://nodejs.org) version 0.10.0 (or higher) with `npm`
  * [Bower](http://bower.io)
  * [Vulcanize](https://www.npmjs.org/package/vulcanize)
  * JDK 1.7 or higher (for `cca` only)

To update Eh's dependencies, you can then run `common/prepare.sh`.
This uses Bower to update Eh's dependencies, including Polymer, and runs a vulcanize step.

* This is required as [Content Security Policy](https://developer.chrome.com/extensions/contentSecurityPolicy) disallows inline scripts inside Chrome Apps, an important part of Polymer.

Note that Eh uses an already configured [GCM](https://developer.android.com/google/gcm/index.html) endpoint to talk between clients.
This is not part of the workshop but will remain up for your Eh extension apps.

### Deploy

If you're using the Chrome Dev Editor, you need to add the project you're working on to its environment.

* Load CDE via the Apps (`chrome://apps`) page
* Select `Open Folder...`, and choose `app/www` inside the repository
  * You can point to e.g. `workshop/step3` to add an intermediate step

From here, you can right-click on the project. Either select **Run** for desktop, or **Deploy To Mobile** for mobile.

#### Desktop-only

You can just add the folder as an 'unpacked extension' in Extensions (`chrome://extensions`) with **Developer Mode** enabled. You don't need CDE for this.

#### Rapid mobile

You can use the `cca` command-line tool (see [Advanced](#Advanced)) to push to CADT. Step into your project's folder (containing `manifest.json`), and then run-

    cca push --watch

This will watch the folder for changes. This is ideal for rapid development.

#### Mobile binary

Finally, the `cca` can also be used to build a native APK or iOS binary.

* Run `cca checkenv` to report which mobile environments are available
* Create a Cordova application by linking your project - this creates a workspace to compile binaries

        cca create ehApp --link-to=app/www
        cca create ehStepApp2 --link-to=workshop/step2
        # or link to any path containing manifest.json

* Step into the newly created app folder
* Install and run on your native platform of choice with-

        cca run android --device
        cca run ios --device

### Lets Get Started, Eh!

Now that you have the development environment - and you can run the final Eh on desktop or mobile, to Eh anyone online - the following workshop will walk through each step to build it from scratch.

_**Continue to [Step 0: Project setup &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step0.md)**_

If you'd just like to take the finished Eh product and add some extension tasks, you can skip right to the end.

_**Continue to [Extensions &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/extensions.md)**_
