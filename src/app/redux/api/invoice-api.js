import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const getInvoiceById = (id,params) => {
  return AxiosAuth.get(Config.API +"/items/invoices/"+id, params, undefined);
};

const listAllInvoices = (data) => {
  return AxiosAuth.get(Config.API +"/items/invoices",data , undefined);
};

const createInvoice = (data) => {
  return AxiosAuth.post(Config.API +"/items/invoices",data , undefined);
};

const updateInvoice = (id,data) => {
  return AxiosAuth.patch(Config.API +"/items/invoices/"+id,data , undefined);
};

export default {
  getInvoiceById,
  listAllInvoices,
  createInvoice,
  updateInvoice
};
