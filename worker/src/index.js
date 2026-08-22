const cors = {
  'Access-Control-Allow-Origin': 'https://reem-masalha.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST an image to /recognize' }, 405);
    const url = new URL(request.url);
    if (url.pathname !== '/recognize') return json({ error: 'Not found' }, 404);
    try {
      const body = await request.json();
      if (!body.image || typeof body.image !== 'string') return json({ error: 'Missing image' }, 400);
      const base64 = body.image.replace(/^data:image\/[^;]+;base64,/, '');
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      // Cloudflare Vision/AI OCR is intentionally isolated here so the browser never receives credentials.
      // The model should return only the chemical equation text.
      const result = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
        image: [...bytes],
        prompt: 'Read the handwritten chemical equation in this image. Return ONLY the equation as plain text, using normal element symbols, numbers, + and ->. Do not explain anything. Example: 2H2 + O2 -> 2H2O'
      });
      const text = result?.response || result?.description || '';
      return json({ text: text.trim() });
    } catch (e) {
      return json({ error: e?.message || 'Recognition failed' }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
