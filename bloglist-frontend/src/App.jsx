import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Form from './components/Form'
import Sign from './components/Sign'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMess, setErrorMess]= useState(null)
  const [successMess, setSuccessMess] = useState(null)
  const [sortBy, setSortBy] = useState('likes')
  const [isVisible, setIsVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const blogsPerPage = 6
  const iOfLast = currentPage * blogsPerPage
  const iOfFirst = iOfLast - blogsPerPage
  const blogSlice = blogs.slice(iOfFirst, iOfLast)



  useEffect(() => {
    if (!user) {
      setBlogs([])
      setSortBy('likes')
      setCurrentPage(1)
      setSearch('')
      setIsVisible(false)
    } else {
      const getBlogs = async () => {
        const blogs = await blogService.getAll()
        const filteredBlogs = search
          ? blogs.filter(blog =>
            blog.title.toLowerCase().includes(search.toLowerCase())
          )
          : blogs
        let sortedBlogs = [...filteredBlogs]
        if (sortBy === 'likes') {
          sortedBlogs.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
        } else if (sortBy === 'recent') {
          sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
        setBlogs(sortedBlogs)
        setCurrentPage(1)
      }
      getBlogs()
    }
  }, [user, sortBy, search])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])





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
    let title = blog.title
    if (window.confirm(`Delete blog ${blog.title}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setSuccessMess(`blog "${title}" removed successfully!`)
      setTimeout(() => setSuccessMess(null), 5000)
    }
  }

  const handleComments = async (blog, comment) => {
    const savedBlog = await blogService.comment(blog.id, comment)
    setBlogs(blogs.map(b => b.id !== blog.id? b : { ...savedBlog }))
  }

  if (user === null) {
    return (
      <div>
        <nav className="bg-gray-800 p-4 text-white flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-wide">Blogs</h1>
          </div>

          <div className="flex items-center gap-2">
          </div>
        </nav>
        <Sign setUser={setUser} setErrorMess={setErrorMess} errorMess={errorMess} />
      </div>
    )}
  return (
    <div>
      <nav className="bg-gray-800 p-4 text-white flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold tracking-wide">Blogs</h1>
          <input
            type="text"
            value={search}
            placeholder="Search by title..."
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-200 px-3 py-1.5 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm w-56 mb-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-300">{user.name} is logged in</span>

          <button
            onClick={() => setIsVisible(true)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            Add Blog
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            Log Out
          </button>
        </div>
      </nav>
      <div>
        <br />
        <Notification message={successMess} type='success' />
        <Notification message={errorMess} type='error' />
        <Form handlePosting={handlePosting} isVisible={isVisible} setIsVisible={setIsVisible}/>
        <br />
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-3 w-fit gap-6">
        <p className="text-gray-700 font-medium">Sort By </p>
        <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600">
          <input className="text-blue-600 focus:ring-blue-500" type="radio" name="sort" value="likes" checked={sortBy==='likes'} onChange={() => setSortBy('likes')}/>
          <span>most likes</span>
        </label>
        <label label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600">
          <input className="text-blue-600 focus:ring-blue-500" type="radio" name="sort" value="recent" checked={sortBy==='recent'} onChange={() => setSortBy('recent')}/>
          <span>most recent</span>
        </label>
      </div>
      <div>
        {blogSlice.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={handleLikes}
            currentUser={user}
            handleDelete={handleDelete}
            handleComments={handleComments}
          />
        )}
      </div>
      <div className="flex justify-center space-x-2 mt-4 mb-4">
        {[...Array(Math.ceil(blogs.length/blogsPerPage))].map((_,i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i+1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App