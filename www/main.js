'use strict';

function testGcm() {
  chrome.runtime.getBackgroundPage(function(bgpage) {
    bgpage.sendMessage({'test': 'test'});
  });
};
