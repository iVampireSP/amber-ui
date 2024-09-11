import axios from 'axios'

import { request, response } from "./httpInterceptors";

axios.interceptors.request.use(request.onFulfilled, request.onRejected)
axios.interceptors.response.use(response.onFulfilled, response.onRejected)

// axios.defaults.adapter = window.axiosHttpAdapter

export default axios
