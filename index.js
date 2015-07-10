var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");

var container = document.createElement("div");
document.body.appendChild(container);

var diaporama = Diaporama(container, {
  timeline: "12345".split("").map(function (n) {
    return {
      "video": {
        "video/webm": "cut"+n+".webm",
        "video/mp4": "cut"+n+".mp4"
      },
      "duration": 2000,
      "loop": true,
      "volume": 0,
      "playbackRate": 1,
      "transitionNext": {
        "duration": 2000,
        "name": "cube"
      }
    };
  }),
  transitions: GlslTransitions
}, {
  autoplay: true,
  loop: true,
  width: 400,
  height: 300
});
