const testUrls = [
  {
    url: "http://localhost:5000/api/icd11/token",
    method: "HEAD"
  },
  {
    url: "http://localhost:5000/api/icd11/entity/search",
    method: "HEAD"
  },
  {
    url: "https://icdcdn.who.int/embeddedct/icd11ect-1.7.1.js",
    method: "HEAD"
  },
  {
    url: "https://icdcdn.who.int/embeddedct/icd11ect-1.7.1.css",
    method: "HEAD"
  }
];

async function testEndpoint(config: { url: string; method?: string; headers?: Record<string, string> }) {
  const { url, method = "HEAD", headers = {} } = config;
  console.log(`Testing connectivity to ${url} with method ${method}...`);
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      mode: method === "OPTIONS" ? "cors" : "no-cors",
      cache: "no-cache"
    });

    const result = {
      url,
      status: response.status,
      type: response.type,
      headers: Object.fromEntries([...response.headers.entries()]),
      cors: method === "OPTIONS" ? {
        allowOrigin: response.headers.get("access-control-allow-origin"),
        allowMethods: response.headers.get("access-control-allow-methods"),
        allowHeaders: response.headers.get("access-control-allow-headers")
      } : undefined
    };

    console.log(`${url} test result:`, result);
    return { success: true, ...result };
  } catch (error) {
    const result = {
      url,
      success: false,
      error: error.message,
      type: error.name
    };
    console.error(`Failed to reach ${url}:`, result);
    return result;
  }
}

export async function testConnectivity() {
  const results = await Promise.all(testUrls.map(testEndpoint));
  
  // Test direct token endpoint with minimal request
  const tokenResult = await testTokenEndpoint();
  results.push(tokenResult);

  return results;
}

async function testTokenEndpoint() {
  const clientId = import.meta.env.VITE_ICD11_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_ICD11_SECRET_KEY;
  const tokenUrl = "http://localhost:5000/api/icd11/token";

  try {
    console.log("Testing token endpoint with credentials...");
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "icdapi_access"
    });

    const authHeader = "Basic " + btoa(`${clientId}:${clientSecret}`);
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
        "Accept": "application/json"
      },
      body: body.toString()
    });

    const result = {
      url: tokenUrl,
      status: response.status,
      type: response.type,
      headers: Object.fromEntries([...response.headers.entries()]),
      success: response.ok
    };

    if (!response.ok) {
      try {
        result["error"] = await response.text();
      } catch (e) {
        result["error"] = "Could not read error response";
      }
    }

    console.log("Token endpoint test result:", result);
    return result;
  } catch (error) {
    const result = {
      url: tokenUrl,
      success: false,
      error: error.message,
      type: error.name
    };
    console.error("Token endpoint test failed:", result);
    return result;
  }
}

export function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError &&
    (error.message === "Failed to fetch" ||
     error.message.includes("Network request failed") ||
     error.message.includes("Network error"))
  );
}

export async function diagnoseNetworkIssue(url: string) {
  try {
    // Try DNS resolution via a HEAD request first
    const dnsCheck = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-cache"
    });
    console.log("DNS resolution successful:", dnsCheck.type);

    // If DNS works, try CORS preflight
    const preflightCheck = await fetch(url, {
      method: "OPTIONS",
      headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization,content-type",
        "Origin": window.location.origin
      },
      mode: "cors",
      cache: "no-cache"
    });
    
    return {
      dnsWorks: true,
      corsWorks: preflightCheck.ok,
      corsHeaders: {
        allowOrigin: preflightCheck.headers.get("access-control-allow-origin"),
        allowMethods: preflightCheck.headers.get("access-control-allow-methods"),
        allowHeaders: preflightCheck.headers.get("access-control-allow-headers")
      }
    };
  } catch (error) {
    return {
      dnsWorks: false,
      error: error.message
    };
  }
}