declare global {
  interface Window {
    ECT: any;
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

  useEffect(() => {
    let isMounted = true;
    let tokenRefreshInterval: number | null = null;

    async function initializeECT() {
      try {
        console.log("Starting ECT initialization");
        const config = getICD11Config();
        
        // Import dynamically to avoid issues with SSR
        const { testConnectivity, diagnoseNetworkIssue } = await import("../lib/networkTest");
        
        console.log("Testing network connectivity...");
        const connectivityResults = await testConnectivity();
        const failedEndpoints = connectivityResults.filter(r => !r.success);
        
        if (failedEndpoints.length > 0) {
          console.error("Network connectivity test failed:", failedEndpoints);
          
          // Try to diagnose the token endpoint specifically
          const tokenEndpoint = "https://icdaccessmanagement.who.int/connect/token";
          const diagnosis = await diagnoseNetworkIssue(tokenEndpoint);
          
          if (!diagnosis.dnsWorks) {
            throw new Error(`DNS resolution failed for token endpoint: ${diagnosis.error}`);
          }
          
          if (!diagnosis.corsWorks) {
            throw new Error(`CORS preflight failed for token endpoint. Headers: ${JSON.stringify(diagnosis.corsHeaders)}`);
          }
          
          const errorDetails = failedEndpoints.map(r => {
            if ('error' in r) {
              return `${r.url} (Error: ${r.error})`;
            } else {
              return `${r.url} (Status: ${r.status})`;
            }
          }).join(", ");
          
          throw new Error(`Network connectivity failed:\n${errorDetails}`);
        }
        
        console.log("Network connectivity test passed");
        const token = await getICD11AccessToken();
        console.log("Access token obtained successfully");
        
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

  return (
    <div style={{ height: "600px", width: "100%" }}>
      {isLoading && <div style={{ padding: "1em" }}>Loading ICD-11 browser...</div>}
      {error && (
        <div style={{ color: "red", padding: "1em" }}>
          <strong>ICD-11 Browser Error:</strong> {error}
        </div>
      )}
      <div ref={containerRef} style={{ height: "100%", display: isLoading ? "none" : "block" }} />
    </div>
  );
};

export default ICD11Browser;