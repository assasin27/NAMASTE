
import { getICD11Config, validateICD11Config } from "./config";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getICD11AccessToken() {
  // Return cached token if it's still valid (with 5-minute buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    console.log("Using cached token");
    return cachedToken;
  }

  try {
    console.log("Validating ICD-11 config...");
    validateICD11Config();
    const config = getICD11Config();
    console.log("Config validated successfully");

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: config.scope
    });

    const authHeader = "Basic " + btoa(`${config.clientId}:${config.clientSecret}`);
    console.log("Requesting token from:", config.tokenUrl);
    console.log("Using client ID:", config.clientId);
    
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
        "Accept": "application/json"
      },
      body: body.toString()
    }).catch(error => {
      console.error("Network error during token request:", error);
      throw new Error(`Network error during token request: ${error.message}`);
    });

    console.log("Token response status:", response.status);
    console.log("Token response headers:", [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token request failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to get ICD-11 access token: ${response.status} ${errorText}`);
    }

    const data: TokenResponse = await response.json();
    console.log("Token received successfully");
    
    // Cache the token and set expiry
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    console.log("Token cached, expires in:", data.expires_in, "seconds");
    
    return data.access_token;
  } catch (error) {
    console.error("ICD-11 token error:", error);
    throw error;
  }
}

export async function fetchICD11Codes(query: string) {
  try {
    console.log("Fetching ICD-11 codes for query:", query);
    const config = getICD11Config();
    
    // Get a fresh token for the request
    const token = await getICD11AccessToken();
    
    // Using the proxy endpoint for search
    const endpoint = `${config.apiUrl}/search?q=${encodeURIComponent(query)}&linearization=mms&release=2023-01`;
    console.log("Making request to endpoint:", endpoint);

    const headers = {
      "Accept": "application/json",
      "Accept-Language": "en",
      "Authorization": `Bearer ${token}`
    };
    console.log("Request headers:", headers);

    const response = await fetch(endpoint, { headers }).catch(error => {
      console.error("Network error during ICD-11 search:", error);
      throw new Error(`Network error during ICD-11 search: ${error.message}`);
    });

    console.log("Search response status:", response.status);
    console.log("Search response headers:", [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ICD-11 search failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        endpoint,
        headers
      });
      throw new Error(`Failed to fetch ICD-11 codes: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Search results received:", {
      resultCount: data.destinationEntities?.length ?? 0
    });
    return data;
  } catch (error) {
    console.error("ICD-11 search error:", error);
    throw error;
  }
}
