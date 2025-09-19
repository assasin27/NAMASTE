const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testToken() {
    try {
        const response = await fetch('http://localhost:3000/api/icd11/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testToken();