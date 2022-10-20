const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
const fs = require('fs');

var https = require('https');
var privateKey  = fs.readFileSync('127.0.0.1-key.pem', 'utf8');
var certificate = fs.readFileSync('127.0.0.1.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


app.use(express.static(`${__dirname}/dist`));

app.use('/', router);

router.get('*', (req, res, next) => {
  // uncomment the line below to see the file requests on the console

  if (fs.existsSync(`${__dirname}` + req.url+ '.gz')){
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/javascript');
    req.url = req.url + '.gz';
  }
  res.sendFile(`${__dirname}` + req.url);
});

// app.listen(port);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port)
console.log('App listenning on port', port);