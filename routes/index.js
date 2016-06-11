var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tubebox' });
});

router.post('/session', function(req, res) {
    var playlist = null;
    var db = req.db;
    var collection = db.get('sessions');
    collection.find({code: req.body.id},{},function(e,docs){
        playlist = docs;
        console.log("doc:" + JSON.stringify(playlist[0].music));
        res.render('session', { title: 'Session en cours', playlist: playlist[0].music});
    });
});
         
module.exports = router;
