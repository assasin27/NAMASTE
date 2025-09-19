const http = require('http');

console.log('Testing ICD-11 token endpoint...');

const options = {
  host: '127.0.0.1',
  port: 5000,
  path: '/api/icd11/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log(`Sending request to ${options.method} ${options.host}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    console.log('Received data chunk');
  });

  res.on('end', () => {
    console.log('Response completed');
    try {
      const parsedData = JSON.parse(data);
      console.log('Response:', JSON.stringify(parsedData, null, 2));
      
      // Check if we got a token
      if (parsedData.access_token) {
        console.log('✅ Successfully received access token');
      } else {
        console.log('❌ No access token in response');
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.log('Raw response:', data);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

console.log('Sending request...');
req.end();