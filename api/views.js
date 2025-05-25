export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const token = process.env.GOATCOUNTER_TOKEN;
    if (!token) {
      res.status(500).json({ error: 'API token not configured' });
      return;
    }

    const response = await fetch('https://benfey.goatcounter.com/api/v0/stats/pages', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`GoatCounter API returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching view counts:', error);
    res.status(500).json({ error: 'Failed to fetch view counts' });
  }
}