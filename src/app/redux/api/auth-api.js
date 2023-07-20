import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const login = (data) => {
  return AxiosAuth.post(Config.API + "/auth/login", data, undefined);
};

const requestPassword = async (data) => {
  await AxiosAuth.post(Config.API + "/auth/password/request", data, undefined);
};

const resetPassword = async (data) => {
  await AxiosAuth.post(Config.API + "/auth/password/reset", data, undefined);
};

const me = async (access_token) => {
  return await AxiosAuth.get(Config.API + "/users/me?access_token=" + access_token, undefined, undefined);
};

export default {
  login,
  requestPassword,
  resetPassword,
  me
};
