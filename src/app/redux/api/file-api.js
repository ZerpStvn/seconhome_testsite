import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const uploadFile = async (params) => {
  const formData = new FormData();
  formData.append('title', params.name);
  formData.append('file', params.originFileObj);

  return await  AxiosAuth.post(Config.API +"/files", formData, undefined);
};

const importFile = (params) => {

};

export default {
  uploadFile,
  importFile
};
