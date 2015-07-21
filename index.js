var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");
var beautify = require("json-beautify");

// Diaporama Part

var data = require("./diaporama.json");
data.transitions = GlslTransitions;

// Make the diaporama with the timeline, GlslTransitions and custom settings.
var diaporama = Diaporama(document.getElementById("diaporama"), data, {
  autoplay: true,
  loop: true,
  width: 800,
  height: 600
});

document.body.addEventListener("keydown", function (e) {
  switch (e.which) {
  case 37: // Left
    diaporama.prev();
    break;
  case 39: // Right
    diaporama.next();
    break;
  case 32: // Space
    diaporama.paused = !diaporama.paused;
    break;
  }
});

window.diaporama = diaporama;


// Templatize some part of the page

document.getElementById("data").innerHTML = beautify(data, null, 2, 80);
