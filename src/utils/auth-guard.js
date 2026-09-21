import { loadToken } from "./storages.js";

// if the user is not authenticated, redirect to the login page
export function authGuard() {
  if (!loadToken()) {
    window.location.href = "../auth/login.html";
  }
}
