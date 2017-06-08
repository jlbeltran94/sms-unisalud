var express = require('express');
var router = express.Router();
/* NEXMO */
var Nexmo = require('nexmo');
var nexmo = new Nexmo({
    apiKey: '7c58869e',
    apiSecret: '36c2c887966fa59e',
});
/* FIN NEXMO */
/* ELIBOM */
var elibom = require('elibom')('jlbeltran94@gmail.com', '9wvW131RZZ')
/* FIN ELIBOM*/
/* CONEXION FIREBIRD */
var Firebird = require('node-firebird');
var options = {};

options.host = '127.0.0.1';
options.port = 3050;
options.database = 'D:/univ/9/UNISALUD.GDB';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys 
options.role = null;            // default 
options.pageSize = 4096;        // default when creating database

/* FIN FIREBIRD*/
var contador = 0;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('mensajes_salud', { title: 'Express' });
});

router.post('/', function (req, res, next) {
    var body = req.body;
    console.log(body);
    var generos = body.Genero;


    /* BUSQUEDA DE USUARIOS SELECCIONADOS */
    Firebird.attach(options, function (err, db) {


        if (err)
            throw err;

        // db = DATABASE 
        db.query('SELECT * FROM PRUEBA2 ', function (err, result) {
            if (result) {
                for (i = 0; i < result.length; i++) {
                    console.log(result[i]);
                    let sexo = false;
                    let niño = false;
                    let adolescente = false;
                    let joven = false;
                    let adulto = false;
                    let adultom = false;
                    if (Array.isArray(generos)) {
                        if (generos.includes(result[i].SEXO)) {
                            console.log('cumple con genero');
                            sexo = true;
                        }
                    } else {
                        if (generos == result[i].SEXO.toString()) {
                            console.log('cumple con genero');
                            sexo = true;
                        }
                    }
                    if (body.Ninos) {                        
                        if ('0' <= result[i].EDAD && result[i].EDAD <= '10') {
                            niño = true;
                            console.log("niños");
                        }
                    }
                    if (body.Adolescentes) {                        
                        if ('11' <= result[i].EDAD && result[i].EDAD <= '17') {
                            adolescente = true;
                            console.log("adolescentes");
                        }
                    }
                    if (body.Jovenes) {                        
                        if ('18' <= result[i].EDAD && result[i].EDAD <= '30') {
                            joven = true;
                            console.log("jovenes");
                        }
                    }
                    if (body.Adultos) {
                        if ('31' <= result[i].EDAD && result[i].EDAD <= '60') {
                            adulto = true;
                            console.log("adultos");
                        }
                    }
                    if (body.Adulto_Mayor) {
                        if ('61' <= result[i].EDAD && result[i].EDAD <= '100') {
                            adultom = true;
                            console.log("adulto mayor");
                        }
                    }
                    if (sexo && (niño || adolescente || joven || adulto || adultom)) {
                        let celular = '57' + result[i].CELULAR;
                        console.log(celular);
                    }

                }
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
    /*FIN BUSQUEDA DE USUARIOS*/
    res.render('mensajes_salud', { title: 'Prueba' });

});

module.exports = router;