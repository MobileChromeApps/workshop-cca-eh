## workshop-cca-eh

Eh is a real-world messaging application, built with [Chrome Apps for Mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile), that brings out the inner Canadian in all of us.

This repository contains the final version of Eh, plus a workshop to build it on your own. It incorporates [Polymer](https://www.polymer-project.org/) and [Material Design](https://www.google.com/design/spec) elements.

### Background

* What are [chrome apps](https://developer.chrome.com/apps/about_apps)?  [for mobile](https://developer.chrome.com/apps/chrome_apps_on_mobile)? Why?

  > Prove that web apps can be comparable to native apps, and that they deserve integration into the Play Store.
  > There's some truth in opinions against webview-based apps, but our goal is to showcase why they actually are the best approach in some cases.

  * [API Docs](https://developer.chrome.com/apps/api_index), [API Status for Android](https://github.com/MobileChromeApps/mobile-chrome-apps/blob/master/docs/APIStatus.md)

* [cca](https://github.com/MobileChromeApps/mobile-chrome-apps) vs [cadt](https://github.com/MobileChromeApps/chrome-app-developer-tool)

### Setup

First, configure your development environment and run the final version of Eh.
You should be able to target Desktop, but also Android or iOS if you have a nearby device handy.

* Clone this repository:

      git clone https://github.com/MobileChromeApps/workshop-cca-eh.git

* Install the [Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg?hl=en) (CDE, recommended)

#### Advanced

If you want to update Eh's custom elements and Polymer dependencies, or use the [`cca`](https://www.npmjs.org/package/cca) utility to run Eh, you will need to install:

* [Node.js](http://nodejs.org) version 0.10.0 (or higher) with `npm`
  * [Bower](http://bower.io)
  * [Vulcanize](https://www.npmjs.org/package/vulcanize)
  * JDK 1.7 or higher (for `cca` only)

You can also follow [Install Your Development Tools](https://developer.chrome.com/apps/chrome_apps_on_mobile#step-1-install-your-development-tools).

To update Eh's dependencies, you can then run `common/prepare.sh`.
This uses Bower to fetch Eh's dependencies (out of scope of this workshop), including Polymer, before running `vulcanize`.

* This is required as [Content Security Policy](https://developer.chrome.com/extensions/contentSecurityPolicy) disallows inline scripts inside Chrome Apps, an important part of Polymer.

Note that Eh uses an already configured [GCM](https://developer.android.com/google/gcm/index.html) endpoint to talk between clients.
This is not part of the workshop but will remain up for your Eh extension apps.

#### Desktop

To load Eh without CDE or `cca`, you can load its path directly.
Inside Chrome, head to [Extensions](chrome://extensions) and load an unpacked extension while in Developer mode. Point to `app/www` inside the repository.

You can also use the Chrome Dev Editor to perform this step.

* Load CDE via the [Apps](chrome://apps) page
* Select `Open Folder...`, and choose `app/www` inside the repository
* Right-click on `www`, and hit Run

Finally, if you prefer the command-line, you can use `cca`. You first need to make a project that links to the www path.

* From the top level of the repository, run:

      cca create ehApp --link-to=app/www

* From within `ehApp`, you can type `cca run chrome`.

#### Mobile

You must use CDE or `cca` to deploy Eh to mobile.

* To use CDE on Android, install [Custom build of CADT](https://github.com/mmocny/wat-pddays-cca-eh/releases/download/CADT/ChromeAppDeveloperTool-debug-unaligned.apk)

[//]: # (TODO(samthor): describe using host app)

* The `cca` utility may be used instead. Firstly, run:

      `cca checkenv`

  This will report which mobile environments are available.
  To run and install on a connected Android device, ensure it is enabled for debugging and then run -- from within `ehApp`:

      `cca run android --device`

### Lets Get Started, Eh!

Now that you have the development environment - and you can run Eh on desktop or mobile to Eh anyone online - the following workshop will walk through each step to build it from scratch.

_**Continue to [Step 1: Getting started &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step1.md)**_

If you'd just like to take the finished Eh product and add some extension tasks, you can skip right to the end.

_**Continue to [Extensions &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/extensions.md)**_
