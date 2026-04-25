// GET /admin-oauth/callback — GitHub redirektne sem s ?code=...&state=...
// Verifikujeme state proti cookie, vyměníme code za access_token přes client_secret,
// vrátíme HTML co pošle postMessage do okna co popup otevřelo (Decap admin).
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');
  const stateCookie = cookies.get('decap_oauth_state')?.value;

  cookies.delete('decap_oauth_state', { path: '/admin-oauth' });

  if (!code || !stateParam || !stateCookie || stateCookie !== stateParam) {
    return errorHtml('Invalid OAuth state');
  }

  const clientId = (env as any).GITHUB_OAUTH_CLIENT_ID as string;
  const clientSecret = (env as any).GITHUB_OAUTH_CLIENT_SECRET as string;
  if (!clientId || !clientSecret) {
    return errorHtml('Missing GitHub OAuth credentials on server');
  }

  let token: string;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'agro-svet-decap-oauth',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string };
    if (!data.access_token) {
      return errorHtml(`Token exchange failed: ${data.error ?? 'unknown'}`);
    }
    token = data.access_token;
  } catch (e: any) {
    return errorHtml(`Token exchange threw: ${e.message ?? 'unknown'}`);
  }

  return successHtml(token);
};

function successHtml(token: string): Response {
  // Decap CMS protokol (decap-cms-lib-auth):
  // 1. Popup posílá "authorizing:github" → parent registruje listener
  // 2. Parent posílá "authorizing:github" zpět jako ACK
  // 3. Popup posílá "authorization:github:success:<JSON>" → parent dokončí auth
  const payload = JSON.stringify({ token, provider: 'github' });
  const successMsg = 'authorization:github:success:' + payload;
  const body = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Login OK</title></head>
<body>
<script>
(function() {
  var SUCCESS_MSG = ${JSON.stringify(successMsg)};

  function postToParent(msg) {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(msg, '*');
    }
  }

  // Krok 1: probe — řekneme parent oknu že popup čeká.
  postToParent('authorizing:github');

  // Krok 2: čekáme na ACK od parent okna.
  window.addEventListener('message', function (e) {
    if (typeof e.data !== 'string') return;
    if (e.data === 'authorizing:github') {
      // Parent ACK přijatý — pošli token.
      postToParent(SUCCESS_MSG);
      setTimeout(function () { window.close(); }, 200);
    }
  });

  // Fallback: pokud parent neACKne do 1s, pošleme token "naslepo" (some Decap versions).
  setTimeout(function () { postToParent(SUCCESS_MSG); }, 1000);
  setTimeout(function () { window.close(); }, 3000);
})();
</script>
<p>Login successful. Closing window…</p>
</body>
</html>`;
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function errorHtml(msg: string): Response {
  const safeMsg = msg.replace(/[<>&]/g, '');
  const body = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Login error</title></head>
<body>
<h1>OAuth Error</h1>
<p>${safeMsg}</p>
<p><a href="/admin/">Back to admin</a></p>
<script>
if (window.opener) {
  window.opener.postMessage('authorization:github:error:' + ${JSON.stringify(JSON.stringify({ message: msg }))}, '*');
}
</script>
</body>
</html>`;
  return new Response(body, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
