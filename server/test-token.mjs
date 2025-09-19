import fetch from 'node-fetch';

async function testToken() {
    try {
        console.log('Testing token endpoint...');
        const response = await fetch('http://localhost:3000/api/icd11/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const text = await response.text();
            console.error('Error response:', text);
            return;
        }
        
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testToken();