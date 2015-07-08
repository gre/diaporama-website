var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");

var container = document.createElement("div");
document.body.appendChild(container);

var diaporama = Diaporama(container, {
  timeline: "12345".split("").map(function (n) {
    return {
      "video": "cut"+n+".webm",
      "duration": 2000,
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
