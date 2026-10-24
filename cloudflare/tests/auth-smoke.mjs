const API = 'https://chemistry-equations-api.reemkhmasalha.workers.dev';

async function request(path, { method = 'POST', token, body } = {}) {
  const response = await fetch(API + path, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: 'Bearer ' + token } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 300) }; }
  if (!response.ok) {
    throw new Error(`${method} ${path} returned ${response.status}: ${data.error || JSON.stringify(data)}`);
  }
  return data;
}

const marker = `smoke-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
const username = marker.toLowerCase();
const password = `Smoke-${crypto.randomUUID()}-9a!`;
let token = null;
let created = false;
let failure = null;

try {
  const health = await request('/health', { method: 'GET' });
  if (health.ok !== true) throw new Error('Worker health endpoint did not return ok:true.');

  const registration = await request('/api/create-account', {
    body: { name: 'Automated deployment smoke test', username, password },
  });
  if (!registration.ok || !registration.user?.id || !registration.token) {
    throw new Error('Registration did not return a user and session token.');
  }
  token = registration.token;
  created = true;

  const signIn = await request('/api/sign-in', { body: { username, password } });
  if (!signIn.ok || !signIn.token || signIn.user?.username !== username) {
    throw new Error('Sign-in did not return the expected account and session token.');
  }
  token = signIn.token;

  const progress = { smokeTest: true, marker, updatedAt: new Date().toISOString() };
  await request('/api/progress', { token, body: { progress } });
  const stored = await request('/api/progress', { method: 'GET', token });
  if (stored.progress?.marker !== marker || stored.progress?.smokeTest !== true) {
    throw new Error('Saved learning progress did not survive a read-back.');
  }

  await request('/api/scores', { token, body: { stage: marker, score: 1, total: 1 } });
  const scores = await request('/api/scores', { method: 'GET', token });
  if (!Array.isArray(scores.scores) || !scores.scores.some(s => s.stage === marker && Number(s.score) === 1)) {
    throw new Error('A saved quiz score could not be read back.');
  }

  console.log('Authentication smoke test passed: registration, sign-in, progress sync, and score sync.');
} catch (error) {
  failure = error;
} finally {
  if (created && token) {
    try {
      await request('/api/delete-account', { token, body: { password } });
      console.log('Temporary smoke-test account and test data removed.');
    } catch (cleanupError) {
      console.error(`CRITICAL: could not clean up temporary account "${username}": ${cleanupError.message}`);
      failure ||= cleanupError;
    }
  }
}

if (failure) {
  console.error(failure.message || failure);
  process.exitCode = 1;
}
