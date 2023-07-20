import AxiosAuth from "../../services/axios-service";
import Config from "../../config";

const loadAllUsers = (params) => {
  return AxiosAuth.get(Config.API + "/users/", params, undefined);
};

const loadUserById = (id, params) => {
  return AxiosAuth.get(Config.API + "/users/" + id, params, undefined);
};

const deleteUser = (id) => {
  return AxiosAuth.delete(Config.API + "/users/" + id);
};
const deleteClient = (id) => {
  return AxiosAuth.delete(Config.API + "/custom/clients/" + id);
};

const loadCurrentLoggedInUser = (params = []) => {
  return AxiosAuth.get(Config.API + "/users/me", params, undefined);
};

const addUser = (data) => {
  return AxiosAuth.post(Config.API + "/users/", JSON.stringify(data), undefined);
};
const inviteUser = (data) => {
  return AxiosAuth.post(Config.API + "/users/invite", JSON.stringify(data), undefined);
};

const updateUser = async (id, data) => {
  return await AxiosAuth.patch(Config.API + "/users/" + id, data, undefined);
};

export default {
  loadAllUsers,
  loadUserById,
  loadCurrentLoggedInUser,
  addUser,
  updateUser,
  inviteUser,
  deleteUser,
  deleteClient
};
