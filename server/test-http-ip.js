const http = require('http');

const options = {
  hostname: '127.0.0.1', // Using IP address instead of localhost
  port: 4000,
  path: '/api/icd11/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Connection': 'close' // Force connection to close after request
  }
};

console.log('Sending request to proxy server at http://127.0.0.1:4000/api/icd11/token');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('Response:', data);
      process.exit(0);
    } catch (error) {
      console.error('Error parsing response:', error);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

req.end();