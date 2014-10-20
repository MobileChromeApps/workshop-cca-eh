## workshop-cca-eh

Eh is a real-world messaging application, built with [Chrome Apps for Mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile), that brings out the inner Canadian in all of us.

This repository contains the final version of Eh, plus a workshop to build it on your own. It incorporates [Polymer](https://www.polymer-project.org/) and [Material Design](https://www.google.com/design/spec) elements.

### Background

* What are [chrome apps](https://developer.chrome.com/apps/about_apps)?  [for mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile)? Why?

  > Prove that web apps can be comparable to native apps, and that they deserve integration into the Play Store.
  > There's some truth in opinions against webview-based apps, but our goal is to showcase why they actually are the best approach in some cases.

  * [API Docs](https://developer.chrome.com/apps/api_index), [API Status for Android](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/APIsAndLibraries.md)

* [cca](https://github.com/MobileChromeApps/mobile-chrome-apps) vs [cadt](https://github.com/MobileChromeApps/chrome-app-developer-tool)

### Prerequisites

First, configure your development environment and run the final version of Eh.
You should be able to target Desktop, but also Android or iOS if you have a nearby device handy.

* Clone this repository:

        git clone https://github.com/MobileChromeApps/workshop-cca-eh.git

* Install the [Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en) (CDE, recommended)

#### Advanced

If you want to update Eh's custom elements and Polymer dependencies, or use the [`cca`](https://www.npmjs.org/package/cca) utility to run Eh, you will need to install (see [Install Your Development Tools](https://developer.chrome.com/apps/chrome_apps_on_mobile#step-1-install-your-development-tools)):

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

_**Continue to [Step 1: Getting started &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step1.md)**_

If you'd just like to take the finished Eh product and add some extension tasks, you can skip right to the end.

_**Continue to [Extensions &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/extensions.md)**_
