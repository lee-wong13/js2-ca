// API functions for handling posts
// This module provides functions to interact with the social media API for posts, including fetching, creating, updating, and deleting posts.
// create post, fetch post by ID, update post, delete post

import { API_SOCIAL } from "./constants.js";
import { loadApiKey, loadToken } from "../utils/storages.js";

// Fetch all posts from the API
export async function getPosts() {
  const token = loadToken();

  if (!token) {
    throw new Error("You must be logged in to view posts.");
  }

  const apiKey = loadApiKey();

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(`${API_SOCIAL.posts}?_author=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    const error = json;
    const message = error.errors?.[0]?.message ?? error.error?.[0]?.message;
    throw new Error(`Failed to load posts: ${message ?? response.statusText}`);
  }

  return json.data;
}

// Create a new post
export async function createPost(postData) {
  const token = loadToken();

  if (!token) {
    throw new Error("You must be logged in to create a post.");
  }

  const apiKey = loadApiKey();

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(API_SOCIAL.posts, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  const json = await response.json();

  if (!response.ok) {
    const error = json;
    const message = error.errors?.[0]?.message ?? error.error?.[0]?.message;
    throw new Error(`Failed to create post: ${message ?? response.statusText}`);
  }

  return json.data;
}

// Fetch a single post by its ID
export async function getPostById(postId) {
  const token = loadToken();

  if (!token) {
    throw new Error("You must be logged in to view this post.");
  }

  const apiKey = loadApiKey();

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(`${API_SOCIAL.posts}/${postId}?_author=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    const error = json;
    const message = error.errors?.[0]?.message ?? error.error?.[0]?.message;
    throw new Error(`Failed to load post: ${message ?? response.statusText}`);
  }

  return json.data;
}

// Update an existing post
export async function updatePost(postId, postData) {
  const token = loadToken();

  if (!token) {
    throw new Error("You must be logged in to edit this post.");
  }

  const apiKey = loadApiKey();

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(`${API_SOCIAL.posts}/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  const json = await response.json();

  if (!response.ok) {
    const error = json;
    const message = error.errors?.[0]?.message ?? error.error?.[0]?.message;
    throw new Error(`Failed to update post: ${message ?? response.statusText}`);
  }

  return json.data;
}

// Delete a post by its ID
export async function deletePost(postId) {
  const token = loadToken();

  if (!token) {
    throw new Error("You must be logged in to delete this post.");
  }

  const apiKey = loadApiKey();

  if (!apiKey) {
    throw new Error("No Noroff API key found. Please log in again.");
  }

  const response = await fetch(`${API_SOCIAL.posts}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const json = await response.json();
    const message = json.errors?.[0]?.message ?? json.error?.[0]?.message;
    throw new Error(`Failed to delete post: ${message ?? response.statusText}`);
  }
}
