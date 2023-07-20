import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const getStaffById = (id,params) => {
  return AxiosAuth.get(Config.API +"/items/staff/"+id, params, undefined);
};

const listAllStaff = (data) => {
  return AxiosAuth.get(Config.API +"/items/staff",data , undefined);
};

const createStaff = (data) => {
  return AxiosAuth.post(Config.API +"/items/staff",data , undefined);
};

const updateStaff = (id,data) => {
  return AxiosAuth.patch(Config.API +"/items/staff/"+id,data , undefined);
};

export default {
  getStaffById,
  listAllStaff,
  createStaff,
  updateStaff
};
