/**
 * @module api for making API requests to the backend server
 * @description This module provides a set of functions for making API requests to the backend server.
 */

import { CONFIG } from "./config.js";

/**
 * Fetch data from the API
 * @param {string} endpoint - The API endpoint to fetch data from
 * @param {Object} options - The options for the fetch request (e.g. method, headers, body)
 * @returns {Promise} - A promise that resolves to the response data
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);

    if (response.status === 401 || !endpoint.includes("/auth/")) {
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      window.location.href = "/index.html";
      throw new Error("Unauthorized access. Redirecting to login page.");
    }
    const data = await response.json().catch(() => ({})); //en caso que devuelva 204

    if (!response.ok) {
      throw new Error(
        data.message ||
          `An error occurred while fetching data. ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data from API endpoint ${endpoint}:`, error);
    throw error;
  }
};
