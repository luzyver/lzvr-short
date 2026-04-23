export function getTurnstileHTML(siteKey) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Verify &mdash; LZVR</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: #faf9f6;
      color: #111111;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #dedbd6;
      border-radius: 8px;
      padding: 40px 32px;
      max-width: 380px;
      width: 100%;
      text-align: center;
    }

    .logo {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.3px;
      color: #111111;
      margin-bottom: 4px;
      line-height: 1;
    }

    .logo-dot {
      color: #ff5600;
    }

    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7b7b78;
      margin-bottom: 28px;
    }

    h1 {
      font-size: 22px;
      font-weight: 400;
      letter-spacing: -0.6px;
      line-height: 1.00;
      color: #111111;
      margin-bottom: 8px;
    }

    .subtext {
      font-size: 13px;
      color: #626260;
      margin-bottom: 28px;
      line-height: 1.4;
    }

    .turnstile-wrapper {
      display: flex;
      justify-content: center;
    }

    .status {
      font-size: 13px;
      min-height: 20px;
      margin-top: 10px;
    }

    .status.verifying { color: #626260; }
    .status.success   { color: #2c7a4b; }
    .status.error     { color: #c41c1c; }

    .divider {
      border: none;
      border-top: 1px solid #dedbd6;
      margin: 24px 0 16px;
    }

    .footer-note {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #9c9fa5;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">LZVR<span class="logo-dot">.</span></div>
    <div class="eyebrow">Security Check</div>
    <h1>Verify you&rsquo;re human</h1>
    <p class="subtext">Complete the challenge below to continue.</p>
    <div class="turnstile-wrapper">
      <div class="cf-turnstile"
           data-sitekey="${siteKey}"
           data-callback="onVerify"
           data-theme="light">
      </div>
    </div>
    <p class="status" id="status"></p>
    <hr class="divider">
    <div class="footer-note">Protected by Cloudflare Turnstile</div>
  </div>

  <script>
    const SESSION_KEY = 'ts_session_token';

    function onVerify(token) {
      const status = document.getElementById('status');
      status.textContent = 'Verifying...';
      status.className = 'status verifying';

      fetch('/api/turnstile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.sessionToken) {
            try { localStorage.setItem(SESSION_KEY, data.sessionToken); } catch(e) {}
          }
          status.textContent = 'Verified. Redirecting...';
          status.className = 'status success';
          setTimeout(() => {
            let redirect = data.redirect || '/';
            if (data.sessionToken) {
              redirect += (redirect.includes('?') ? '&' : '?') + '_ts=' + data.sessionToken;
            }
            window.location.href = redirect;
          }, 600);
        } else {
          status.textContent = data.error || 'Verification failed. Please try again.';
          status.className = 'status error';
          if (typeof turnstile !== 'undefined') turnstile.reset();
        }
      })
      .catch(() => {
        status.textContent = 'An error occurred. Please try again.';
        status.className = 'status error';
        if (typeof turnstile !== 'undefined') turnstile.reset();
      });
    }
  </script>
</body>
</html>`;
}