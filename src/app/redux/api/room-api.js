import AxiosAuth from "../../services/axios-service";
import Config from "../../config";


const getRoomById = (id,params) => {
  return AxiosAuth.get(Config.API +"/items/rooms/"+id, params, undefined);
};

const listAllRooms = (data) => {
  return AxiosAuth.get(Config.API +"/items/rooms",data , undefined);
};

const createRoom = (data) => {
  return AxiosAuth.post(Config.API +"/items/rooms",data , undefined);
};

const updateRoom = (id,data) => {
  return AxiosAuth.patch(Config.API +"/items/rooms/"+id,data , undefined);
};

const cloneRoom = (id) => {
  return AxiosAuth.post(Config.API +"/custom/rooms/clone/"+id,undefined , undefined);
};
const deleteRoom = (id) => {
  return AxiosAuth.delete(Config.API +"/items/rooms/"+id,undefined , undefined);
};

export default {
  getRoomById,
  listAllRooms,
  createRoom,
  updateRoom,
  cloneRoom,
  deleteRoom
};
