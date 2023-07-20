import { Types } from "../constants/auth-types";
import API from "../api/auth-api";
import Config from "../../config";
import UserService from "./../../services/user-service";

export function signOut() {
  return async function (dispatch, getState) {
    try {
      UserService.signOut();
      dispatch({
        type: Types.LOG_OUT,
        payload: true,
      });
      window.location = window.location.origin;
    } catch (e) { }
  };
}


export function signin(email, password) {
  return async function (dispatch, _getState) {
    try {
      let data = {
        email: email,
        password: password,
      };
      let loginData = await API.login(data);
      if (loginData != null) {
        try {
          let user = await API.me(loginData.data.access_token);
          // user.data.redirect = "/";
          if (user.data.role !== Config.userId.lead_client) {
            if (user.data.role) {
              user.data.redirect = Config.userRoleTypes[user.data.role].url;
            }
            if (user.data != null) {
              UserService.setUserData(user.data);
              UserService.setAccessToken(loginData.data.access_token);
              UserService.setRefreshToken(loginData.data.refresh_token);
              UserService.setTokenExpiryTime(loginData.data.expires);
            }
            dispatch({
              type: Types.CURRENT_LOGGED_IN_USER,
              payload: {
                user: user.data,
                token: loginData.data.access_token,
                isLoggedIn: true,
              },
            });
            return user.data;
          }
          else { }
          return { error: "Invalid email / password!" };

        } catch (e) {
          console.log(e);
        }
      } else {
        dispatch({
          type: Types.LOGIN_FAIL,
        });
        return { error: "Error logging in. Please try again!" };
      }
    } catch (e) {
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.status &&
        e.response.data.status === 401
      ) {
        return { error: "Invalid email / password!" };
      } else {
        return { error: "Invalid email / password!" };
      }
    }
  };
}

export async function requestPassword(Data) {
  await API.requestPassword(Data);
}
export async function resetPassword(Data) {
  await API.resetPassword(Data);
}

