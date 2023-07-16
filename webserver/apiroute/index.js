const express = require('express');
const router1 = express.Router();
const needle = require('needle');
const url = require('url');

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

let queue1 = 20;
let queue2 = 30;
let queue3 = 10;

router1.get('/', async (req, res, next) => {
  try {
    
    if (queue1 > 0) {
      queue1--;
      console.log('Request added to queue 1');
      console.log('Queue 1 spots left: ', queue1);
      await handleRequest(req, res, next, 5001);
    } else if (queue2 > 0) {
      queue2--;
      console.log('Request added to queue 2');
      console.log('Queue 2 spots left: ', queue2);
      await handleRequest(req, res, next, 5002);
    } else if (queue3 > 0) {
      queue3--;
      console.log('Request added to queue 3');
      console.log('Queue 3 spots left: ', queue3);
      await handleRequest(req, res, next, 5003);
    } else {
      console.log('Request dropped: All queues are full');
      res.status(503).json({ error: 'Service Unavailable' });
    }
  } catch (error) {
    next(error);
  }
});

async function handleRequest(req, res, next, port) {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
    const data = apiRes.body;

    console.log(data);
    res.status(200).json(data);

    switch (port) {
      case 5001:
        queue1++;
        console.log('Request served from queue 1');
        console.log('Queue 1 spots left: ', queue1);
        break;
      case 5002:
        queue2++;
        console.log('Request served from queue 2');
        console.log('Queue 2 spots left: ', queue2);
        break;
      case 5003:
        queue3++;
        console.log('Request served from queue 3');
        console.log('Queue 3 spots left: ', queue3);
        break;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = router1;
