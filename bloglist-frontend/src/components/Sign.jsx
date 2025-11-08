import { useState } from 'react'
import loginService from '../services/login'
import signupService from '../services/signup'
import blogService from '../services/blogs'
import Notification from './Notification'


const Sign = ({ setUser, setErrorMess, errorMess }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCon, setPasswordCon] = useState('')
  const [isLog, setIsLog] = useState(true)

  const toggleLog = () => {
    setIsLog(!isLog)
    setUsername('')
    setPassword('')
  }

  const logView = { display: isLog? '' : 'none' }
  const signView = { display: isLog? 'none' : '' }



  const handleLogin = async(e) => {
    e.preventDefault()
    try {
      console.log(0)
      const userData = await loginService.login({ username, password })
      console.log(1)
      setUser(userData)
      console.log(2)
      window.localStorage.setItem('loggedUser', JSON.stringify(userData))
      console.log(3)
      blogService.setToken(userData.token)
      console.log(4)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMess('Wrong Credentials')
      setTimeout(() => {
        setErrorMess(null)
      }, 5000)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (username.length < 3 || password.length < 3 || name.length < 3)
    {
      setErrorMess('username/password is too short.')
      setTimeout(() => {
        setErrorMess(null)
      }, 5000)
      return
    }
    if ( password !== passwordCon) {
      setErrorMess('passwords doesn\'t match')
      setTimeout(() => {
        setErrorMess(null)
      }, 5000)
      return
    }
    try {
      await signupService.signup({ username, name, password })
      console.log('new user saved successfully')
      const userData = await loginService.login({ username, password })
      setUser(userData)
      window.localStorage.setItem('loggedUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      setUsername('')
      setPassword('')
    } catch(error) {
      setErrorMess(error.response.data.error || 'something went wrong. please try again')
      setTimeout(() => {
        setErrorMess(null)
      }, 5000)

    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Login Form */}
      <div style={logView} className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Blogs</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Log in
          </button>
        </form>
        <Notification message={errorMess} type='error' />
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{' '}
          <button onClick={toggleLog} className="text-gray-800 hover:underline font-medium">
            Sign up
          </button>
        </p>
      </div>

      {/* Sign-up Form */}
      <div style={signView} className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign up to Blogs</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={passwordCon}
              onChange={(e) => setPasswordCon(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Sign up
          </button>
        </form>
        <Notification message={errorMess} type='error' />
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{' '}
          <button onClick={toggleLog} className="text-gray-800 hover:underline font-medium">
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}

export default Sign