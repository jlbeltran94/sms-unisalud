var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var mensajes = require('./routes/mensajes');
var mensajes_salud = require('./routes/mensajes_salud');

var app = express();

var cron = require('node-cron');
var Firebird = require('node-firebird');
var elibom = require('elibom')('jlbeltran94@gmail.com', '9wvW131RZZ')

/**********************************************************************/
var options = {};

options.host = '127.0.0.1';
options.port = 3050;
options.database = 'D:/univ/9/UNISALUD.GDB';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys 
options.role = null;            // default 
options.pageSize = 4096;        // default when creating database 

Firebird.attach(options, function (err, db) {
  var currentDate = new Date();
  var tomorrow = currentDate.setDate(currentDate.getDate() + 1);
  var date = new Date(tomorrow);
  var fecha = date.toLocaleDateString();
  var fecha2 = fecha.split('-');
  var fecha3 = fecha2[2] + "/" + fecha2[1] + "/" + fecha2[0];
  console.log(fecha3);

  if (err)
    throw err;

  // db = DATABASE 
  db.query('SELECT * FROM PRUEBA WHERE FECHA=?', [fecha3], function (err, result) {

    for (i = 0; i < result.length; i++) {
      console.log(result[i].ID);
      console.log(result[i].FECHA);
      var fechat = result[i].FECHA + '';
      console.log(fechat);
      var fechat2 = fechat.split('T');
      var fecha = fechat2[0];
      console.log(fecha);
    }



    // elibom.sendMessage(result[4].NOMBRE, 'asd', function (err, data) {
    //   if (!err) {
    //     console.log(data);
    //   } else {
    //     console.log(err.message)
    //   }
    // });
    // IMPORTANT: close the connection 
    db.detach();
  });

});
/**********************************************************************/

var task = cron.schedule('0 18 * * *', function () {
  console.log('immediately started');
}, false);

task.start();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/mensajes', mensajes);
app.use('/mensajes_salud', mensajes_salud);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
