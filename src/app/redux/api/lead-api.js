import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const getLeadById = (id, params) => {
  return AxiosAuth.get(Config.API + "/items/leads/" + id, params, undefined);
};

const listAllLeads = (data) => {
  return AxiosAuth.get(Config.API + "/items/leads", data, undefined);
};

const createLead = (data) => {
  return AxiosAuth.post(Config.API + "/items/leads", data, undefined);
};

const updateLead = (id, data) => {
  return AxiosAuth.patch(Config.API + "/items/leads/" + id, data, undefined);
};

export default {
  getLeadById,
  listAllLeads,
  createLead,
  updateLead
};
