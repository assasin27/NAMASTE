const clientId = '8839379d-ac66-4ed0-a673-6b8509f6f3b0_1efcc11e-d720-4ca3-a2e0-6ab606179a0e';
const clientSecret = 'ao1rzFhtFj/0ZpnIa6WO00gun8MUSEKAXJuI6iE05hk=';
const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';

(async () => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'icdapi_access'
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: body.toString()
  });

  if (!response.ok) {
    console.error('Failed to get ICD-11 access token');
    process.exit(1);
  }

  const data = await response.json();
  console.log('ICD-11 Access Token:', data.access_token);
})();
