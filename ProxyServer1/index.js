var http = require('http');
const axios = require('axios');
var url=require('url');

//var arr = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
//var indexes = -1;

//Considering  'runtime server capacity' as a parameter 

var requests_dropped=new Array();
var requests_picked=new Array();

var Queues = [
  {local_url : 'http://localhost:5001', queueCount : 0, queueMax : 20},
  {local_url : 'http://localhost:5002', queueCount : 0, queueMax : 30},
  {local_url : 'http://localhost:5003', queueCount : 0, queueMax : 10}
];

let count = 0;
let startTime = null;
let endTime = null;


http.createServer(function (req, res) {
  var finalurl;
  var turn = 0;
  let parsedUrl = url.parse(req.url, true);
  count++;

  if (count === 1) {
    // If it's the first request, store the start time
    startTime = Date.now();
  }
  
  
  var rtrn_values = queueInsert(turn, parsedUrl);
  turn = rtrn_values.serverturn;
  var finalurl = rtrn_values.final_url;
  var req_count = rtrn_values.request_count;

  
  if(turn !== -1){
  requests_picked.push(req_count);
  console.log("inside: ",turn);

  let options = {
    headers: {
      'origin': 'http://localhost:9009',
    }
  };

  axios.get(finalurl, options)
    .then(result => {
      console.log(result.data);
      // res.setHeader('Content-Type', 'application/json');
      // res.write(JSON.stringify(result.data));
      console.log("From Proxy Server");
      queueRemove(req_count, turn);
      res.end();
    })
    .catch(error => {
      console.log(error);
      res.end();
    });
  }
  else{
    requests_dropped.push(count);
    console.log("All the queues are filled: Request dropped");
  }
  
}).listen(9009, () => {
  console.log('HTTP server listening on port 9009');
});

function queueInsert(turn, parsedUrl){
  var req_count = 0;
  turn = (count-1) % Queues.length;
  if(Queues[turn].queueCount < Queues[turn].queueMax){
      Queues[turn].queueCount++;
      console.log("Request "+count+" is sent to Queue "+turn);
      console.log("Queue "+turn+" spots left: "+(Queues[turn].queueMax-Queues[turn].queueCount));
      req_count = count;
      finalurl = Queues[turn].local_url + parsedUrl.path;

      return {
        serverturn : turn,
        final_url : finalurl,
        request_count : req_count
    }
  }
  else{
    turn = -1;
    return {
      serverturn : turn,
      final_url : finalurl,
      request_count : req_count
  }
  }
  
}

function queueRemove(req_count, turn){
  Queues[turn].queueCount--;
  console.log("Request "+req_count+" served from Queue ", turn);
  console.log("Queue "+turn+" spots left: ", (Queues[turn].queueMax-Queues[turn].queueCount));
  if(Queues[0].queueCount === 0 && Queues[1].queueCount === 0 && Queues[2].queueCount === 0){
    endTime = Date.now();
    console.log("Timeeeeeeeeeeeeeeeeeeee: "+(endTime-startTime)+"milliseconds");
    for(let i = 0; i < requests_picked.length ; i++){
      console.log("request picked: ",requests_picked[i]);
    }
    for(let i = 0; i < requests_dropped.length ; i++){
      console.log("request dropped: ",requests_dropped[i]);
    }
  }
}


