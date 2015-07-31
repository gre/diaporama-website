var querystring = require("querystring");
var Rx = require("rx-dom");
var TransitionGenerator = require("./TransitionGenerator");

var freeSlideBehind = 10;
var scheduleSlidesAhead = 10;
var scheduleSlidesChunk = 20;

var PROXY = "http://flickr.greweb.fr";
var API_KEY = "be902d7f912ea43230412619cb9abd52"; // PLEASE use your own if reusing this code - @greweb

var initialSlide = {
  "slide2d": {
    "background": "#a36",
    "size": [ 800, 600 ],
    "draws": [
      { "font": "bold 80px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "textAlign": "center" },
      [ "fillText", "Stream example", 400, 200 ],
      { "font": "italic 60px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "textAlign": "center" },
      [ "fillText", "using flickr API", 400, 350 ],
      { "font": "italic 20px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "textAlign": "center" },
      [ "fillText", "(the timeline gets dynamically updated, don't pay attention to the cursor/time/slide)", 400, 500 ]
    ]
  },
  "duration": 2000,
  "transitionNext": {
    "duration": 5000
  }
};

function photoUrl (photo) {
  return PROXY+"/?"+querystring.stringify({
    farm: photo.farm,
    server: photo.server,
    id: photo.id,
    secret: photo.secret
  });
}
function searchPhotosFlickrURL (nb, text) {
  return "https://www.flickr.com/services/rest/?"+querystring.stringify({
    jsoncallback: "JSONPCallback",
    method: "flickr.photos.search",
    text: text,
    per_page: nb,
    format: "json",
    api_key: API_KEY
  });
}
function fetchPhotos () {
  return Rx.DOM.jsonpRequest(searchPhotosFlickrURL(scheduleSlidesChunk, "Landscape"))
  .map(function (json) {
    return json.response.photos.photo.map(photoUrl);
  });
}
function randomSlideForImage (image) {
  var tnext = TransitionGenerator.random();
  tnext.duration = Math.round(2000 + 2000 * Math.random());
  return {
    image: image,
    duration: Math.round(2000 * Math.random()),
    kenburns: {
      from: [0.8, [Math.random(),Math.random()]],
      to: [1, [Math.random(),Math.random()]]
    },
    transitionNext: tnext
  };
}
function randomSlidesForImages (images) {
  return images.map(randomSlideForImage);
}

var leaves = new Rx.Subject();

module.exports = function (diaporama) { // function called when the demo starts

  diaporama.data = {
    timeline: [ initialSlide ],
    transitions: TransitionGenerator.transitions
  };

  function needMorePhotos () {
    return diaporama.slide + scheduleSlidesAhead > diaporama.slides;
  }

  function fetchPhotosIfNecessary () {
    if (!needMorePhotos()) return Rx.Observable.empty();
    return fetchPhotos();
  }

  var stream =
    Rx.Observable.fromEvent(diaporama, "slide") // Everytime a slide changes
    .flatMapFirst(fetchPhotosIfNecessary) // check if we need to load more photos & fetch urls
    .map(randomSlidesForImages) // transform the image urls into random slides
    .takeUntil(leaves); // we stop once user leaves the demo

  var subscription = diaporama.feed(stream, { freeSlideBehind: freeSlideBehind });

  return function () { // function called when the demo ends
    leaves.onNext();
    subscription.dispose();
  };
};
