#!/usr/bin/env node

/**
 * 🧪 Bonded Authentication Flow Test
 * This script helps test the authentication flow
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

function makeRequest(method, url, data = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    // Add Content-Length header for POST requests with data
    if (data && method === 'POST') {
      const jsonData = JSON.stringify(data);
      headers['Content-Length'] = Buffer.byteLength(jsonData);
    }
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      headers: headers,
      timeout: 10000
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data && method === 'POST') {
      const jsonData = JSON.stringify(data);
      req.write(jsonData);
    }

    req.end();
  });
}

async function testAuthFlow() {
  log('🧪 Bonded Authentication Flow Test', 'cyan');
  log('====================================', 'cyan');
  console.log('');

  const baseUrl = process.argv[2] || 'http://localhost:8000';
  
  log(`Testing authentication flow with backend: ${baseUrl}`, 'blue');
  console.log('');

  try {
    // Step 1: Test group registration
    log('1️⃣ Testing group registration...', 'yellow');
    const registerData = {
      group_name: 'Test Group',
      num_people: 2
    };
    
    const registerResponse = await makeRequest('POST', `${baseUrl}/api/users/register-group/`, registerData);
    
    if (registerResponse.statusCode === 200 || registerResponse.statusCode === 201) {
      log('✅ Group registration successful!', 'green');
      log(`   Group created with ${registerResponse.data.credentials.length} members`, 'green');
      
      // Get the first credential for testing
      const testCredential = registerResponse.data.credentials[0];
      log(`   Test credentials: ${testCredential.username} / ${testCredential.password}`, 'green');
      
      console.log('');
      
      // Step 2: Test login
      log('2️⃣ Testing login...', 'yellow');
      const loginData = {
        group: 'Test Group',
        username: testCredential.username,
        password: testCredential.password
      };
      
      const loginResponse = await makeRequest('POST', `${baseUrl}/api/users/group-login/`, loginData);
      
      if (loginResponse.statusCode === 200) {
        log('✅ Login successful!', 'green');
        log(`   Access token received: ${loginResponse.data.access ? 'Yes' : 'No'}`, 'green');
        log(`   Refresh token received: ${loginResponse.data.refresh ? 'Yes' : 'No'}`, 'green');
        log(`   Memberships count: ${loginResponse.data.memberships ? loginResponse.data.memberships.length : 0}`, 'green');
        
        console.log('');
        
        // Step 3: Test authenticated endpoint
        log('3️⃣ Testing authenticated endpoint...', 'yellow');
        const authHeaders = {
          'Authorization': `Bearer ${loginResponse.data.access}`,
          'Content-Type': 'application/json'
        };
        
        // Test getting group members
        const membersResponse = await makeRequest('GET', `${baseUrl}/api/users/groups/1/members/`, null, authHeaders);
        
        if (membersResponse.statusCode === 200) {
          log('✅ Authenticated endpoint working!', 'green');
          log(`   Group members retrieved successfully`, 'green');
        } else {
          log(`❌ Authenticated endpoint failed: ${membersResponse.statusCode}`, 'red');
        }
        
      } else {
        log(`❌ Login failed: ${loginResponse.statusCode}`, 'red');
        log(`   Response: ${JSON.stringify(loginResponse.data)}`, 'red');
      }
      
    } else {
      log(`❌ Group registration failed: ${registerResponse.statusCode}`, 'red');
      log(`   Response: ${JSON.stringify(registerResponse.data)}`, 'red');
    }
    
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
  }
  
  console.log('');
  log('🎯 Next Steps:', 'blue');
  log('1. Check browser console for frontend authentication logs', 'blue');
  log('2. Verify localStorage contains: access, refresh, memberships', 'blue');
  log('3. Test navigation between pages', 'blue');
  log('4. Check if GroupSelector appears after login', 'blue');
}

// Run the test
if (require.main === module) {
  testAuthFlow().catch(console.error);
}

module.exports = { testAuthFlow }; 