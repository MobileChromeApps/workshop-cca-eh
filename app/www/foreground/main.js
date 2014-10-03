'use strict';

/******************************************************************************/

var bg = null;

/******************************************************************************/

// TODO: Replace this with Polymer list data-binding
function createBlock(text, onclick) {
  var div = document.createElement('div');
  div.innerText = text;
  div.onclick = function() {
    console.log('clicked');
    onclick();
  };
  document.body.appendChild(div);
  return div;
}

function updateUI() {
  if (Object.keys(bg.userlist).length == 0) {
    var div = createBlock('Waiting for users');
  }

  Object.keys(bg.userlist).forEach(function(userid) {
    var text = bg.userlist[userid].isCurrentlySendingMessageEh ? '...' : bg.userlist[userid].name;
    var div = createBlock(text, bg.sendEh.bind(null, userid));
    div.classList.add('user');
  });
}

/******************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.getBackgroundPage(function(bgpage) {
    // TODO: chrome desktop calls this once with null.  bug?
    if (!bgpage)
      return;

    bg = bgpage;

    // Start a raf-based event loop
    var i = 0;
    (function raf() {
      if (i++ == 600) {
        updateUI();
        i = 0;
      }
      requestAnimationFrame(raf);
    }());

  });
});

/******************************************************************************/
