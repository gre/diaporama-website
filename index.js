var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");
var beautify = require("json-beautify");

// Define the different demos

var slideshows = [], currentSlideshow;
function addSlideshow (id, json, localize, needGlslTransitions) {
  if (needGlslTransitions) json.transitions = GlslTransitions;
  if (localize) Diaporama.localize(json, localize);
  slideshows.push({ id: id, json: json });
}
addSlideshow(currentSlideshow = "Greweb's Garden", require("./garden/diaporama.json"), "/garden/", true);
addSlideshow("Example 1", require("./example1/diaporama.json"), "/example1/");
addSlideshow("Example 2", require("./example2"), null, true);
addSlideshow("Example 3", require("./example3/diaporama.json"), "/example3/", true);


// Create the Diaporama (empty for now)

var diaporama = Diaporama(document.getElementById("diaporama"), null, {
  autoplay: true,
  loop: true
});
function resize () { // Responsive diaporama
  var width = Math.min(800, document.body.clientWidth);
  var height = Math.round(0.75 * width);
  diaporama.width = width;
  diaporama.height = height;
}
window.addEventListener("resize", resize);
resize();

window.diaporama = diaporama; // Play with diaporama in the Web Console

// Pause the Diaporama when scroll down

var limitY = 1200;
var prevScrollState = window.scrollY > limitY;
function checkScroll () {
  var state = window.scrollY > limitY;
  if (prevScrollState === state) return;
  prevScrollState = state;
  diaporama.paused = window.scrollY > limitY;
}
window.addEventListener("scroll", checkScroll);
checkScroll();

// Add Controls

require("diaporama-player-controls").init(document.getElementById("controls"), {
  diaporama: diaporama,
  progressHeight: "ontouchstart" in document ? 20 : 10
});

// Synchronise the data

var $data = document.getElementById("data");
diaporama.on("data", function () {
  $data.innerHTML = beautify(diaporama.data, null, 2, 80);
});

// Synchronise the current slide

var $currentSlide = document.getElementById("currentSlide");
diaporama.on("slide", function (slide) {
  $currentSlide.textContent = beautify(slide, null, 2, 80);
  window.hljs.highlightBlock($currentSlide);
});

// Synchronise the transition

var $transitionAuthor = document.getElementById("transitionAuthor");
diaporama.on("transition", function (transitionNext) {
  var transition = transitionNext.name && diaporama.data.transitions.filter(function (t) {
    return t.name.toLowerCase() === transitionNext.name.toLowerCase();
  })[0];
  if (transition) {
    $transitionAuthor.innerHTML = "<strong><i class='fa fa-github-alt'></i> "+transitionNext.name+"</strong> by <em>"+transition.owner+"</em>";
    $transitionAuthor.href = transition.html_url;
  }
  else {
    $transitionAuthor.textContent = "fade";
  }
});

// Slideshows navs

var $slideshows = document.getElementById("slideshows");
slideshows.forEach(function (slideshow) {
  var a = document.createElement("a");
  $slideshows.appendChild(a);
  a.href = "#";
  a.textContent = slideshow.id;
  a.addEventListener("click", function (e) {
    e.preventDefault();
    diaporama.data = slideshow.json;
    diaporama.currentTime = 0;
  });
  diaporama.on("data", function (data) {
    if (slideshow.json === data) {
      a.className = "active";
    }
    else {
      a.className = "";
    }
  });
  if (slideshow.id === currentSlideshow) {
    diaporama.data = slideshow.json;
  }
});
