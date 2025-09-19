const net = require('net');
const { exec } = require('child_process');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use`);
          resolve(false);
        }
      })
      .once('listening', () => {
        server.close();
        console.log(`Port ${port} is available`);
        resolve(true);
      })
      .listen(port, '0.0.0.0');
  });
}

function checkFirewall() {
  return new Promise((resolve) => {
    exec('netsh advfirewall show allprofiles state', (error, stdout, stderr) => {
      if (error) {
        console.error('Error checking firewall:', error);
        resolve(false);
        return;
      }
      console.log('Firewall Status:', stdout);
      resolve(true);
    });
  });
}

async function runDiagnostics(port) {
  console.log('Running Network Diagnostics...');
  console.log('==============================');
  
  // Check if port is available
  console.log(`\nChecking port ${port}...`);
  const portAvailable = await checkPort(port);
  
  // Check firewall status
  console.log('\nChecking firewall status...');
  await checkFirewall();
  
  // Test loopback connectivity
  console.log('\nTesting loopback connectivity...');
  exec('ping -n 1 localhost', (error, stdout, stderr) => {
    console.log(stdout);
  });
  
  return portAvailable;
}

// Run diagnostics for port 5000
runDiagnostics(5000).then((portAvailable) => {
  if (portAvailable) {
    console.log('\n✅ Port 5000 is available for use');
  } else {
    console.log('\n❌ Port 5000 is in use by another process');
  }
});