import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(() => JSON.parse(window.localStorage.getItem("user"))); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  function submitLogin(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    if(!username || !password) {
      return;
    }

    const userData = loginService.login(username, password)
    userData.then(data => data.error ? changeErrorMessage(data.error) : addUser(data));

  }

  function addUser(user) {
    console.log(user)
    window.localStorage.setItem("user", JSON.stringify(user));
    setUser(user)
  }

  function logoutUser() {
    window.localStorage.removeItem("user");
    setUser(null)
  }

  function submitBlog(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const author = formData.get("author");
    const url = formData.get("url");

    if(!title || !author || !url) {
      return;
    }

    const userData = blogService.create(title, author, url, user.token);
    userData.then(data => data.error ? changeErrorMessage(data.error) : addBlog(data));

  }
  
  function addBlog(newBlog) {
    changeSuccessMessage("Blog created!");
    setBlogs(prev => prev.concat(newBlog))
  }

  function handleBlogRemoval(id, title, author) {
    if(!confirm(`Remove blog ${title} by ${author}`)) return;

    const blogData = blogService.remove(id, user.token);
    blogData.then(data => data.error ? changeErrorMessage(data.error) : removeBlog(data))
  }

  function removeBlog(removedBlog) {
    setBlogs(prev => prev.filter(blog => blog.id !== removedBlog.id))
  }
  
  function likeBlog(id, likes) {
    if(!id) return;

    const newBlogData = blogService.addLike(id, likes+1, user.token);
    newBlogData.then(data => data.error ? changeErrorMessage(data.error) : updateBlog(data));
  }

  function updateBlog(newBlog) {
    setBlogs(prev => prev.map(blog => blog.id == newBlog.id ? newBlog : blog))
  }


  function changeErrorMessage(message) {
    if(successMessage) {
      setSuccessMessage("");
    }

    setErrorMessage(message)

    setTimeout(() => setErrorMessage(""), 5000)
  }


  function changeSuccessMessage(message) {
    if(errorMessage) {
      setErrorMessage("")
    }

    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  if(!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage.length > 0 ? 
          <p className="message error">{errorMessage}</p>
          : null
        }
        <form onSubmit={submitLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input id="username" name="username" type="text" placeholder="Type your username"/>
          </div> 
          <div>
            <label htmlFor="password">password</label>
            <input id="password" name="password" type="password" placeholder="Type your password"/>
          </div> 
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.username} logged in 
        <button onClick={logoutUser}>logout</button>
      </p>
      {errorMessage.length > 0 ? 
        <p className="message error">{errorMessage}</p>
        : null
      }
      {successMessage.length > 0 ? 
        <p className="message success">{successMessage}</p>
        : null
      }
      <Togglable buttonLabel="create">
        <BlogForm submitBlog={submitBlog}/>
      </Togglable>
      <div className="blogs" style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
        {blogs.length > 0 ? blogs.sort((a,b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} handleBlogRemoval={handleBlogRemoval} username={user.username} />
        ): <p>No blogs to show</p>}
      </div>
    </div>
  )
}

export default App
