import AxiosLib from "./lib/http-axios-lib";
import UserService from "./../services/user-service";
const _request = (method, url, data, isJson = true, binaryResponse = false) => {
  let options = {
    method: method,
    url: url,
    responseType: binaryResponse ? "blob" : "json",
  };
  if (data && method === "GET") {
    options.params = data;
  } else if (data) {
    options.data = data;
    if (isJson) {
      options.headers = {
        "Content-Type": "application/json",
      };
    } else {
      options.headers = { "Content-Type": "multipart/form-data" };
    }
  }
  return new Promise((resolve, reject) => {
    AxiosLib.request(options)
      .then((response) => {
        let data = response.data;
        if (typeof data != "object" && response.data !== "") {
          data = JSON.parse(data);
        }
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        if (error && error.response && error.response.status) {
          if (error.response.status === 401) {
            UserService.signOut();
            window.location.reload();
          } else if (error.response.status === 403) {
          } else if (error.response.status === 500) {
          }
        } else {
        }

        reject(error);
      });
  });
};

const DataAccessService = {
  get(url, data, isJson = true, binaryResponse = false) {
    return _request("GET", url, data, isJson, binaryResponse);
  },
  post(url, data, isJson = true) {
    return _request("POST", url, data, isJson);
  },
  delete(url) {
    return _request("DELETE", url);
  },
  put(url, data) {
    return _request("PUT", url, data);
  },
  patch(url, data) {
    return _request("PATCH", url, data);
  },
};

export default DataAccessService;
