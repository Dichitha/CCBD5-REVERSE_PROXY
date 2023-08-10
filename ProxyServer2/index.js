const http = require('http');
const axios = require('axios');
const url = require('url');

const Queues = [
  { local_url: 'http://localhost:5001', queueCount: 0, queueMax: 20, avgResponse: 0 },
  { local_url: 'http://localhost:5002', queueCount: 0, queueMax: 20, avgResponse: 0 },
  { local_url: 'http://localhost:5003', queueCount: 0, queueMax: 20, avgResponse: 0 }
];

let count = 0;
let startTime = null;
let endTime = null;
const ALPHA = 0.2;

let hits = 0;
let misses = 0;
let cache =  Array(12);

http.createServer(function (req, res) {
  let finalurl;
  let turn = -1;
  const parsedUrl = url.parse(req.url, true);
  count++;

  if (count === 1) {
    startTime = Date.now();
  }
  // let number = 10
  const localStartTime = Date.now();
  console.log(req.url)
  let number = req.url.split('=')[1]
  console.log("count = ",count)
  console.log("in cachhe ", cache[number%12])
  if(cache[number%12]!=undefined && cache[number%12]["number"]==number)
  {
    hits++;
    console.log(number," present with data ",cache[number%12]);
    res.end();
  }
  else{
    console.log();
  const rtrn_values = queueInsert(parsedUrl);
  turn = rtrn_values.serverturn;
  finalurl = rtrn_values.final_url;
  const req_count = rtrn_values.request_count;

  if (turn !== -1) {
    console.log("inside: ", turn);

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
        console.log("yesss");
        const localEndTime = Date.now() - localStartTime;
        cache[number%12]={number:number,data:result.data.data}
        console.log("in axios = ",cache[number%12]['number'])
        // console.log("in axios = ",number,result.data.data)

        queueRemove(req_count, turn, localEndTime);
        hits++;
        res.end(); 
      })
      .catch(error => {
        console.log(error);
        res.end();
      });
  } else {
    console.log("All the queues are filled: Request dropped");
    misses++;
    res.end(); 
  }
  
}
if (Queues[0].queueCount === 0 && Queues[1].queueCount === 0 && Queues[2].queueCount === 0) {
  endTime = Date.now();
  console.log("Timeeeeeeeeeeeeeeeeeeee: " + (endTime - startTime) + " milliseconds");

  const totalRequests = hits + misses;
  const hitRate = (hits / totalRequests) * 100;
  const missRate = (misses / totalRequests) * 100;
  console.log("Hit Rate: " + hitRate + "%");
  console.log("Miss Rate: " + missRate+ "%");
}


}).listen(9009, () => {
  console.log('HTTP server listening on port 9009');
});

function queueInsert(parsedUrl) {
  let req_count = 0;
  let minAvgResponse = Infinity;
  let selectedServer = -1;

  for (let i = 0; i < Queues.length; i++) {
    if (Queues[i].queueCount < Queues[i].queueMax && Queues[i].avgResponse < minAvgResponse) {
      minAvgResponse = Queues[i].avgResponse;
      selectedServer = i;
      req_count = count;
    }
  }

  if (selectedServer !== -1) {
    Queues[selectedServer].queueCount++;
    console.log("Request " + count + " is sent to Queue " + selectedServer);
    console.log("Queue " + selectedServer + " spots left: " + (Queues[selectedServer].queueMax - Queues[selectedServer].queueCount));
  }

  return {
    serverturn: selectedServer,
    final_url: selectedServer !== -1 ? Queues[selectedServer].local_url + parsedUrl.path : null,
    request_count: req_count
  };
}

function queueRemove(req_count, turn, newTime) {
  if (turn !== -1) {
    Queues[turn].queueCount--;
    Queues[turn].avgResponse = calculateAvgResponseTime(Queues[turn].avgResponse, newTime);
    console.log("Request " + req_count + " served from Queue " + turn);
    console.log("Queue " + turn + " spots left: " + (Queues[turn].queueMax - Queues[turn].queueCount));
    if (Queues[0].queueCount === 0 && Queues[1].queueCount === 0 && Queues[2].queueCount === 0) {
      endTime = Date.now();
      console.log("Timeeeeeeeeeeeeeeeeeeee: " + (endTime - startTime) + " milliseconds");

      const totalRequests = hits + misses;
      const hitRate = (hits / totalRequests) * 100;
      const missRate = (misses / totalRequests) * 100;
      console.log("Hit Rate: " + hitRate + "%");
      console.log("Miss Rate: " + missRate+ "%");
    }
  }
}

function calculateAvgResponseTime(currentAvg, newTime) {
  return ALPHA * newTime + (1 - ALPHA) * currentAvg;
}
