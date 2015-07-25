var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");
var beautify = require("json-beautify");

// Diaporama Part

var data = require("./diaporama.json");
data.transitions = GlslTransitions;

// Make the diaporama with the timeline, GlslTransitions and custom settings.
var diaporama = Diaporama(document.getElementById("diaporama"), data, {
  autoplay: true,
  loop: true
});
function resize () {
  // Responsive diaporama
  var width = Math.min(800, document.body.clientWidth);
  var height = Math.round(0.75 * width);
  diaporama.width = width;
  diaporama.height = height;
}
window.addEventListener("resize", resize);
resize();

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

// Add Controls

require("./PlayerControls").init(document.getElementById("controls"), {
  diaporama: diaporama,
  progressHeight: "ontouchstart" in document ? 20 : 10
});

// Templatize some part of the page

document.getElementById("data").innerHTML = beautify(data, null, 2, 80);

// Synchronise the current slide and next transition

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
