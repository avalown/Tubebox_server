var express = require('express')
var http = require('http')
var path = require('path')
//var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var swig = require('swig')
//var bson = require('bson')
var monk = require('monk')
var mongo = require('mongodb')
var db = monk('localhost:27017/tubebox')

var routes = require('./routes/index')
var users = require('./routes/users')

var app = express()
var server = app.listen(8767, "0.0.0.0")
var io = require('socket.io').listen(server)

io.on('connection', function (socket) {

    // Finds in the DB and sends the session corresponding to the session code
    // Sends {} is the session doesn't exist
    socket.on('session', function (code) {
      console.log("Ask for session " + code)
      var promise = db.get("sessions").findOne({ "code": code })
      promise.on('success', function (session) {
        var res = "{";
        for(var i = 0; i < session.music.length; ++i) {
          res += "\"" + i.toString() + "\" : \"" + session.music[i] + "\""
          if(i < session.music.length - 1)
            res += ", "
        }
        res += "}"
        console.log(res)
        socket.emit('session', res)
      })
      promise.on('error', function(err) {
        socket.emit("{}")
      })
    })
});

// view engine setup
// utilisation du moteur de swig pour les .html
//app.engine('html', swig.renderFile);
// utiliser le moteur de template pour les .html
//app.set('view engine', 'html');
// dossier des vues
app.set('views', path.join(__dirname, 'views'));

// view cache
app.set('view cache', false); // désactivation du cache express
swig.setDefaults({ cache: false }); // désactivation du cache swig

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Enable Cross-Domain origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
