import { useState } from 'react'

const Blog = ({ blog, handleLikes, currentUser, handleDelete }) => {
  const [detailed, setDetailed] = useState(false)

  const whenExpanded = { display: detailed? '' : 'none' }
  const whenCollapsed = { display: detailed? 'none' : '' }

  const hasLiked = blog.likes.some(id => id.toString() === currentUser.id)

  const sameUser = { display: blog.user.id === currentUser.id? '' : 'none' }
  return (
    <>
      <div style={whenCollapsed} className="blog">
        {blog.title} {blog.author}
        <button onClick={() => setDetailed(true)}>view</button>
      </div>
      <div style={whenExpanded} className="blog">
        <div>
          <strong>{blog.title}</strong>
          <button onClick={() => setDetailed(false)}>hide</button>
        </div>
        <div>By {blog.author}</div>
        <div>{blog.url}</div>
        <div>
          {blog.likes?.length ?? 0} people like this
          <button onClick={() => handleLikes(blog)}>{hasLiked? 'Unlike' : 'Like'}</button>
        </div>
        <div>
          {blog.user.name}
          <div style={sameUser} onClick={() => handleDelete(blog)}><button>Remove</button></div>
        </div>
      </div>
    </>
  )
}

export default Blog