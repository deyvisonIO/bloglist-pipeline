require("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URL: MONGODB_URL } = require('./utils/config')
const middleware = require("./utils/middleware")
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


app.use(express.static("dist"));

mongoose.connect(MONGODB_URL).then(() => {
  console.log("Database connected!")
}).catch((error) => {
  console.log(error)
  console.log("Failed to connect to database!")
})

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === "test") {
  console.log("testing evironment")
  const testingRouter = require("./controllers/testing")
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)


module.exports = app;

