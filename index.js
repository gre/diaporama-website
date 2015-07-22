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

window.diaporama = diaporama; // Play with diaporama in the Web Console

// Pause the Diaporama when scroll

var prevScrollState = window.scrollY > 900;
function checkScroll () {
  var state = window.scrollY > 900;
  if (prevScrollState === state) return;
  prevScrollState = state;
  diaporama.paused = window.scrollY > 900;
}
window.addEventListener("scroll", checkScroll);
checkScroll();

var currentSlide = document.getElementById("currentSlide");
var nextTransition = document.getElementById("nextTransition");
diaporama.on("slide", function (slide) {
  var s = {}; for (var k in slide) s[k] = slide[k];
  delete s.transitionNext;
  currentSlide.textContent = beautify(s, null, 2, 80);
  nextTransition.textContent = beautify(slide.transitionNext, null, 2, 80);
  hljs.highlightBlock(currentSlide);
  hljs.highlightBlock(nextTransition);
});

// Controls

require("./PlayerControls").init(document.getElementById("controls"), {
  diaporama: diaporama
});

// Templatize some part of the page

document.getElementById("data").innerHTML = beautify(data, null, 2, 80);
