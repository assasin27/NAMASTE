const axios = require('axios');

async function testTokenEndpoint() {
  console.log('Testing ICD-11 token endpoint with axios...');
  
  try {
    console.log('Sending request to http://localhost:5000/api/icd11/token');
    const response = await axios.post('http://localhost:5000/api/icd11/token', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.access_token) {
      console.log('✅ Successfully received access token');
    } else {
      console.log('❌ No access token in response');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTokenEndpoint();