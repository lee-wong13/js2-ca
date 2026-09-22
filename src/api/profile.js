// This file contains the API functions for interacting with user profiles.

import { API_SOCIAL } from "./constants.js";
import { loadApiKey, loadToken } from "../utils/storages.js";

export async function getProfile(username) {
  const token = loadToken();
  const apiKey = loadApiKey();

  if (!token) {
    throw new Error("You must be logged in to view a profile.");
  }

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(
    `${API_SOCIAL.users}/${encodeURIComponent(
      username,
    )}?_posts=true&_following=true&_followers=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    },
  );

  const json = await response.json();

  if (!response.ok) {
    const error = json;
    const message = error.errors?.[0]?.message ?? error.error?.[0]?.message;
    throw new Error(
      `Failed to load profile: ${message ?? response.statusText}`,
    );
  }

  return json.data;
}

export async function updateProfile(username, profileData) {
  const token = loadToken();
  const apiKey = loadApiKey();

  if (!token) {
    throw new Error("You must be logged in to edit your profile.");
  }

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(
    `${API_SOCIAL.users}/${encodeURIComponent(username)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    const error = json;
    const message = error.errors?.[0]?.message ?? error.error?.[0]?.message;
    throw new Error(
      `Failed to update profile: ${message ?? response.statusText}`,
    );
  }

  return json.data;
}

async function updateFollowStatus(username, action) {
  const token = loadToken();
  const apiKey = loadApiKey();

  if (!token) {
    throw new Error("You must be logged in to follow profiles.");
  }

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(
    `${API_SOCIAL.users}/${encodeURIComponent(username)}/${action}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    },
  );

  if (!response.ok) {
    const json = await response.json();
    const message = json.errors?.[0]?.message ?? json.error?.[0]?.message;
    throw new Error(
      `Failed to ${action} profile: ${message ?? response.statusText}`,
    );
  }
}

export function followUser(username) {
  return updateFollowStatus(username, "follow");
}

export function unfollowUser(username) {
  return updateFollowStatus(username, "unfollow");
}
