const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const fs = require('fs');
const https = require('https');
var helmet = require('helmet');

require('dotenv').config();

const app = express();

var allowedOrigins = ['http://localhost:8100',
                      '<you_url>'];

app.use(helmet());

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  // Certificate
  const privateKey = fs.readFileSync(process.env.PRIVATEKEY_PATH, 'utf8');
  const certificate = fs.readFileSync(process.env.CERTIFICATE_PATH, 'utf8');
  const ca = fs.readFileSync(process.env.CHAIN_PATH, 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  
  https
  .createServer(
    credentials,
    app
    )
    .listen(process.env.PORT, process.env.HOST, function () {
      console.log('Server is running in production mode');
    });
  } else {
    app.listen(process.env.PORT, process.env.HOST, function () {
      console.log('Server is running in development mode');
  });
}
