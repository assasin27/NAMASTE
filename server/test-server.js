const http = require('http');

const options = {
  host: '127.0.0.1',
  port: 5000,
  path: '/health',
  method: 'GET'
};

console.log('Testing connection to proxy server...');
console.log(`Requesting: http://${options.host}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.end();