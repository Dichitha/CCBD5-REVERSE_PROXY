var http = require('http');
const axios = require('axios');
var url=require('url');

//var arr = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
//var indexes = -1;


var Queues = [
  {local_url : 'http://localhost:5001', queueCount : 0, queueMax : 20},
  {local_url : 'http://localhost:5002', queueCount : 0, queueMax : 30},
  {local_url : 'http://localhost:5003', queueCount : 0, queueMax : 10}
];

let count = 0;

http.createServer(function (req, res) {
  var finalurl;
  var turn = -1;
  const startTime=Date.now()
  let parsedUrl = url.parse(req.url, true);
  count++;
  
  var rtrn_values = queueInsert(turn,parsedUrl);
  turn = rtrn_values.serverturn;
  finalurl = rtrn_values.final_url;
  var req_count = rtrn_values.request_count;
  
  if(turn !== -1){
  console.log("inside: ",turn);

  let options = {
    headers: {
      'origin': 'http://localhost:9009',
    }
  };

  axios.get(finalurl, options)
    .then(result => {
      // console.log(result.data);
      // res.setHeader('Content-Type', 'application/json');
      // res.write(JSON.stringify(result.data));
      console.log("yesss");
      const endTime=Date.now() - startTime;
      console.log("Time taken to execute: "+endTime+" milliseconds");
      queueRemove(req_count, turn);
      res.end();
    })
    .catch(error => {
      console.log(error);
      res.end();
    });
  }
  else{
    console.log("All the queues are filled: Request dropped");
  }
  
}).listen(9009, () => {
  console.log('HTTP server listening on port 9009');
});

function queueInsert(turn, parsedUrl){
  var req_count = 0;
  for(let i = 0; i < Queues.length; i++){
    if(Queues[i].queueCount < Queues[i].queueMax){
      Queues[i].queueCount++;
      console.log("Request "+count+" is sent to Queue "+i);
      console.log("Queue "+i+" spots left: "+(Queues[i].queueMax-Queues[i].queueCount));
      req_count = count;
      turn = i;
      finalurl = Queues[i].local_url + parsedUrl.path;
      break;
    }
  }
    return {
      serverturn : turn,
      final_url : finalurl,
      request_count : req_count
  }
}

function queueRemove(req_count, turn){
  Queues[turn].queueCount--;
  console.log("Request "+req_count+" served from Queue ", turn);
  console.log("Queue "+turn+" spots left: ", (Queues[turn].queueMax-Queues[turn].queueCount));
}


