var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");

var W = 600;
var H = 400;

// Prepare the DOM
var container = document.createElement("div");
container.style.border = "1px solid black";
container.style.width = W+"px";
container.style.height = H+"px";
container.style.margin = "auto auto";
document.body.style.background = "#333";
document.body.appendChild(container);

// Define the canvas timeline elements
var canvasTimeline =
[
{
  duration: 1000,
  transitionNext: {
    name: "fade",
    duration: 1000
  },
  slide2d: {
    "background": "#eee",
    "size": [
      800,
      600
    ],
    "draws": [
      {
        "fillStyle": "#000",
        "font": "bold 80px Arial",
        "textAlign": "center"
      },
      [
        "fillText",
        "Diaporama DEMO",
        400,
        250
      ],
      {
        "fillStyle": "#666",
        "font": "italic 40px Arial",
        "textAlign": "center"
      },
      [
        "fillText",
        "Slideshow with Images and Videos",
        400,
        350
      ]
    ]
  }
}
];

// Define the images canvas elements
var imagesTimeline =
[
  "http://i.imgur.com/MQtLWbD.jpg",
  "http://i.imgur.com/N8a9CkZ.jpg",
  "http://i.imgur.com/adCmISK.jpg"
].map(function (url) {
  return {
    image: url,
    duration: 500,
    kenburns: {
      from: [ 0.6, [0.5,0.5] ],
      to: [ 1, [0.5,0.5] ]
    },
    transitionNext: {
      duration: 1000,
      name: "CrossZoom"
    }
  };
});

// Define the video canvas elements
var videosTimeline =
"12345".split("").map(function (n,i) {
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
      "name": ["DoomScreenTransition","swap","doorway","cube","PolkaDotsCurtain"][i]
    }
  };
});

// Utility to interleaves arrays
function interleaves () {
  var heads = [];
  var queues = [];
  for (var i=0; i<arguments.length; ++i) {
    var t = arguments[i];
    if (t.length > 0)
      heads.push(t[0]);
    if (t.length > 1)
      queues.push(t.slice(1));
  }
  if (heads.length === 0) return heads;
  return heads.concat(interleaves.apply(null, queues));
}

// Make the diaporama with the timeline, GlslTransitions and custom settings.
var diaporama = Diaporama(container, {
  timeline: interleaves(canvasTimeline, videosTimeline, imagesTimeline),
  transitions: GlslTransitions
}, {
  autoplay: true,
  loop: true,
  width: W,
  height: H
});

window.diaporama = diaporama;
