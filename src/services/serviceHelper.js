import axios from "axios";
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  config.withCredentials = true;
  return config;
});

/**
 * 
 * @param {*} response
 *
 */
const onGlobalSuccess = (response) => {
  
  return response.data;
};

const onGlobalError = (err) => {
  return Promise.reject(err);
};

const API_HOST_PREFIX = process.env.REACT_APP_API_HOST_PREFIX;
const API_NODE_HOST_PREFIX = process.env.REACT_APP_API_NODE_HOST_PREFIX;

console.log("API_HOST_PREFIX", API_HOST_PREFIX);



export {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
  API_NODE_HOST_PREFIX,
};