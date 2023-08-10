const url = require('url')
const express = require('express')
const router1 = express.Router()
const needle = require('needle')

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE


router1.get('/', async (req, res, next) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    })
    // let number = req.url.path.split[1]
    let number = req.url.split('=')[1]
    // let number = 5;
    console.log(req.url)
    console.log(req.get('host'));
    var data = number*number
    // const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
    // // const data = apiRes.body
    if (req.get('host') === "localhost:5001"){
      function print() {
      // res.send(data);
      res.send({data:data,port:req.get('host')})
      }
      setTimeout(print, 0);
    }
    else if(req.get('host') === "localhost:5002"){
      function print() {
        // res.send(data);
        res.send({data:data,port:req.get('host')})
        }
        setTimeout(print, 0);
    }
    else if(req.get('host') === "localhost:5003"){
      function print() {
        // res.send(data);
        res.send({data:data,port:req.get('host')})
        }
        setTimeout(print, 0);
    }
    // res.send({data:data,port:req.get('host')})
   
  }
  catch (error) {
    next(error)
  }
})
module.exports = router1
