import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const getLeadContactById = (id,params) => {
  return AxiosAuth.get(Config.API +"/items/lead_contacts/"+id, params, undefined);
};

const listAllLeadContacts = (data) => {
  return AxiosAuth.get(Config.API +"/items/lead_contacts",data , undefined);
};

const createLeadContact = (data) => {
  return AxiosAuth.post(Config.API +"/items/lead_contacts",data , undefined);
};

const updateLeadContact = (id,data) => {
  return AxiosAuth.patch(Config.API +"/items/lead_contacts/"+id,data , undefined);
};

export default {
  getLeadContactById,
  listAllLeadContacts,
  createLeadContact,
  updateLeadContact
};
