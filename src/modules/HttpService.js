import  axios from "axios";

export const HttpService = {
  get:async function get (url){
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return []
  }
}
}

