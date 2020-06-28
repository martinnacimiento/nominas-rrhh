import axios from 'axios'

const baseDomain = process.env.baseUrl
const baseURL = `${baseDomain}`

export default axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
