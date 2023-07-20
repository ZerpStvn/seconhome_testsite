import AxiosAuth from "../../services/axios-service";
import Config from "../../config";

const getById = (id, params) => {
  return AxiosAuth.get(Config.API + "/items/homes/" + id, params, undefined);
};

const listAll = (data) => {
  return AxiosAuth.get(Config.API + "/items/homes", data, undefined);
};

const createHome = (data) => {
  return AxiosAuth.post(Config.API + "/items/homes", data, undefined);
};

const updateHome = (id, data) => {
  return AxiosAuth.patch(Config.API + "/items/homes/" + id, data, undefined);
};
const deleteHome = (id) => {
  return AxiosAuth.delete(
    Config.API + "/items/homes/" + id,
    undefined,
    undefined
  );
};
const cloneHome = async (id, data) => {
  return await AxiosAuth.post(
    Config.API + "/custom/homes/clone/" + id,
    data,
    undefined
  );
};
const search = async (data) => {
  return await AxiosAuth.post(
    Config.API + "/custom/homes/search",
    data,
    undefined
  );
};
export default {
  getById,
  listAll,
  createHome,
  updateHome,
  deleteHome,
  cloneHome,
  search,
};
