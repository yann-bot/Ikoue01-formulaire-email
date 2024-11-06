
//Module 
const express = require('express')
const bodyParser = require('body-parser')
const nodemailer= require('nodemailer')
const { SMTPServer } = require('smtp-server')
const mailserver = require('smtp-server').SMTPServer

//Création du serveur smtp
const monServeur = new SMTPServer({
    authOptional: true,
    onData(stream, session, callback) {
        stream.pipe(process.stdout, callback)
        stream.on('end', callback)
    }
})

//app
const app = express() 
const port = {
    serveur: 1025,
    app: 8000,
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//On utilise une page html statique pour soumettre le formulaire
app.use(express.static('public'))

//Configuration de l'envoi
const Transporter = nodemailer.createTransport({
    host:'localhost',
    port:1025,
    secure:false,
    auth: null,
    tls: {
        rejectUnauthorized: false
    }
})

//Route pour envoyer l'email
app.post('/envoi-mail', (req, res) => {
    const {nom,email,message} = req.body
   
    const parametreMail = {
        from: email,
        to: "defjam@gmail.com",
        subject: `Nouveau message de ${nom}`,
        text: message
    }

    Transporter.sendMail(parametreMail, (error, info) =>{
        if(error) {
            console.log(error)
            res.send(`Erreur lors de l'envoi du mail`);
        }else{
            console.log('Email capturé par le serveur mail:' + info.response )
            res.send('Votre mail a bien été renvoyé')
        }
    })
})

// Démarage des serveurs
monServeur.listen(port['serveur'], () => {
    console.log('Fake SMTP Server démaré sur le port 1025')
} )
app.listen(port['app'], () => {
    console.log(`Serveur démarré sur http://localhost:${port['app']}`);
})