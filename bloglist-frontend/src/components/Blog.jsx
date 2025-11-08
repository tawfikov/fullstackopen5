import { useState } from 'react'

const Blog = ({ blog, handleLikes, currentUser, handleDelete, handleComments }) => {
  const [detailed, setDetailed] = useState(false)
  const [comment, setComment] = useState('')

  const whenExpanded = { display: detailed? '' : 'none' }
  const whenCollapsed = { display: detailed? 'none' : '' }

  const hasLiked = blog.likes.some(id => id.toString() === currentUser.id)

  const sameUser = { display: blog.user.id === currentUser.id? '' : 'none' }

  const onSubmit = (e) => {
    e.preventDefault()
    handleComments(blog, comment)
    setComment('')
  }
  return (
    <>
      <div style={whenCollapsed} className="blog bg-white shadow-md rounded-xl p-4 flex justify-between items-center border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
          <p className="text-gray-600 text-sm">by {blog.author}</p>
        </div>
        <button className="text-gray-700 hover:text-gray-900 font-medium" onClick={() => setDetailed(true)}>view</button>
      </div>
      <div style={whenExpanded} className="blogExp bg-white shadow-lg rounded-xl p-5 space-y-3 border border-gray-200 mt-3 transition-all duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{blog.title}</h2>
            <p className="text-gray-600 text-sm">by {blog.author}</p>
          </div>
          <button
            onClick={() => setDetailed(false)}
            className="text-sm text-gray-500 hover:text-red-500 font-medium"
          >
          Hide
          </button>
        </div>
        <div className="text-gray-700 wrap-break-word">
          <a href={blog.url.startsWith('http') ? blog.url : `https://${blog.url}`} target="_blank" className="text-gray-800 hover:underline" rel="noopener noreferrer">
            Read article →
          </a>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-gray-700">{blog.likes?.length ?? 0} people like this</p>
          <button
            onClick={() => handleLikes(blog)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              hasLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } transition-colors`}
          >
            {hasLiked ? 'Unlike' : 'Like'}
          </button>
        </div>
        <div className="text-gray-600 text-sm">
          <p>
            Created by <strong>{blog.user.name}</strong> on{' '}
            {new Date(blog.date).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
          <div style={sameUser}>
            <button
              onClick={() => handleDelete(blog)}
              className="mt-1 text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors"
            >
              Post
            </button>
          </form>
        </div>
        <div>
          <h6 className="font-semibold text-gray-800">Comments</h6>
          {blog.comments && blog.comments.length > 0 ? (
            <div className="space-y-2 mt-1">
              {blog.comments.map((c, i) => (
                <div
                  key={i}
                  className="comment bg-gray-50 rounded-md p-2 border border-gray-200"
                >
                  <p className="text-sm">
                    <strong>{c.user.name}:</strong> {c.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.date).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-1">No comments yet.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Blog