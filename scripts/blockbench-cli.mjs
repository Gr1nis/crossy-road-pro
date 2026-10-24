import http from 'http';

const action = process.argv[2] || 'get_status';
let params = {};
if (process.argv[3]) {
  try {
    params = JSON.parse(process.argv[3]);
  } catch (e) {
    console.error('Invalid JSON params:', e.message);
    process.exit(1);
  }
}

const payload = JSON.stringify({
  id: 'cli-' + Date.now(),
  action,
  params
});

const req = http.request(
  {
    hostname: '127.0.0.1',
    port: 8787,
    path: '/command',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    },
    timeout: 10000
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
      } catch {
        console.log(data);
      }
    });
  }
);

req.on('error', (err) => {
  console.error('Error connecting to Blockbench:', err.message);
  process.exit(1);
});

req.write(payload);
req.end();
