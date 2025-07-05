#!/usr/bin/env node

/**
 * 🚀 Bonded API Connection Test
 * This script tests the connection between frontend and backend
 */

const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testApiConnection(apiUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(apiUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      timeout: 10000
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function main() {
  log('🚀 Bonded API Connection Test', 'cyan');
  log('=============================', 'cyan');
  console.log('');

  // Get API URL from command line argument or use default
  const apiUrl = process.argv[2] || 'https://your-bonded-backend.onrender.com';
  
  log(`Testing connection to: ${apiUrl}`, 'blue');
  console.log('');

  try {
    log('🔍 Testing API endpoint...', 'yellow');
    const response = await testApiConnection(apiUrl);
    
    log(`✅ Connection successful!`, 'green');
    log(`   Status Code: ${response.statusCode}`, 'green');
    log(`   Content-Type: ${response.headers['content-type'] || 'Not specified'}`, 'green');
    
    if (response.data) {
      log(`   Response: ${response.data.substring(0, 200)}${response.data.length > 200 ? '...' : ''}`, 'green');
    }
    
    console.log('');
    log('🎉 Your backend is accessible!', 'green');
    
  } catch (error) {
    log(`❌ Connection failed: ${error.message}`, 'red');
    console.log('');
    log('🔧 Troubleshooting tips:', 'yellow');
    log('1. Check if your backend service is running on Render', 'yellow');
    log('2. Verify the API URL is correct', 'yellow');
    log('3. Check Render logs for any errors', 'yellow');
    log('4. Ensure CORS is properly configured', 'yellow');
    log('5. Test the URL in your browser', 'yellow');
    console.log('');
    log('Usage: node test-api-connection.js <your-backend-url>', 'blue');
    log('Example: node test-api-connection.js https://my-bonded-backend.onrender.com', 'blue');
  }
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testApiConnection }; 