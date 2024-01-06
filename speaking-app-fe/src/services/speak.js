import HttpClient from "../utils/HttpClient"

export const send = async (path, payload, options = {}) => {
  const client = new HttpClient()
  const { data } = await client.post(path, payload, options)

  return data
}
