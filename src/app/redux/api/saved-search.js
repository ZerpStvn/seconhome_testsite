import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const savedSearch = (data) => {
    return AxiosAuth.get(Config.API + "/items/saved_serches", data, undefined);
};

const deleteSavedSearch = (id) => {
    return AxiosAuth.delete(Config.API + "/items/saved_serches/" + id, undefined, undefined);
};
export default {
    savedSearch,
    deleteSavedSearch
};
