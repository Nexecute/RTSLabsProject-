import axios from "axios";

let getHackerNews = (page, hitsPerPage) => {
  const config = {
    method: "GET",
    url: `http://hn.algolia.com/api/v1/search?tags=front_page&page=${page}&hitsPerPage=${hitsPerPage}`,
    withCredentials: false,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

let getSearchNews = (search, page, hitsPerPage) => {
  const config = {
    method: "GET",
    url: `http://hn.algolia.com/api/v1/search?query=${search}&tags=story&page=${page}&hitsPerPage=${hitsPerPage}`,
    withCredentials: false,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export { getHackerNews, getSearchNews };
