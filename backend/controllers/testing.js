const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})


testingRouter.post('/reset-blogs', async (request, response) => {
  await Blog.deleteMany({})

  response.status(204).end()
})


testingRouter.post('/reset-users', async (request, response) => {
  await User.deleteMany({})

  response.status(204).end()
})

testingRouter.post('/create-blog', async (request, response) => {
  const body = request.body

  const user = new User({
    name: 'test2',
    username: 'test2',
    password: 'test2'
  })
  const addedUser = await user.save()

  console.log(body)

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    user: addedUser._id
  })

  await blog.save()

  response.status(202).end()
})

testingRouter.post('/create-multiple-blogs', async (request, response) => {
  const user = await User.findOne({})
  const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 1,
      user: user._id
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 2,
      user: user._id
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 3,
      user: user._id
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 4,
      user: user._id
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 5,
      user: user._id
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 6,
      user: user._id
    },
  ];


  for(const blog of initialBlogs) {
    await Blog.create(blog)
  }

  response.status(202).end() 
})

module.exports = testingRouter;
