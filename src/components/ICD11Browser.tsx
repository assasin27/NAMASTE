declare global {
  interface Window {
    ECT: any;
    lastRetryTimestamp?: number;
  }
}

import React, { useEffect, useRef, useState } from "react";
import { getICD11AccessToken } from "../lib/icd11Api";
import { getICD11Config } from "../lib/config";

const ICD11Browser = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let tokenRefreshInterval: number | null = null;

    async function initializeECT() {
      try {
        console.log("Starting ECT initialization");
        const config = getICD11Config();
        
        // Skip network connectivity tests since we're using a proxy server
        console.log("Using proxy server for API requests");
        
        // Get access token through proxy with better error handling
        let token;
        try {
          token = await getICD11AccessToken();
          console.log("Access token obtained successfully");
        } catch (tokenError) {
          console.error("Token retrieval error:", tokenError);
          throw new Error(`Unable to connect to ICD-11 API: ${tokenError instanceof Error ? tokenError.message : 'Authentication failed'}`);
        }
        
        if (!token) {
          throw new Error("Failed to obtain access token from the server. Please try again later.");
        }
        
        if (!isMounted) return;

        function tryInitECT() {
          console.log("Attempting to initialize ECT browser");
          
          if (!containerRef.current || !window.ECT) {
            const error = "ECT library not loaded. Please check your internet connection and CDN script.";
            console.error(error, {
              containerExists: !!containerRef.current,
              ectExists: !!window.ECT
            });
            setError(error);
            return;
          }

          if (typeof window.ECT.Handler !== "function") {
            const error = "ECT library loaded, but Handler is not a function. Available keys: " + Object.keys(window.ECT).join(", ");
            console.error(error, {
              ectKeys: Object.keys(window.ECT),
              handlerType: typeof window.ECT.Handler
            });
            setError(error);
            return;
          }

          try {
            console.log("Creating ECT browser instance");
            console.log("Creating ECT browser with token:", token.substring(0, 10) + "...");
            console.log("API URL:", config.apiUrl);
            
            const ectBrowser = new window.ECT.Handler({
              container: containerRef.current,
              apiServerUrl: config.apiUrl,
              apiToken: token,
              language: ["en"],
              popupMode: false,
              enableClipboard: true,
              enableMultiLanguage: false,
              browserAdvancedSearchAvailable: true,
              browserHierarchyAvailable: true,
              includeDiagnosticCriteria: true,
              showLinearization: "mms",
              releaseId: "2023-01",
              useBrowserToken: true,
              onError: (error) => {
                console.error("ECT Browser error:", error);
                setError(`ECT Browser error: ${error.message || JSON.stringify(error)}`);
              }
            });

            // Set up token refresh (every 50 minutes to be safe)
            tokenRefreshInterval = window.setInterval(async () => {
              try {
                const newToken = await getICD11AccessToken();
                ectBrowser.updateToken(newToken);
              } catch (err) {
                console.error("Failed to refresh token:", err);
              }
            }, 50 * 60 * 1000);
            if (isMounted) {
              setIsLoading(false);
            }
          } catch (err) {
            if (isMounted) {
              setError("Failed to initialize ECT browser: " + (err instanceof Error ? err.message : String(err)));
              setIsLoading(false);
            }
          }
        }

        if (!window.ECT) {
          const interval = setInterval(() => {
            if (window.ECT && isMounted) {
              clearInterval(interval);
              tryInitECT();
            }
          }, 200);

          setTimeout(() => {
            clearInterval(interval);
            if (!window.ECT && isMounted) {
              setError("Failed to load ECT library after 10 seconds");
              setIsLoading(false);
            }
          }, 10000);
        } else {
          tryInitECT();
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to initialize ICD-11 browser: " + (err instanceof Error ? err.message : String(err)));
          setIsLoading(false);
        }
      }
    }

    initializeECT();

    // Retry initialization if it fails (up to 3 times)
    if (retryCount < 3) {
      initializeECT().catch((err) => {
        console.error("ECT initialization failed:", err);
        if (isMounted) {
          setRetryCount(prev => prev + 1);
          setTimeout(initializeECT, 2000); // Retry after 2 seconds
        }
      });
    }

    return () => {
      isMounted = false;
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setIsRetrying(true);
    
    // Reset retry count if it's been more than 5 minutes since last retry
    const now = Date.now();
    if (now - (window.lastRetryTimestamp || 0) > 5 * 60 * 1000) {
      setRetryCount(0);
    }
    window.lastRetryTimestamp = now;
    
    // Force re-run of the useEffect
    setRetryCount(prev => prev + 1);
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      {isLoading && (
        <div style={{ padding: "1em" }}>
          {isRetrying ? "Retrying connection to ICD-11..." : "Loading ICD-11 browser..."}
        </div>
      )}
      {error && (
        <div style={{ 
          color: "red", 
          padding: "1em", 
          backgroundColor: "#fff8f8", 
          border: "1px solid #ffcdd2",
          borderRadius: "4px",
          marginBottom: "1em"
        }}>
          <strong>ICD-11 Browser Error:</strong> {error}
          <div style={{ marginTop: "1em" }}>
            <button 
              onClick={handleRetry}
              style={{
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ height: "100%", display: isLoading || error ? "none" : "block" }} />
    </div>
  );
};

export default ICD11Browser;