export function getHomeHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Fast, free URL shortener. Create short links in seconds with LZVR Short.">
  <meta name="theme-color" content="#faf9f6">
  <title>LZVR Short — Simplify Your Links</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    html { min-height: 100%; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background:
        radial-gradient(circle at 12% 18%, rgba(255, 86, 0, 0.16), transparent 30%),
        linear-gradient(135deg, #fffaf2 0%, #faf9f6 45%, #f0eee8 100%);
      color: #111111;
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    /* ── NAV ──────────────────────────────────────────────── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid #dedbd6;
      height: 56px;
      display: flex;
      align-items: center;
    }
    .nav-inner {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
      padding: 0 clamp(18px, 4vw, 56px);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.3px;
      color: #111111;
      text-decoration: none;
    }
    .nav-logo .accent { color: #ff5600; }
    .nav-admin {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 14px;
      color: #626260;
      background: none;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    .nav-admin:hover { border-color: #dedbd6; }

    /* ── MAIN ─────────────────────────────────────────────── */
    main {
      flex: 1;
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
      padding: clamp(48px, 7vw, 96px) clamp(18px, 4vw, 56px);
      min-height: calc(100svh - 56px - 61px);
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.8fr);
      align-items: center;
      gap: clamp(32px, 7vw, 96px);
    }

    /* ── HERO ─────────────────────────────────────────────── */
    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #ff5600;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 52px;
      font-weight: 400;
      line-height: 1.00;
      letter-spacing: -2px;
      color: #111111;
      margin-bottom: 20px;
      max-width: 680px;
    }
    h1 .dot { color: #ff5600; }
    .hero-sub {
      font-size: 16px;
      color: #626260;
      line-height: 1.5;
      margin-bottom: 48px;
      max-width: 520px;
    }

    /* ── FORM CARD ────────────────────────────────────────── */
    .form-card {
      background: #ffffff;
      border: 1px solid #dedbd6;
      border-radius: 18px;
      padding: clamp(22px, 3vw, 34px);
      box-shadow: 0 28px 70px rgba(17, 17, 17, 0.10);
    }

    .field-label {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7b7b78;
      margin-bottom: 6px;
    }

    .input-field {
      display: block;
      width: 100%;
      padding: 12px 14px;
      background: #faf9f6;
      border: 1px solid #dedbd6;
      border-radius: 4px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 15px;
      color: #111111;
      outline: none;
      box-shadow: none;
      transition: border-color 0.15s ease;
    }
    .input-field:focus { border-color: #111111; }
    .input-field::placeholder { color: #9c9fa5; }
    select.input-field { cursor: pointer; }

    /* Advanced toggle */
    .advanced-toggle {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: none;
      border: none;
      padding: 0;
      margin-top: 14px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 13px;
      color: #7b7b78;
      cursor: pointer;
      transition: color 0.15s ease;
    }
    .advanced-toggle:hover { color: #111111; }
    .chevron {
      display: inline-block;
      font-size: 11px;
      line-height: 1;
      transition: transform 0.2s ease;
    }
    .advanced-toggle.open .chevron { transform: rotate(180deg); }

    /* Advanced section */
    .advanced-section {
      display: none;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 12px;
    }
    .advanced-section.open { display: grid; }
    .advanced-section .input-field { font-size: 14px; }

    /* Divider */
    .form-divider {
      border: none;
      border-top: 1px solid #dedbd6;
      margin: 20px 0;
    }

    /* Submit button */
    .btn-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 44px;
      background: #111111;
      color: #ffffff;
      border: 1px solid #111111;
      border-radius: 4px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
    }
    .btn-submit:hover:not([disabled]) {
      background: #ffffff;
      color: #111111;
      border-color: #111111;
      transform: scale(1.03);
    }
    .btn-submit:active:not([disabled]) { transform: scale(0.85); }
    .btn-submit[disabled] { opacity: 0.5; cursor: not-allowed; }

    /* Spinner */
    .spinner {
      flex-shrink: 0;
      width: 15px;
      height: 15px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.65s linear infinite;
    }
    .btn-submit:hover .spinner {
      border-color: rgba(17, 17, 17, 0.2);
      border-top-color: #111111;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── RESULT BOX ───────────────────────────────────────── */
    .result-box {
      display: none;
      margin-top: 16px;
      border: 1px solid #dedbd6;
      border-radius: 8px;
      overflow: hidden;
    }
    .result-box.show {
      display: block;
      animation: resultIn 0.22s ease forwards;
    }
    @keyframes resultIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .result-header {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #faf9f6;
      border-bottom: 1px solid #dedbd6;
      padding: 10px 14px;
    }
    .result-dot {
      flex-shrink: 0;
      width: 8px;
      height: 8px;
      background: #ff5600;
      border-radius: 50%;
    }
    .result-header-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7b7b78;
    }
    .result-body {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      padding: 12px 14px;
    }
    .result-url {
      flex: 1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #111111;
      word-break: break-all;
    }
    .btn-copy {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 0 12px;
      background: transparent;
      color: #111111;
      border: 1px solid #dedbd6;
      border-radius: 4px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 13px;
      cursor: pointer;
      transition: border-color 0.15s ease, transform 0.1s ease;
      white-space: nowrap;
    }
    .btn-copy:hover { border-color: #111111; transform: scale(1.1); }
    .btn-copy:active { transform: scale(0.85); }

    /* ── FOOTER ───────────────────────────────────────────── */
    footer {
      border-top: 1px solid #dedbd6;
      padding: 20px 24px;
      text-align: center;
      background: rgba(255, 255, 255, 0.55);
    }
    .footer-copy {
      font-size: 12px;
      color: #9c9fa5;
    }

    /* ── TOAST ────────────────────────────────────────────── */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999;
      background: #111111;
      color: #ffffff;
      font-size: 13px;
      border-radius: 4px;
      padding: 12px 16px;
      max-width: 300px;
      opacity: 0;
      transform: translateY(80px);
      transition: opacity 0.22s ease, transform 0.22s ease;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .toast.error { background: #c41c1c; }

    /* ── RESPONSIVE ───────────────────────────────────────── */
    @media (max-width: 600px) {
      main {
        grid-template-columns: 1fr;
        min-height: auto;
        padding: 48px 16px 48px;
      }
      h1 { font-size: 40px; letter-spacing: -1.5px; }
      .advanced-section { grid-template-columns: 1fr; }
    }

    @media (max-width: 900px) {
      main {
        grid-template-columns: 1fr;
        align-items: start;
      }
    }
  </style>
</head>
<body>

  <nav class="nav">
    <div class="nav-inner">
      <a class="nav-logo" href="/">LZVR<span class="accent">.</span></a>
      <button class="nav-admin" id="adminLink">Admin &rarr;</button>
    </div>
  </nav>

  <main>
    <p class="eyebrow">URL Shortener</p>
    <h1>Short links,<br>instantly<span class="dot">.</span></h1>
    <p class="hero-sub">Paste any long URL and get a clean, shareable short link in seconds.</p>

    <div class="form-card">
      <form id="shortenForm" autocomplete="off">
        <label class="field-label" for="urlInput">Destination URL</label>
        <input
          class="input-field"
          type="url"
          id="urlInput"
          placeholder="https://example.com/your-very-long-url-here"
          required
          spellcheck="false"
        />

        <button type="button" class="advanced-toggle" id="advancedToggle">
          <span class="chevron">&#9662;</span>
          Advanced options
        </button>

        <div class="advanced-section" id="advancedSection">
          <div>
            <label class="field-label" for="customSlug">Custom alias</label>
            <input
              class="input-field"
              type="text"
              id="customSlug"
              placeholder="my-link"
              pattern="[a-zA-Z0-9\\-_]+"
              spellcheck="false"
            />
          </div>
          <div>
            <label class="field-label" for="expiresIn">Expiration</label>
            <select class="input-field" id="expiresIn">
              <option value="">Never</option>
              <option value="3600">1 Hour</option>
              <option value="86400">1 Day</option>
              <option value="604800">1 Week</option>
              <option value="2592000">1 Month</option>
            </select>
          </div>
        </div>

        <hr class="form-divider">

        <button type="submit" class="btn-submit" id="submitBtn">Shorten URL</button>
      </form>

      <div class="result-box" id="resultBox">
        <div class="result-header">
          <span class="result-dot"></span>
          <span class="result-header-label">Your Short Link</span>
        </div>
        <div class="result-body">
          <span class="result-url" id="shortUrlText"></span>
          <button class="btn-copy" onclick="copyUrl()">Copy</button>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <p class="footer-copy">&copy; 2025 LZVR Short</p>
  </footer>

  <div class="toast" id="toast"></div>

  <script>
    const SESSION_KEY = 'ts_session_token';

    /* ── Session helpers ──────────────────────────────────── */
    function handleSessionToken() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('_ts');
      if (token) {
        try { localStorage.setItem(SESSION_KEY, token); } catch (e) {}
        window.history.replaceState({}, '', '/');
      }
    }

    function getSessionToken() {
      try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; }
    }

    /* ── Advanced toggle ──────────────────────────────────── */
    function toggleAdvanced() {
      const section = document.getElementById('advancedSection');
      const toggle  = document.getElementById('advancedToggle');
      const chevron = toggle.querySelector('.chevron');
      const isOpen  = section.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      chevron.innerHTML = isOpen ? '&#9652;' : '&#9662;';
    }

    document.getElementById('advancedToggle').addEventListener('click', toggleAdvanced);

    /* ── Toast ────────────────────────────────────────────── */
    function showToast(message, isError) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = 'toast show' + (isError ? ' error' : '');
      setTimeout(function () { toast.className = 'toast'; }, 3000);
    }

    /* ── Copy URL ─────────────────────────────────────────── */
    function copyUrl() {
      const text = document.getElementById('shortUrlText').textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(function () { showToast('Link copied to clipboard!'); })
          .catch(function () { fallbackCopy(text); });
      } else {
        fallbackCopy(text);
      }
    }

    function fallbackCopy(text) {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!');
      } catch (e) {
        showToast('Could not copy \u2014 please copy manually', true);
      }
      document.body.removeChild(el);
    }

    /* ── Admin link ───────────────────────────────────────── */
    document.getElementById('adminLink').addEventListener('click', function () {
      const token = getSessionToken();
      if (token) {
        window.location.href = '/admin?_ts=' + encodeURIComponent(token);
      } else {
        window.location.href = '/admin';
      }
    });

    /* ── Form submit ──────────────────────────────────────── */
    document.getElementById('shortenForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const urlVal     = document.getElementById('urlInput').value;
      const customSlug = document.getElementById('customSlug').value;
      const expiresIn  = document.getElementById('expiresIn').value;
      const btn        = document.getElementById('submitBtn');

      btn.innerHTML = '<span class="spinner"></span> Shortening...';
      btn.disabled  = true;

      try {
        const headers = { 'Content-Type': 'application/json' };
        const token   = getSessionToken();
        if (token) headers['X-Session-Token'] = token;

        const payload = { url: urlVal };
        if (customSlug) payload.customSlug = customSlug;
        if (expiresIn)  payload.expiresIn  = parseInt(expiresIn, 10);

        const response = await fetch('/api/shorten', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to shorten URL');

        document.getElementById('shortUrlText').textContent = data.shortUrl;
        document.getElementById('resultBox').classList.add('show');
        showToast('Short link created!');

        document.getElementById('urlInput').value   = '';
        document.getElementById('customSlug').value = '';
        document.getElementById('expiresIn').value  = '';
      } catch (err) {
        showToast(err.message, true);
      } finally {
        btn.innerHTML = 'Shorten URL';
        btn.disabled  = false;
      }
    });

    /* ── Boot ─────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
      handleSessionToken();
    });
  </script>
</body>
</html>`;
}
