'use strict';

/******************************************************************************/

function play(url) {
  var request = new XMLHttpRequest();

  request.open('GET', url, true)
  request.responseType = "arraybuffer"

  request.onload = function() {
    var audioCtx = new window.AudioContext;
    audioCtx.decodeAudioData(request.response, function(buffer) {
      var source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.loop = false;
      source.start(0);
    }, function(e) {
      console.log("Error decoding audio data" + e.err)
    });
  }

  request.send()
}

/******************************************************************************/
