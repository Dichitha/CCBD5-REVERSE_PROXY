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
    console.log(req.get('host'));
    var data = "yeahhhhhhh"
    // const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
    // const data = apiRes.body
    if (req.get('host') === "localhost:5001"){
      function print() {
      res.status(200).send(data);
      }
      setTimeout(print, 0);
    }
    else if(req.get('host') === "localhost:5002"){
      function print() {
        res.status(200).send(data);
        }
        setTimeout(print, 0);
    }
    else if(req.get('host') === "localhost:5003"){
      function print() {
        res.status(200).send(data);
        }
        setTimeout(print, 0);
    }
    // function print() {
    //   res.status(200).send(data);
    // }
    // setTimeout(print, 1500);
    // res.status(200).send(data);
  }
  catch (error) {
    next(error)
  }
})
module.exports = router1
