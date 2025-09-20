require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Create Express app
const app = express();

// Debug logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Add response logging
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] Response:`, data);
    return oldSend.apply(res, arguments);
  };
  
  next();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Enable CORS for our frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Proxy endpoint for token
// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/icd11/token', async (req, res) => {
  try {
    console.log('Token request received');
    const clientId = process.env.ICD11_CLIENT_ID || process.env.VITE_ICD11_CLIENT_ID;
    const clientSecret = process.env.ICD11_SECRET_KEY || process.env.VITE_ICD11_SECRET_KEY;
    
    console.log('Client ID available:', !!clientId);
    console.log('Client Secret available:', !!clientSecret);
    const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'icdapi_access'
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: body.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token request failed:', error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy for ICD11 API requests
app.get('/api/icd11/entity', async (req, res) => {
  try {
    const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const fullUrl = `https://id.who.int/icd/release/11/entity${queryString}`;
    
    console.log(`Proxying request to: ${fullUrl}`);
    
    // Get token for authorization
    const clientId = process.env.ICD11_CLIENT_ID || process.env.VITE_ICD11_CLIENT_ID;
    const clientSecret = process.env.ICD11_SECRET_KEY || process.env.VITE_ICD11_SECRET_KEY;
    
    // Get token
    const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';
    const tokenBody = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'icdapi_access'
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: tokenBody.toString()
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token request failed:', error);
      return res.status(tokenResponse.status).json({ error });
    }

    const tokenData = await tokenResponse.json();
    
    // Forward the request to ICD API with the token
    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': req.headers.accept || 'application/json',
        'Accept-Language': req.headers['accept-language'] || 'en',
        'API-Version': req.headers['api-version'] || 'v2'
      }
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.text();
      console.error('ICD API request failed:', error);
      return res.status(apiResponse.status).json({ error });
    }

    const contentType = apiResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await apiResponse.json();
      res.json(data);
    } else {
      const text = await apiResponse.text();
      res.set('Content-Type', contentType || 'text/plain');
      res.send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy for ICD11 search
app.get('/api/icd11/search', async (req, res) => {
  try {
    const query = req.query.q;
    const linearization = req.query.linearization || 'mms';
    const release = req.query.release || '2023-01';
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    
    const fullUrl = `https://id.who.int/icd/release/11/entity/search?q=${encodeURIComponent(query)}&linearization=${linearization}&release=${release}`;
    console.log(`Proxying search request to: ${fullUrl}`);
    
    // Get token for authorization
    const clientId = process.env.ICD11_CLIENT_ID || process.env.VITE_ICD11_CLIENT_ID;
    const clientSecret = process.env.ICD11_SECRET_KEY || process.env.VITE_ICD11_SECRET_KEY;
    
    console.log('Search endpoint - Client ID available:', !!clientId);
    console.log('Search endpoint - Client Secret available:', !!clientSecret);
    
    // Get token
    const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';
    const tokenBody = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'icdapi_access'
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: tokenBody.toString()
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token request failed:', error);
      return res.status(tokenResponse.status).json({ error });
    }

    const tokenData = await tokenResponse.json();
    
    // Forward the search request to ICD API with the token
    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'API-Version': 'v2'
      }
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.text();
      console.error('ICD API search request failed:', error);
      return res.status(apiResponse.status).json({ error });
    }

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/icd11/token');
  console.log('  GET  /api/icd11/entity/*');
  console.log('  GET  /api/icd11/search');
});