import { useState } from 'react'

const Form = ({ handlePosting }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [isVisible, setIsVisible] = useState(false)


  const onSubmit = (e) => {
    e.preventDefault()
    handlePosting({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    setIsVisible(false)
  }

  const showWhenVisible = { display: isVisible? '' : 'none' }
  const hideWhenVisible = { display: isVisible? 'none' : '' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setIsVisible(true)}>Add a blog</button>
      </div>
      <div style={showWhenVisible}>
        <h4>Add a new Blog</h4>
        <form onSubmit={onSubmit}>
          <div>
            <label>Title <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          </div>
          <div>
            <label>Author <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}/></label>
          </div>
          <div>
            <label>URL <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}/></label>
          </div>
          <button>Post</button>
        </form>
        <button onClick={() => setIsVisible(false)}>Cancel</button>
      </div>
    </div>
  )
}
export default Form