export const AUTH_REQUEST = "a_req";
export const AUTH_SUCCESS = "a_suc";
export const AUTH_ERROR = "a_err";
export const AUTH_LOGOUT = "a_logout";
export const AUTH_URL = "api/admin/auth";
export const AUTH_CHECK = "api/admin/status";

export const USER_REQUEST = "u_req";
export const ADMIN_MODE_CHANGE = "adm_change";
export const ADMIN_MODE_SWAP = "adm_swap";

export const THEME_CHANGE = "th_ch";
export const RESIZE = "w_rsz";

export const myLoginRoutine = (user, axios) =>
  new Promise((resolve, reject) => {
    return axios
      .post(AUTH_URL, user)
      .then(res => {
        localStorage.setItem("user-token", res.data.token);
        resolve(res);
      })
      .catch(err => {
        localStorage.removeItem("user-token");
        reject(err);
      });
  });
