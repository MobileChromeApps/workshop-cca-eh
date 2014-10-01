'use strict';

/******************************************************************************/

// TODO: add support for chrome.runtime.onStartup.addListener
connectGcm(function(regid) {
  console.log('Successfully Registered with GCM server:', regid)
});
