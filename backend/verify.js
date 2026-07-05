const { spawn } = require('child_process');
const http = require('http');

console.log('Starting simplified CORS verification script...');

function request(port, method, path, origin, additionalHeaders = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Origin': origin,
      ...additionalHeaders
    };
    
    const req = http.request({
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: method,
      headers: headers
    }, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

function runServer(port) {
  return new Promise((resolve, reject) => {
    const serverEnv = {
      ...process.env,
      PORT: port.toString(),
      NODE_ENV: 'development'
    };

    const server = spawn('npx', ['ts-node', 'src/index.ts'], {
      cwd: __dirname,
      env: serverEnv,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let serverOutput = '';
    let started = false;

    server.stdout.on('data', (data) => {
      serverOutput += data.toString();
      if (!started && serverOutput.includes('Running in')) {
        started = true;
        resolve({ server, port });
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`[Server ${port} Stderr]`, data.toString().trim());
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  let failed = false;
  let serverInstance;
  try {
    const { server, port } = await runServer(5099);
    serverInstance = server;

    const testCases = [
      {
        name: 'Allow localhost development',
        method: 'GET',
        path: '/health',
        origin: 'http://localhost:5173',
        expectedOrigin: 'http://localhost:5173',
        expectedCredentials: 'true'
      },
      {
        name: 'Allow Vercel production domain',
        method: 'GET',
        path: '/health',
        origin: 'https://vidya-sanchar.vercel.app',
        expectedOrigin: 'https://vidya-sanchar.vercel.app',
        expectedCredentials: 'true'
      },
      {
        name: 'Allow Vercel preview deployment subdomain',
        method: 'GET',
        path: '/health',
        origin: 'https://vidya-sanchar-7iubhpofm-doc-nick.vercel.app',
        expectedOrigin: 'https://vidya-sanchar-7iubhpofm-doc-nick.vercel.app',
        expectedCredentials: 'true'
      },
      {
        name: 'Allow arbitrary domain (dynamic reflection)',
        method: 'GET',
        path: '/health',
        origin: 'https://arbitrary-domain.com',
        expectedOrigin: 'https://arbitrary-domain.com',
        expectedCredentials: 'true'
      },
      {
        name: 'Handle OPTIONS preflight request',
        method: 'OPTIONS',
        path: '/health',
        origin: 'https://vidya-sanchar-7iubhpofm-doc-nick.vercel.app',
        expectedOrigin: 'https://vidya-sanchar-7iubhpofm-doc-nick.vercel.app',
        expectedCredentials: 'true',
        isPreflight: true
      }
    ];

    for (const tc of testCases) {
      try {
        const extraHeaders = tc.isPreflight ? {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization, X-Tenant-Id'
        } : {};
        
        const res = await request(port, tc.method, tc.path, tc.origin, extraHeaders);
        const actualOrigin = res.headers['access-control-allow-origin'];
        const actualCredentials = res.headers['access-control-allow-credentials'];
        
        let pass = true;
        let reason = [];

        if (actualOrigin !== tc.expectedOrigin) {
          pass = false;
          reason.push(`Expected origin "${tc.expectedOrigin}", got "${actualOrigin}"`);
        }

        if (actualCredentials !== tc.expectedCredentials) {
          pass = false;
          reason.push(`Expected credentials "${tc.expectedCredentials}", got "${actualCredentials}"`);
        }

        if (pass) {
          console.log(`[PASS] ${tc.name}`);
        } else {
          console.error(`[FAIL] ${tc.name}`);
          reason.forEach(r => console.error(`  - ${r}`));
          failed = true;
        }
      } catch (err) {
        console.error(`[ERROR] Test "${tc.name}" encountered error:`, err);
        failed = true;
      }
    }

  } catch (err) {
    console.error('Error starting server or running tests:', err);
    failed = true;
  } finally {
    if (serverInstance) {
      console.log('Stopping server...');
      serverInstance.kill('SIGINT');
    }
  }

  if (failed) {
    console.error('\nCORS verification failed.');
    process.exit(1);
  } else {
    console.log('\nAll CORS verification checks passed successfully!');
    process.exit(0);
  }
}

main();

// Timeout backup
setTimeout(() => {
  console.error('Verification timed out after 30 seconds.');
  process.exit(1);
}, 30000);
