'use strict';

/******************************************************************************/

var audioCtx = new window.AudioContext;

function play(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true)
  request.responseType = "arraybuffer"
  request.onload = function() {
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
  request.send();

  /*
   * This would be awesome, but it doesn't work on mobile right now :(
  var audio = new Audio(url);
  audio.play();
  */
}

/******************************************************************************/
