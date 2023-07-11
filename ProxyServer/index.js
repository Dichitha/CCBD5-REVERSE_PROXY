var http = require('http');
const axios = require('axios');
var readlineSync = require('readline-sync');
var url=require('url');

var arr = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
var turn = 0;
console.log("outside", turn);

http.createServer(function (req, res) {
  //let city = readlineSync.question('Enter city name: ');
  let parsedUrl = url.parse(req.url, true);
  let city= parsedUrl.query.q;
  let querypart = "/api?q=" + city;
  let finalurl = arr[turn] + querypart;

  let options = {
    headers: {
      'origin': 'http://localhost:8008'
    }
  };

  axios.get(finalurl, options)
    .then(result => {
      console.log(result.data);
      res.setHeader('Content-Type', 'application/json');
      //res.write(JSON.stringify(result.data));
      res.write(JSON.stringify(result.data));
      res.end(); 
    })
    .catch(error => {
      console.log(error);
      res.end();
    });

  turn = (turn + 1) % arr.length;
  console.log("inside", turn);
}).listen(8008, () => {
  console.log('HTTP server listening on port 8008');
});
