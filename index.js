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

require("diaporama-player-controls").init(document.getElementById("controls"), {
  diaporama: diaporama,
  progressHeight: "ontouchstart" in document ? 20 : 10
});

// Templatize some part of the page

document.getElementById("data").innerHTML = beautify(data, null, 2, 80);

// Synchronise the current slide and next transition

var currentSlide = document.getElementById("currentSlide");
var transitionAuthor = document.getElementById("transitionAuthor");
diaporama.on("slide", function (slide) {
  var transitionNext = slide.transitionNext;
  currentSlide.textContent = beautify(slide, null, 2, 80);
  transitionAuthor.innerHTML = "";
  if (transitionNext && transitionNext.name) {
    var transition = GlslTransitions.filter(function (t) {
      return t.name.toLowerCase() === transitionNext.name.toLowerCase();
    })[0];
    if (transition) {
      transitionAuthor.textContent = transitionNext.name+" by "+transition.owner;
      transitionAuthor.href = transition.html_url;
    }
  }
  hljs.highlightBlock(currentSlide);
});
