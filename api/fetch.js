import axios from "axios";

const API_KEY = "44863925-b4b3b9a95a2210feb9f28d1a5";
let page = Math.floor(Math.random() * 20) + 1;
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}&safesearch=true&per_page=25&editors_choice=true`;
const randomapiUrl = `https://pixabay.com/api/?key=${API_KEY}&per_page=25&editors_choice=true&safesearch=true&page=${page}`;

const formatUrl = (params) => {
    let url = apiUrl;
  if (!params) return apiUrl;
  Object.keys(params).map((key) => {
    let value = (key == "q") ? (params[key]) : params[key];
    url += `&${key}=${value}`;
  });

  // console.log(url);

  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatUrl(params));
    return { success: true, data: response?.data };
} catch (e) {
    console.log(e);
    return { success: false, msg: e.message };
  }
};
export const randomFetch = async () => {
  try {
    const response = await axios.get(randomapiUrl);
    return { success: true, data: response?.data };
} catch (e) {
    console.log(e);
    return { success: false, msg: e.message };
  }
};
