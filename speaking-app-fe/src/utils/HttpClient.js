import axios from 'axios';
import { aws4Interceptor } from "aws4-axios";
import { AxiosHeaders } from 'axios';
import { AWS_SERVICE } from '../constants/aws-service';

const interceptor = aws4Interceptor({
  options: {
    region: import.meta.env.VITE_ACCOUNT_REGION,
    service: AWS_SERVICE.EXECUTE_API,
  },
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_ACCOUNT_SECRET,
  },
});

/**
 * Utility class for HTTP client
 */
class HttpClient {
  constructor () {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_LAMBDA_URL,
      timeout: 30000
    })
    // Request interceptor to sign the request
    this.axiosInstance.interceptors.request.use(interceptor);

    this.axiosInstance.interceptors.request.use(config => {
      config.headers['content-type'] = 'application/json;charset=UTF-8'
      const newHeaders = new AxiosHeaders({ ...config.headers })
      config.headers = newHeaders
      
      return config
    });
  }

  /**
   * For post requests
   * @param {*} path the path of the endpoint
   * @param {*} payload the request body
   * @param {*} options additional options
   * @returns Promise<Response>
   */
  async post (path, payload, options = {}) {
    const instance = this.axiosInstance
    return await instance.post(path, payload, options)
  }
}

export default HttpClient
