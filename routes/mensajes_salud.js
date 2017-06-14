var express = require('express');
var router = express.Router();
/* NEXMO */
var Nexmo = require('nexmo');
var nexmo = new Nexmo({
    apiKey: '7c58869e', //CAMBIAR POR LOS DATOS DE LA CUENTA
    apiSecret: '36c2c887966fa59e',
});
/* FIN NEXMO */
/* ELIBOM */
var elibom = require('elibom')('jlbeltran94@gmail.com', '9wvW131RZZ') //AQUI INGRESAR DATOS CORRESPONDIENTES A LA CUENTA
/* FIN ELIBOM*/
/* CONEXION FIREBIRD */
var Firebird = require('node-firebird');
var options = {};

options.host = '127.0.0.1';
options.port = 3050;
options.database = 'D:/univ/9/UNISALUD2.GDB'; //ARCHIVO BASE DE DATOS
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys 
options.role = null;            // default 
options.pageSize = 4096;        // default when creating database

/* FIN FIREBIRD*/
var contador = 0;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('mensajes_salud', { title: 'Mensajes Saludables' });
});

router.post('/', function (req, res, next) {
    var body = req.body;
    console.log(body);
    var generos = body.Genero;


    /* BUSQUEDA DE USUARIOS */
    Firebird.attach(options, function (err, db) {


        if (err)
            throw err;

        // db = DATABASE 
        db.query('SELECT * FROM DAT_PER ', function (err, result) {
            if (result) {
                console.log("hay resultados");
                for (i = 0; i < result.length; i++) {
                    let sexo = false;
                    let niño = false;
                    let adolescente = false;
                    let joven = false;
                    let adulto = false;
                    let adultom = false;
                    /* verificacion de que el usuario cumpla las caracteristicas deseadas */
                    if (Array.isArray(generos)) {
                        console.log("es array genero");
                        if (generos.includes(result[i].SEX_PAC.toString())) {
                            sexo = true;
                        }
                    } else {
                        console.log("no es array genero");
                        if (generos == result[i].SEX_PAC.toString()) {
                            sexo = true;
                        }
                    }
                    if (body.Ninos) {
                        if ('0' <= result[i].EDA_PAC && result[i].EDA_PAC <= '10') {
                            console.log("el paciente es niño");
                            niño = true;
                        }
                    }
                    if (body.Adolescentes) {
                        if ('11' <= result[i].EDA_PAC && result[i].EDA_PAC <= '17') {
                            console.log("el paciente es adolecente");
                            adolescente = true;
                        }
                    }
                    if (body.Jovenes) {
                        if ('18' <= result[i].EDA_PAC && result[i].EDA_PAC <= '30') {
                            console.log("el paciente es joven");
                            joven = true;
                        }
                    }
                    if (body.Adultos) {
                        if ('31' <= result[i].EDA_PAC && result[i].EDA_PAC <= '60') {
                            console.log("el paciente es adulto");
                            adulto = true;
                        }
                    }
                    if (body.Adulto_Mayor) {
                        if ('61' <= result[i].EDA_PAC && result[i].EDA_PAC <= '100') {
                            console.log("el paciente es adulto mayor");
                            adultom = true;
                        }
                    }
                    /* FIN DE LA VERIFICACION */
                    /* SI CUMPLE LAS CARACTERISTICAS SE ENVIA EL MENSAJE */
                    if (sexo && (niño || adolescente || joven || adulto || adultom)) {
                        let celular = '57' + result[i].CELULAR;
                        console.log(celular);
                        // nexmo.message.sendSms('Unidad de salud', celular, body.mensaje, function (err, data) {
                        //     if (!err) {
                        //         console.log(data);

                        //     } else {
                        //         console.log(err.message)
                        //     }
                        // });

                        // elibom.sendMessage(celular, body.mensaje, function (err, data) {
                        //   if (!err) {
                        //     console.log(data);
                        //   } else {
                        //     console.log(err.message)
                        //   }
                        // });
                    }

                }
            }

            // IMPORTANT: close the connection 
            db.detach();
        });

    });
    /*FIN BUSQUEDA DE USUARIOS*/
    res.render('mensajes_salud', { title: 'Mensajes Saludables' });

});

module.exports = router;