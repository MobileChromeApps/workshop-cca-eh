## Step 0: Project setup

### Create

Start the Chrome Dev Editor. If this is the first time using the editor, you may be prompted with some initial setup steps.

Select `New Project...`, then enter 'EhWorkApp', select the type `JavaScript Chrome App`, and tap `Create`.
_You don't need to select **(using Polymer paper elements)**, as this workshop contains common resources for Polymer already._

The editor will create a basic Chrome app that can be run on desktop or on mobile. Alternatively, the code for this is in  [begin](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/begin), and you can use `Open Folder...` to select and start with it.

### Deploy

Right-click on the project and either select **Run** for desktop, or **Deploy To Mobile** for mobile. _As per [README.md](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/README.md), you'll need [CADT](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/README.md#deploy-to-mobile) installed on your mobile device_.

If you installed the `cca`, you can also drop to a command-line in the new folder, and use the tool to automatically push to CADT on changes-

    cca push --watch

### Advanced

Alternatively, you can use the `cca` via command-line to create the initial project-

    cca create EhWorkApp

From within the new `EhWorkApp` folder, you can then run on your native platform of choice-

    cca run chrome
    cca run android --device
    cca run ios --device

Alternatively, you can actively push to the CADT host app from `EhWorkApp/www`-

    cca push --watch

Or finally, you can open the `EhWorkApp/www` folder in the Chrome Dev Editor and follow the instructions above to start.

### How's it going, eh

If you run the app now - either on desktop or mobile - you should see a "Hello World" message.

### Next up

The code for this step is in [begin](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/workshop/begin).

_**Continue to [Step 1: Getting started &raquo;](https://github.com/MobileChromeApps/workshop-cca-eh/blob/master/docs/step1.md)**_
