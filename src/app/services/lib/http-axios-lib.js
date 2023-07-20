import axios from "axios";
import Config from "../../config";
import { authHeader } from "../auth-header";

const instance = () => {
  let headers = authHeader();

  var item = axios.create({
    baseURL: Config._API,
    headers: headers,
    transformResponse: [
      function (data) {
        return data;
      },
    ],
    validateStatus: function (status) {
      if (status === 403) {
        return;
        //request login
        // window.history.push("/login");
        // window.location.href = window.location.pathname
      }
      return status >= 200 && status < 300; // default
    },
  });
  return item;
};

export default {
  request(options) {
    return instance().request(options);
  },
};
