import axios from 'axios'
const baseUrl = '/api/users'

const signup = async (creds) => {
  const response = await axios.post(baseUrl, creds)
  return response.data
}

//const compare = async () => {
// const res = await axios.get(baseUrl)
// return res.data
//}

export default { signup }