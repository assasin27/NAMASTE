// Script to test ICD-11 API token generation
const clientId = '8839379d-ac66-4ed0-a673-6b8509f6f3b0_1efcc11e-d720-4ca3-a2e0-6ab606179a0e';
const clientSecret = 'ao1rzFhtFj/0ZpnIa6WO00gun8MUSEKAXJuI6iE05hk=';

async function testToken() {
  try {
    const tokenUrl = "https://icdaccessmanagement.who.int/connect/token";
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "icdapi_access"
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: body.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to get token:", error);
      return;
    }

    const data = await response.json();
    console.log("Token obtained successfully:");
    console.log("Access Token:", data.access_token);
    console.log("Expires In:", data.expires_in, "seconds");
    console.log("\nTesting token with a simple API call...");

    // Test the token with a simple search
    const testResponse = await fetch(
      "https://id.who.int/icd/entity/search?q=diabetes&linearization=icd11-mms&release=2023-01",
      {
        headers: {
          "Authorization": `Bearer ${data.access_token}`,
          "Accept": "application/json",
          "API-Version": "v2"
        }
      }
    );

    if (!testResponse.ok) {
      const error = await testResponse.text();
      console.error("API test failed:", error);
      return;
    }

    const searchData = await testResponse.json();
    console.log("\nAPI test successful!");
    console.log("Found", searchData.destinationEntities?.length || 0, "results for 'diabetes'");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testToken();