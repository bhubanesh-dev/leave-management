import axios from "axios";

const login = (email: string, password: string) =>
  axios.post(
    "/auth/login",
    { email, password },
    {
      withCredentials: true,
    }
  );

const logout = () =>
  axios.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );

const changePassword = (newPassword: string) =>
  axios.post("auth/change-password", {newPassword}, { withCredentials: true });

const authApi = { login, logout, changePassword };

export default authApi;
