import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async (newObject) => {

  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async(id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.patch(`${baseUrl}/${id}/like`, {} , config)
  return response.data
}

const remove = async(id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, setToken, create, like, remove }