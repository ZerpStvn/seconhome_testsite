import AxiosAuth from "../../services/axios-service";
import Config from "../../config";

const getLeadClientById = async (id, params) => {
  return await AxiosAuth.get(
    Config.API + "/items/lead_clients/" + id,
    params,
    undefined
  );
};

const listAllLeadClients = async (data) => {
  return await AxiosAuth.get(Config.API + "/items/lead_clients", data, undefined);
};

const createLeadClient = (data) => {
  return AxiosAuth.post(Config.API + "/items/lead_clients", data, undefined);
};

const createLeadClientMessage = (data) => {
  return AxiosAuth.post(Config.API + "/items/client_messages", data, undefined);
};

const updateLeadClient = (id, data) => {
  return AxiosAuth.patch(
    Config.API + "/items/lead_clients/" + id,
    data,
    undefined
  );
};


const createEmailTemplate = (data) => {
  return AxiosAuth.post(Config.API + "/items/email_templates", data, undefined);
};

const updateEmailTemplate = (id, data) => {
  return AxiosAuth.patch(Config.API + "/items/email_templates/" + id, data, undefined);
};

const deleteEmailTemplate = (id) => {
  return AxiosAuth.delete(Config.API + "/items/email_templates/" + id);
};

const getEmailTemplate = () => {
  return AxiosAuth.get(Config.API + "/items/email_templates");
};


const getRoomListing = async (data) => {
  return await AxiosAuth.post(Config.API + "/custom/homes/searchRoom", data, undefined);
};

const sendMessage = (data, id) => {
  return AxiosAuth.post(Config.API + "/custom/clients/send_email/" + id, data);
};


export default {
  getLeadClientById,
  listAllLeadClients,
  createLeadClient,
  updateLeadClient, getRoomListing,
  sendMessage,
  createLeadClientMessage, createEmailTemplate, getEmailTemplate, updateEmailTemplate, deleteEmailTemplate
};
