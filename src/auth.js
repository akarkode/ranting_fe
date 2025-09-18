import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const isLocalhost = window.location.hostname === "localhost";

const cookieOptions = {
  secure: !isLocalhost,
  sameSite: "Strict",
  path: "/",
};

export function getToken() {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
}

export function setToken(token, refreshToken = null) {
  if (token) {
    Cookies.set(ACCESS_TOKEN_KEY, token, { ...cookieOptions });
  }
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { ...cookieOptions });
  }
}

export function clearToken() {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
}

export function isLoggedIn() {
  return !!getToken();
}
