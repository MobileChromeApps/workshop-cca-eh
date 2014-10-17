## Step 1: Getting started

### Create a new project

Start the Chrome Dev Editor. If this is the first time using the editor, you may be prompted with some initial setup steps.

Select `New Project...`, then enter 'EhWorkApp', select the type `JavaScript Chrome App`, and tap `Create`.

The editor will create a basic Chrome app that can be run on desktop or on mobile.

* At any point, press the play button in the top-left of the editor to preview in Chrome.

* To preview the app on Android, right-click on your project's name (e.g. 'EhWorkApp') and tap `Deploy to Mobile...`.

[//]: # (TODO(samthor): reference CADT from README.md)

Alternatively, you can use `cca` on the command-line. Run:

    cca create EhWorkApp

From within the new `EhWorkApp` folder, you can then run either:

    cca run chrome

You can also use `android` or `ios` (with optional `--device`, to use a physically connected device) in place of `chrome`, to run on mobile, such as:

    cca run --device android

### Symlink assets

Once the project is created (either with CDE or `cca`), you should symlink in the common resources for Eh -- the symlink should be created as a peer of `manifest.json`.

For CDE, this will look like:

    ln -s /path/to/workshop-cca-eh/common EhWorkApp/common

And for the `cca`, this will look like:

    ln -s /path/to/workshop-cca-eh/common EhWorkApp/www/common

If you'd like to regenerate these resources (advanced, via Bower) then see [README.md](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/README.md).

### Polymer scaffolding

TODO. Add basic HTML and run.

### Next up

The code for this step is in (https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/begin).

_**Continue to [Step 2: Google Cloud Messaging &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step2.md)**_