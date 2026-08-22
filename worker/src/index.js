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
      const result = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
        messages: [
          { role: 'system', content: 'You are a chemistry handwriting OCR engine. Read only the handwritten chemical equation. Return ONLY normalized plain text. Use element symbols such as H2, O2, Fe2O3; use + and ->; preserve coefficients. Never explain.' },
          { role: 'user', content: 'Transcribe this handwritten chemical equation exactly enough to balance it. Return only the equation.' }
        ],
        image: body.image,
        max_tokens: 128
      });
      const text = (result?.response || result?.result || '').toString().trim();
      return json({ text });
    } catch (e) {
      return json({ error: e?.message || 'Recognition failed' }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
