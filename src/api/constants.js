// This file contains API constants such as base URLs and social features.

const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = {
  register: `${API_BASE}/auth/register`,
  login: `${API_BASE}/auth/login`,
  createApiKey: `${API_BASE}/auth/create-api-key`,
};

export const API_SOCIAL = {
  posts: `${API_BASE}/social/posts`,
  users: `${API_BASE}/social/profiles`,
};
