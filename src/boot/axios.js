import Vue from 'vue'
import axios from 'axios'

// axios.defaults.baseURL = 'http://192.168.1.15:8000/api'

axios.defaults.baseURL = process.env.API_URL + '/api/'

Vue.prototype.$axios = axios
// export default axios
