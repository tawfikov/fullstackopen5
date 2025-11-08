import { useState } from 'react'

const Form = ({ handlePosting, isVisible, setIsVisible }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const onSubmit = (e) => {
    e.preventDefault()
    handlePosting({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    setIsVisible(false)
  }

  const showWhenVisible = { display: isVisible? '' : 'none' }
  //const hideWhenVisible = { display: isVisible? 'none' : '' }

  return (
    <div>
      <div style={showWhenVisible} className='"bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-md mx-auto'>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Add a new Blog</h4>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-gray-700 text-sm font-medium mb-1">Title
            <input className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="block text-gray-700 text-sm font-medium mb-1">Author
            <input className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={author} onChange={(e) => setAuthor(e.target.value)}/></label>
          <label className="block text-gray-700 text-sm font-medium mb-1">URL
            <input className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={url} onChange={(e) => setUrl(e.target.value)}/></label>
          <div className="flex justify-end gap-3 pt-2">
            <button className='bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-md'>Post</button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-md" type='button' onClick={() => setIsVisible(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Form