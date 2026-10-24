import http from 'http';

function callBlockbench(action, params = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      id: 'call-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
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
        timeout: 60000
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.ok) {
              resolve(parsed.result);
            } else {
              reject(new Error(parsed.error || 'Blockbench error'));
            }
          } catch (e) {
            reject(new Error('Invalid JSON: ' + data));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export { callBlockbench };
