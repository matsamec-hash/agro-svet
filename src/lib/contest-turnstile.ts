/**
 * Verify a Cloudflare Turnstile response token against Cloudflare's siteverify endpoint.
 * Returns true when the token is valid. Used to gate the upload form and the
 * voting magic-link request endpoint against bots.
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
  secret: string,
  token: string,
  ip?: string,
): Promise<boolean> {
  if (!secret || !token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const json = (await res.json()) as { success?: boolean };
    return !!json.success;
  } catch (err) {
    console.warn('[turnstile] verify failed', err);
    return false;
  }
}
