const express = require('express');
require('dotenv').config();
var url = require('url');
const app = express();
var server_port;
var http = require('http');
app.set('trust proxy', 1);

var options = {
  origin: 'http://localhost:9009',
  optionsSuccessStatus: 200
};

app.use((req, res, next) => {
  if (options.origin === req.headers.origin) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

app.use('/api', require('./apiroute'));

const ports = [5001, 5002, 5003];

ports.forEach(function (port) { 
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
