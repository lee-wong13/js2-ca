// API functions for authentication

import { API_AUTH } from "./constants.js";
import { loadToken } from "../utils/storages.js";

function getApiErrorMessage(json, fallback) {
  return json.errors?.[0]?.message ?? json.error?.[0]?.message ?? fallback;
}

//error handling for authentication API requests
export function handleAuthError(response) {
  if (!response.ok) {
    throw new Error(
      `Authentication API request failed with status ${response.status}`,
    );
  }
  return response;
}

// registration API request
export async function registerUser(userData) {
  const response = await fetch(API_AUTH.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const json = await response.json();
  if (!response.ok) {
    const message = getApiErrorMessage(json, response.statusText);
    throw new Error(`Registration failed: ${message} (${response.status})`);
  }
  return json;
}

// login API request
export async function loginUser(credentials) {
  const response = await fetch(API_AUTH.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const json = await response.json();
  if (!response.ok) {
    const message = getApiErrorMessage(json, response.statusText);
    throw new Error(`Login failed: ${message} (${response.status})`);
  }
  return json;
}

// Create API key request
export async function createApiKey() {
  const response = await fetch(API_AUTH.createApiKey, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${loadToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "COMMONS" }),
  });
  const json = await response.json();
  if (!response.ok) {
    const message = getApiErrorMessage(json, response.statusText);
    throw new Error(
      `Create API key request failed: ${message} (${response.status})`,
    );
  }
  return json;
}
