var express = require('express');
var router = express.Router();
/* NEXMO */
var Nexmo = require('nexmo');
var nexmo = new Nexmo({
    apiKey: '7c58869e',//DATOS DE LA CUENTA
    apiSecret: '36c2c887966fa59e',
});
/* FIN NEXMO */
/* ELIBOM */
var elibom = require('elibom')('jlbeltran94@gmail.com', '9wvW131RZZ')//DATOS DE LA CUENTA 
/* FIN ELIBOM*/

var contador = 0;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('enviar_mensajes', { title: 'Envio de Mensajes'});
});

router.post('/', function (req, res, next) {
    var body = req.body;
    console.log(body.telefono);
    var destinatarios = body.telefono;
    var destinatariostot = destinatarios.split(', ');// se parsea los destinatarios para añadir el codigo internacional de colombia
    for (i = 0; i < destinatariostot.length; i++) {
        let destinos = "57" + destinatariostot[i];
        /* ENVIO USANDO NEXMO */
        nexmo.message.sendSms('Unidad de Salud', destinos.toString(), body.mensaje, function (err, data) {
            if (!err) {
                console.log(data);                
            } else {
                console.log(err.message)
            }
        });        
        /* FIN NEXMO */

        /*ENVIO USANDO ELIBOM*//*
        elibom.sendMessage(destinos.toString(), body.mensaje, function (err, data) {
            if (!err) {
                console.log(data);                
            } else {
                console.log(err.message)
            }
        });
        /*FIN ENVIO CON ELIBOM*/
    }

    res.render('enviar_mensajes', { title: 'Envio de Mensajes'});


});



module.exports = router;