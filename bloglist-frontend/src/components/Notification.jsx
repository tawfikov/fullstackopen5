const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  const baseClasses = 'px-4 py-2 rounded-md mb-4 text-center font-medium w-full max-w-md mx-auto'
  const typeClasses = type === 'error'
    ? 'bg-red-100 text-red-700 border border-red-400'
    : 'bg-green-100 text-green-800 border border-green-400'

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  )
}

export default Notification