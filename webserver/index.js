const express = require('express')
require('dotenv').config()

const app = express()


app.set('trust proxy', 1)


var options = {
  origin: 'http://localhost:8008',
  optionsSuccessStatus: 200 
}

//routes->index.js
app.use((req, res, next) => {
if(options.origin === req.headers.origin){
    next();
}   else {
      res.status(403).json({ error: 'Forbidden' });
    }
});

app.use('/api', require('./routes'))

const ports=[5001,5002,5003]

ports.forEach(function(port) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`))