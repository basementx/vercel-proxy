export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const headersParam = req.query.headers;
  let customHeaders = {};
  try { customHeaders = headersParam ? JSON.parse(headersParam) : {}; } catch(e) {}

  const reqHeaders = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    ...customHeaders
  };

  try {
    const method = req.query.method || 'GET';
    const bodyParam = req.query.body;
    const fetchOptions = { method, headers: reqHeaders };
    if (bodyParam && method !== 'GET') fetchOptions.body = decodeURIComponent(bodyParam);

    const response = await fetch(targetUrl, fetchOptions);
    const text = await response.text();

    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
    return res.status(response.status).send(text);
  } catch (err) {
    return res.status(502).json({ error: err.message, targetUrl });
  }
}
