require("dotenv").config();
const User = require('../models/user')
const jwt = require('jsonwebtoken');

function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token invalid'})
  } else if (err.name === 'TokenExpiredError') {
    return res.status(400).json({ error: 'token expired'})
  }

  next(err)
}

function tokenExtractor(request, response, next) {
  const auth = request.get("Authorization");

  request.token = null; 

  if(auth && auth.startsWith("Bearer ")) {
    request.token = auth.replace("Bearer ", "");
  } 

  next(); 
}

async function userExtractor(request, response, next) {
  const token = request.token;


  if(token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    request.user = await User.findById(decodedToken.id);
  }

  next();
}



module.exports = { errorHandler, tokenExtractor, userExtractor }
