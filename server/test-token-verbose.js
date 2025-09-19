const http = require('http');

console.log('Starting token endpoint test...');

const options = {
  hostname: '127.0.0.1',
  port: 4000,
  path: '/api/icd11/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log(`Sending request to ${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Response Status Code: ${res.statusCode}`);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
  
  let rawData = '';
  
  res.on('data', (chunk) => {
    rawData += chunk;
    console.log('Received chunk of data');
  });
  
  res.on('end', () => {
    console.log('Response completed');
    console.log('Raw response:', rawData);
    
    if (res.statusCode === 200) {
      try {
        const parsedData = JSON.parse(rawData);
        console.log('Parsed response:', JSON.stringify(parsedData, null, 2));
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
      }
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('Connection refused - Is the server running on port 4000?');
  }
});

// Add a timeout handler
req.setTimeout(5000, () => {
  console.error('Request timed out after 5 seconds');
  req.destroy();
});

console.log('Sending request...');
req.end();

// Keep the process alive for a moment to see the response
setTimeout(() => {
  console.log('Test completed');
  process.exit(0);
}, 6000);