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
    console.log(url.parse(req.url));
    console.log(req.get('host'));
    //const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
    //const data = apiRes.body

    // function print() {
    //   res.status(200).send(data);
    // }
    // setTimeout(print, 3000);
    //res.status(200).send(data);
    data="yeahhhh"
    res.status(200).send(data);
  }
  catch (error) {
    next(error)
  }
})
module.exports = router1
