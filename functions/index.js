const { onRequest } = require('firebase-functions/v2/https')

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

exports.paperDataProxy = onRequest(
  { memory: '128MiB', timeoutSeconds: 15, maxInstances: 20 },
  async (req, res) => {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.set(k, v))
    if (req.method === 'OPTIONS') return res.status(204).send('')

    const upstream = await fetch('https://api-legacy.dilanxd.com/paper/data')
    if (!upstream.ok) return res.status(upstream.status).json({ error: 'upstream error' })
    const data = await upstream.json()
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.json(data)
  }
)

exports.paperTermProxy = onRequest(
  { memory: '512MiB', timeoutSeconds: 30, maxInstances: 20 },
  async (req, res) => {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.set(k, v))
    if (req.method === 'OPTIONS') return res.status(204).send('')

    const termId = req.path.replace(/^\//, '').split('/')[0]
    if (!/^\d+$/.test(termId)) return res.status(400).json({ error: 'invalid termId' })

    const upstream = await fetch(`https://cdn.dil.sh/paper-data/${termId}.json`)
    if (!upstream.ok) return res.status(upstream.status).json({ error: 'upstream error' })
    const data = await upstream.json()
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.json(data)
  }
)
