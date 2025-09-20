interface ICD11Config {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  apiUrl: string;
  scope: string;
}

const icd11Config: ICD11Config = {
  clientId: import.meta.env.VITE_ICD11_CLIENT_ID,
  clientSecret: import.meta.env.VITE_ICD11_SECRET_KEY,
  tokenUrl: "http://localhost:5000/api/icd11/token",  // Local proxy endpoint
  apiUrl: "http://localhost:5000/api/icd11",  // Proxy URL for ICD API
  scope: "icdapi_access",
};

export function getICD11Config(): ICD11Config {
  const { clientId, clientSecret } = icd11Config;
  
  if (!clientId || !clientSecret) {
    throw new Error(
      "ICD-11 API credentials not found. Please check your environment variables."
    );
  }

  return icd11Config;
}

export function validateICD11Config() {
  const config = getICD11Config();
  const missingKeys: string[] = [];

  (Object.keys(config) as Array<keyof ICD11Config>).forEach((key) => {
    if (!config[key]) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required ICD-11 configuration: ${missingKeys.join(", ")}`
    );
  }
}