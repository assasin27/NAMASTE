import { getICD11Config } from '../config';

interface ICD11Token {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface ICD11Entity {
  id: string;
  title: {
    "@language": string;
    "@value": string;
  };
  definition?: {
    "@language": string;
    "@value": string;
  };
}

export class ICD11API {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    const config = getICD11Config();
    this.baseUrl = config.apiUrl;
  }

  private async ensureToken(): Promise<string> {
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    const config = getICD11Config();
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: config.scope,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to obtain ICD-11 token');
    }

    const tokenData: ICD11Token = await tokenResponse.json();
    this.token = tokenData.access_token;
    this.tokenExpiry = new Date(Date.now() + tokenData.expires_in * 1000);
    return this.token;
  }

  async searchTerm(query: string, language = 'en'): Promise<ICD11Entity[]> {
    const token = await this.ensureToken();
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}&language=${language}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'API-Version': 'v2',
      },
    });

    if (!response.ok) {
      throw new Error('ICD-11 search failed');
    }

    return response.json();
  }

  async getEntity(id: string, language = 'en'): Promise<ICD11Entity> {
    const token = await this.ensureToken();
    const response = await fetch(`${this.baseUrl}/entity/${id}?language=${language}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'API-Version': 'v2',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ICD-11 entity');
    }

    return response.json();
  }

  async getLinearization(id: string, linearizationType = 'mms'): Promise<any> {
    const token = await this.ensureToken();
    const response = await fetch(`${this.baseUrl}/linearization/${linearizationType}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'API-Version': 'v2',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ICD-11 linearization');
    }

    return response.json();
  }
}