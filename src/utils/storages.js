// Utility functions for handling local storage operations

const TOKEN_KEY = "access_token";
const API_KEY_STORAGE_KEY = "api_key";
const PROFILE_KEY = "profile";

export function saveSession(token, profile) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveApiKey(apiKey) {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function loadApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function loadProfile() {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}
