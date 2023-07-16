  var http = require('http');
  const axios = require('axios');
  var url=require('url');

  var arr = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003'];
  var indexes = -1;
  var turn;


  //function for roundrobin algorithm
  // function roundrobin() {
    //indexes  = (indexes + 1) % arr.length;
  //   return indexes;
  // }

  http.createServer(function (req, res) {
    var finalurl
    const startTime=Date.now()
    //indexes = (indexes + 1) % arr.length;
    let parsedUrl = url.parse(req.url, true);
    //console.log("getgafaf: ",parsedUrl);
    // let city= parsedUrl.query.q;
    var querypart = parsedUrl.pathname;
    
    //var algo=1;
  
    
    //switch case for algorithms
    // switch(algo) {
    //   case 1:
    //     // code block
    //     turn = roundrobin();

    //     break;
    //   default:
    //     console.log("@lgorthim does not exist");
    // }
    
    //switch case based on querypart
    switch(querypart){
      case '/api':
        console.log('in api case');
        finalurl = arr[0] + parsedUrl.path;
        console.log(finalurl);
        turn = 0;
        break;
      case '/json':
        console.log('in json case');
        finalurl = arr[1] + parsedUrl.path;
        console.log(finalurl);
        turn = 1
        break;
    }

    // let finalurl = arr[turn] + querypart;
    console.log("inside: ",turn);

    let options = {
      headers: {
        'origin': 'http://localhost:9000',
        // 'destination' : arr[turn]
      }
      
    };

    
    axios.get(finalurl, options)
      .then(result => {
        console.log(result.data);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(result.data));
        const endTime=Date.now() - startTime;
        console.log("Time taken to execute: "+endTime+" milliseconds");
        res.end(); 
      })
      .catch(error => {
        console.log(error);
        res.end();
      });
    

    
  }).listen(9000, () => {
    console.log('HTTP server listening on port 9000');
  });



