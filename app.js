var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mensajes = require('./routes/mensajes');
var mensajes_salud = require('./routes/mensajes_salud');

var app = express();

var cron = require('node-cron');
var Firebird = require('node-firebird');
var elibom = require('elibom')('jlbeltran94@gmail.com', '9wvW131RZZ')
/* NEXMO */
var Nexmo = require('nexmo');
var nexmo = new Nexmo({
  apiKey: '7c58869e',
  apiSecret: '36c2c887966fa59e',
});
/* FIN NEXMO */

/***************************CONFIGURACION DE LA BASE DE DATOS*******************************************/
var options = {};

options.host = '127.0.0.1'; //IP del host
options.port = 3050; //puerto de conexion
options.database = 'D:/univ/9/UNISALUD2.GDB';//archivo base de datos al cual se conecta
options.user = 'SYSDBA'; //nombre de usuario
options.password = 'masterkey'; //contraseña
options.lowercase_keys = false; // set to true to lowercase keys 
options.role = null;            // default 
options.pageSize = 4096;        // default when creating database 


/************************CONFIGURACION PARA QUE SEA AUTOMATICO**********************************************/
                  //  # ┌────────────── segundos (opcional)
                  //  # │ ┌──────────── minuto
                  //  # │ │ ┌────────── hora
                  //  # │ │ │ ┌──────── dia del mes
                  //  # │ │ │ │ ┌────── me
                  //  # │ │ │ │ │ ┌──── dia de la semana
                  //  # │ │ │ │ │ │
                  //  # │ │ │ │ │ │
                  //  # * * * * * *
var task = cron.schedule('0 7 * * 1-5', function () { 
  //el recordatorio de citas se realizara automaticamente de lunes a viernes a las 7 am 
  // mas informacion => https://crontab.guru/#0_7_*_*_1-5 
  /************************/
  
/************************FECHA DE MAÑANA**********************************************/
  var currentDate = new Date();
  var tomorrow = currentDate.setDate(currentDate.getDate() + 1);
  var date = new Date(tomorrow);
  var fecha = date.toLocaleDateString();
  var fecha2 = fecha.split('-');
  var fecha3 = fecha2[1] + "/" + fecha2[2] + "/" + fecha2[0]; //fecha de mañana
  console.log(fecha3);
  Firebird.attach(options, function (err, db) {

    if (err)
      throw err;

    // consulta a la base de datos
    db.query("SELECT CITAS.ID_PACIENTE, CITAS.FECHA_CITA, CITAS.HORA_CITA, coalesce(DAT_PER.NM1_PAC,' ') ||' '||coalesce(DAT_PER.NM2_PAC,'')||' '||coalesce(DAT_PER.AP1_PAC,'')||' '||coalesce(DAT_PER.AP2_PAC,'') \"PACIENTE\", DAT_PER.CELULAR,CONCEPTO_CITA.DESCRIPCION AS MOTIVO FROM CITAS JOIN DAT_PER ON DAT_PER.ID_PACIENTE = CITAS.ID_PACIENTE JOIN CONCEPTO_CITA ON CONCEPTO_CITA.ID = CITAS.ID_CONCEPTO WHERE CITAS.FECHA_CITA = ? AND CITAS.FECHA_ANULA IS NULL AND CITAS.ID_PACIENTE <> -1", [fecha3], function (err, result) {
      if (result) {
        for (i = 0; i < result.length; i++) {
          var celular = '57' + result[i].CELULAR;
          //parseo de la hora, para pasar de formato 24h a 12h
          var horadb = result[i].HORA_CITA;
          var horadb2 = horadb + '';
          var horasplit = horadb2.split(' ');
          var horadots = horasplit[4].split(':');
          if (horadots[0] >= 12) {
            var horas = horadots[0] - 12;
            var h12 = 'pm';
            if (horas == 0) {
              var horas = 12;
            }
          } else {
            var horas = horadots[0] - 0;
            var h12 = 'am';
          }
          var minutos = horadots[1];
          var hora = horas + ':' + minutos + ' ' + h12;
          //mensaje predeterminado que sera enviado para recordar la cita
          var mensaje = "La Unidad de salud te recuerda que tu cita está programada para manana a las " + hora + " , si no puedes asistir por favor cancélala.";
          console.log(mensaje);

          //***********enviar mensaje *******/

          // elibom.sendMessage(celular, mensaje, function (err, data) {
          //   if (!err) {
          //     console.log(data);
          //   } else {
          //     console.log(err.message)
          //   }
          // });
          // nexmo.message.sendSms('Unidad de salud', celular, mensaje, function (err, data) {
          //   if (!err) {
          //     console.log(data);
          //   } else {
          //     console.log(err.message)
          //   }
          // });

        }

        // IMPORTANT: close the connection
      }
      db.detach();
    });

  });
  /***********************/
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

app.use('/', mensajes);
app.use('/mensajes_salud', mensajes_salud);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
