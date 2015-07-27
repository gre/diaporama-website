
module.exports = {
  timeline: [
    {
      "slide2d": {
        "background": "#89B",
        "size": [ 800, 600 ],
        "draws": [
          { "font": "bold 80px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "textAlign": "center" },
          [ "fillText", "Diaporama", 400, 250 ],
          { "font": "normal 80px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "textAlign": "center" },
          [ "fillText", "Example 2", 400, 350 ]
        ]
      },
      "duration": 500,
      "transitionNext": {
        "duration": 1000
      }
    }
  ].concat([
    "http://i.imgur.com/MQtLWbD.jpg",
    "http://i.imgur.com/N8a9CkZ.jpg",
    "http://i.imgur.com/adCmISK.jpg",
    "http://i.imgur.com/AedZQ4N.jpg",
    "http://i.imgur.com/y9qRJR3.jpg",
    "http://i.imgur.com/brzKTYZ.jpg",
    "http://i.imgur.com/NSyk07l.jpg",
    "http://i.imgur.com/EaZiWfn.jpg",
    "http://i.imgur.com/I1KZdnl.jpg",
    "http://i.imgur.com/DoQBdzT.jpg",
    "http://i.imgur.com/slIt2Ww.jpg",
    "http://i.imgur.com/DA12puU.jpg",
    "http://i.imgur.com/IYLdRFW.jpg",
    "http://i.imgur.com/oqmO4Po.jpg",
    "http://i.imgur.com/T6NaLyI.jpg",
    "http://i.imgur.com/6XAPrAY.jpg",
    "http://i.imgur.com/thYzbif.jpg",
    "http://i.imgur.com/4qmqo3o.jpg",
    "http://i.imgur.com/8xT2J96.jpg",
    "http://i.imgur.com/ZCa2pWq.jpg",
    "http://i.imgur.com/loQfDN2.jpg",
    "http://i.imgur.com/oabfA68.jpg",
    "http://i.imgur.com/uOXqDRY.jpg",
    "http://i.imgur.com/MyyS4vK.jpg",
    "http://i.imgur.com/fhNYTX4.jpg"
  ].map(function (src) {
    return {
      image: src,
      duration: 1000,
      kenburns: {
        from: [0.8, [0.5,0.5]],
        to: [1, [0.5,0.5]]
      },
      transitionNext: {
        duration: 1000,
        name: "circleopen"
      }
    };
  }))
};
