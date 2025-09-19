import { jwtDecode } from 'jwt-decode';

interface ABHAToken {
  sub: string;  // ABHA number
  name: string;
  exp: number;
  iat: number;
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: ABHAToken | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(abhaNumber: string, otp: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abhaNumber,
          otp,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const { token } = await response.json();
      this.token = token;
      this.user = jwtDecode<ABHAToken>(token);

      localStorage.setItem('auth_token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async requestOTP(abhaNumber: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abhaNumber,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('OTP request error:', error);
      return false;
    }
  }

  async verifyABHA(abhaNumber: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-abha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abhaNumber,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('ABHA verification error:', error);
      return false;
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  getUser(): ABHAToken | null {
    if (this.user) {
      return this.user;
    }

    const token = this.getToken();
    if (token) {
      try {
        this.user = jwtDecode<ABHAToken>(token);
        return this.user;
      } catch (error) {
        console.error('Token decode error:', error);
        return null;
      }
    }

    return null;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<ABHAToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
}