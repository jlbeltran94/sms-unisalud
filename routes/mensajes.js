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

var contador = 0;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('enviar_mensajes', { title: 'Prueba' });
});

router.post('/', function (req, res, next) {
    var body = req.body;
    console.log(body.telefono);
    var destinatarios = body.telefono;
    var destinatariostot = destinatarios.split(', ');
    for (i = 0; i < destinatariostot.length; i++) {
        let destinos = "57" + destinatariostot[i];
        /* ENVIO USANDO NEXMO */
        nexmo.message.sendSms('yo', destinos.toString(), body.mensaje, function (err, data) {
            if (!err) {
                console.log(data);
                contador = contador+1;
            } else {
                console.log(err.message)
            }
        });
        console.log(contador);
        /* FIN NEXMO */

        /*ENVIO USANDO ELIBOM*//*
        elibom.sendMessage(destinos.toString(), body.mensaje, function (err, data) {
            if (!err) {
                console.log(data);
                contador = contador+1;
            } else {
                console.log(err.message)
            }
        });
        /*FIN ENVIO CON ELIBOM*/
    }
    if (contador == destinatariostot.length){
        res.render('enviar_mensajes', { title: 'Prueba' });
    }else{
        res.render('enviar_mensajes', { title: 'ERROR' });
    }
    
});



module.exports = router;