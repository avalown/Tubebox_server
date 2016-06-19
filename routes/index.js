var randomstring = require("randomstring");
var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tubebox' });
})


//
// Create new session if it doesn't exist
//
router.put('/session', function(req, res) {
  req.db.get('sessions').insert({
    rpi: req.query.rpi,
    name: "Playlist",
    music: []
  })

    .on('success', function (doc) {
      res.send(doc)
    })

    .on('error', function(err) {
      if (err) throw err
      res.sendStatus(409)
    })
})


//
// Get an existing session
//
router.get('/session', function(req, res) {
  req.db.get('sessions').findById(req.query.id)

    .on('success', function (doc) {
      console.log(doc)
      /*var session_string = "{";
      for(var i = 0; i < doc.music.length; ++i) {
        session_string += "\"" + i.toString() + "\" : \"" + doc.music[i] + "\""
        if(i < doc.music.length - 1)
          session_string += ", "
      }
      session_string += "}"*/
      res.send(doc)
    })

    .on('error', function(err) {
      res.sendStatus(404)
    })
});

module.exports = router;
