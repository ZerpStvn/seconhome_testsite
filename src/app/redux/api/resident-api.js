import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const getResidentById = (id,params) => {
  return AxiosAuth.get(Config.API +"/items/residents/"+id, params, undefined);
};

const listAllResidents = (data) => {
  return AxiosAuth.get(Config.API +"/items/residents",data , undefined);
};

const createResident = (data) => {
  return AxiosAuth.post(Config.API +"/items/residents",data , undefined);
};

const updateResident = (id,data) => {
  return AxiosAuth.patch(Config.API +"/items/residents/"+id,data , undefined);
};

export default {
  getResidentById,
  listAllResidents,
  createResident,
  updateResident
};
