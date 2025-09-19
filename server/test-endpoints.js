const axios = require('axios');
const https = require('https');

async function testEndpoint() {
  // Configuration with extended timeout and HTTP keep-alive
  const config = {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true
    })
  };

  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://127.0.0.1:5000/health', config);
    console.log('Health endpoint response:', healthResponse.data);

    console.log('\n2. Testing token endpoint...');
    const tokenResponse = await axios.post('http://127.0.0.1:5000/api/icd11/token', {}, config);
    console.log('Token endpoint response:', tokenResponse.data);

    if (tokenResponse.data.access_token) {
      console.log('\n✅ Successfully received access token');
    } else {
      console.log('\n❌ No access token in response');
    }
  } catch (error) {
    console.error('\nError occurred:');
    if (error.response) {
      // Server responded with error
      console.error('Server responded with status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received from server');
      console.error('Request details:', error.request);
    } else {
      // Error in request setup
      console.error('Error setting up request:', error.message);
    }
  }
}

console.log('Starting endpoint tests...\n');
testEndpoint();