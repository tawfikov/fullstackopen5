import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Form from './components/Form'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMess, setErrorMess]= useState(null)
  const [successMess, setSuccessMess] = useState(null)


  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll()
      const sortedBlogs = blogs.sort((a, b) => b.likes.length - a.likes.length)
      setBlogs(sortedBlogs)
    }

    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])



  const handleLogin = async(e) => {
    e.preventDefault()
    try {
      const userData = await loginService.login({ username, password })
      setUser(userData)
      window.localStorage.setItem('loggedUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMess('Wrong Credentials')
      setTimeout(() => {
        setErrorMess(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handlePosting = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      console.log(savedBlog)
      setBlogs(blogs.concat({ ...savedBlog, user: { name: user.name, id: user.id } }))
      setSuccessMess(`a new blog "${savedBlog.title}" added successfully!`)
      setTimeout(() => setSuccessMess(null), 5000)
    } catch(error) {
      setErrorMess(error.message)
      setTimeout(() => {
        setErrorMess(null)
      }, 5000)
    }
  }

  const handleLikes = async(blog) => {
    const savedBlog = await blogService.like(blog.id)
    setBlogs(blogs.map(b => b.id !== blog.id? b : { ...savedBlog, user: blog.user }))
  }

  const handleDelete = async(blog) => {
    if (window.confirm(`Delete blog ${blog.title}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Login to the Blog List</h2>
        <Notification message={errorMess} type='error' />
        <form onSubmit={handleLogin}>
          <div>
            <label>Username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></label>
          </div>
          <div>
            <label>Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/></label>
          </div>
          <button>Log in</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <div>
        <h6>{user.name} is logged in</h6>
        <button onClick={handleLogout}>Log out</button>
        <br />
        <Notification message={successMess} type='success' />
        <Notification message={errorMess} type='error' />
        <Form handlePosting={handlePosting}/>
        <br />
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLikes={handleLikes} currentUser={user} handleDelete={handleDelete} />
      )}
    </div>
  )
}

export default App