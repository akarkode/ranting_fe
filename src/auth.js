import Cookies from "js-cookie";

export function getToken() {
  return Cookies.get("access_token");
}

export function setToken(token) {
  Cookies.set("access_token", token);
}

export function clearToken() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
}
