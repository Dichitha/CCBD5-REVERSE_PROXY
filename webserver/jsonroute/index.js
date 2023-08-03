const express = require('express')
const router2 = express.Router()


const data=[
    {"name": "John", "age": 25, "city": "New York"},
    {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925},
    {"country": "United States", "population": 331002651, "capital": "Washington, D.C."},
    {"brand": "Apple", "model": "iPhone 12", "color": "Pacific Blue"},
    {"username": "jdoe", "email": "jdoe@example.com", "password": "secretpass123"},
    {"product": "Coffee Maker", "price": 39.99, "available": true},
    {"name": "Emily", "age": 30, "city": "Los Angeles"},
    {"title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960},
    {"country": "Canada", "population": 38005238, "capital": "Ottawa"},
    {"brand": "Samsung", "model": "Galaxy S21", "color": "Phantom Black"},
    {"username": "asmith", "email": "asmith@example.com", "password": "secure1234"},
    {"product": "Bluetooth Speaker", "price": 29.99, "available": true},
    {"name": "Michael", "age": 35, "city": "Chicago"},
    {"title": "1984", "author": "George Orwell", "year": 1949},
    {"country": "United Kingdom", "population": 67886011, "capital": "London"}
  ]

router2.get('/', (req, res, next) => {
    try{
        res.status(200).json(data)
    }
    catch(error){
        next(error)
    }
})

module.exports = router2
