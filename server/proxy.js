require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Import routes
const importRoutes = require('./routes/importRoutes');

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

// Mount import routes
app.use('/api/import', importRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

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
    const clientId = process.env.VITE_ICD11_CLIENT_ID;
    const clientSecret = process.env.VITE_ICD11_SECRET_KEY;
    
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

const PORT = 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/icd11/token');
});