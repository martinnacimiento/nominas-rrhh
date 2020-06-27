import axios from 'axios'

const baseDomain = 'http://192.168.1.4:3000'
const baseURL = `${baseDomain}`

export default axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
