export function getAdminHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="LZVR Short Admin Panel — manage and monitor all shortened links.">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin Panel — LZVR Short</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui;
      background: #faf9f6;
      color: #111111;
      min-height: 100vh;
      min-height: 100svh;
      -webkit-font-smoothing: antialiased;
    }

    /* ── NAV ── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #ffffff;
      height: 56px;
      border-bottom: 1px solid #dedbd6;
    }
    .nav-inner {
      max-width: none;
      margin: 0 auto;
      padding: 0 clamp(18px, 3vw, 44px);
      height: 100%;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
    }
    .nav-logo {
      font-size: 18px;
      font-weight: 600;
      color: #111111;
      text-decoration: none;
      line-height: 1;
    }
    .nav-logo .dot { color: #ff5600; }
    .nav-center {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7b7b78;
    }
    .nav-back {
      justify-self: end;
      font-size: 14px;
      color: #626260;
      text-decoration: none;
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }
    .nav-back:hover {
      color: #111111;
      border-color: #dedbd6;
    }

    /* ── CONTAINER ── */
    .container {
      max-width: none;
      margin: 0 auto;
      padding: clamp(28px, 4vw, 56px) clamp(18px, 3vw, 44px);
      min-height: calc(100svh - 56px);
    }

    /* ── PAGE HEADER ── */
    .page-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #ff5600;
      margin-bottom: 10px;
    }
    .page-title {
      font-size: 32px;
      font-weight: 400;
      line-height: 1.00;
      letter-spacing: -0.96px;
      color: #111111;
      margin-bottom: 32px;
    }

    /* ── CARDS ── */
    .card {
      background: #ffffff;
      border: 1px solid #dedbd6;
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .card-header {
      padding: 14px 20px;
      border-bottom: 1px solid #dedbd6;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7b7b78;
    }
    .card-body { padding: 20px; }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Inter', ui-sans-serif, system-ui;
      font-size: 14px;
      font-weight: 500;
      padding: 0 16px;
      height: 40px;
      transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
      white-space: nowrap;
    }
    .btn:hover  { transform: scale(1.05); }
    .btn:active { transform: scale(0.85); }

    .btn-dark {
      background: #111111;
      color: #ffffff;
      border: 1px solid #111111;
    }
    .btn-dark:hover {
      background: #ffffff;
      color: #111111;
      border-color: #111111;
    }

    .btn-ghost {
      background: #faf9f6;
      color: #626260;
      border: 1px solid #dedbd6;
    }
    .btn-ghost:hover {
      color: #111111;
      border-color: #111111;
    }

    .btn-danger {
      background: transparent;
      color: #c41c1c;
      border: 1px solid #e5b4b4;
      height: 30px;
      font-size: 12px;
      padding: 0 10px;
    }
    .btn-danger:hover {
      background: #c41c1c;
      color: #ffffff;
    }

    .btn-copy {
      background: #faf9f6;
      color: #626260;
      border: 1px solid #dedbd6;
      height: 30px;
      font-size: 12px;
      padding: 0 10px;
    }
    .btn-copy:hover {
      color: #111111;
      border-color: #111111;
    }

    /* ── AUTH ── */
    .auth-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .auth-input {
      flex: 1;
      background: #faf9f6;
      border: 1px solid #dedbd6;
      border-radius: 4px;
      padding: 0 12px;
      height: 40px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #111111;
      outline: none;
      transition: border-color 0.15s;
    }
    .auth-input:focus { border-color: #111111; }
    .auth-input::placeholder { color: #9c9fa5; }

    /* ── STATS GRID ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid #dedbd6;
      border-radius: 8px;
      padding: 20px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: 400;
      letter-spacing: -1px;
      color: #111111;
      line-height: 1;
      margin-bottom: 8px;
    }
    .stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #7b7b78;
    }

    /* ── TABLE ── */
    .table-wrapper { overflow-x: auto; }
    .links-table {
      width: 100%;
      border-collapse: collapse;
    }
    .links-table th {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7b7b78;
      background: #faf9f6;
      padding: 10px 16px;
      text-align: left;
      border-bottom: 1px solid #dedbd6;
    }
    .links-table td {
      font-size: 13px;
      padding: 12px 16px;
      border-bottom: 1px solid #dedbd6;
      vertical-align: middle;
    }
    .links-table tr:last-child td { border-bottom: none; }
    .links-table tbody tr:hover td { background: #faf9f6; }

    .col-slug {
      font-family: 'JetBrains Mono', monospace;
      color: #ff5600;
    }
    .col-url {
      color: #626260;
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .col-clicks {
      font-family: 'JetBrains Mono', monospace;
      text-align: center;
    }
    .col-date {
      color: #9c9fa5;
      font-size: 12px;
    }
    .expiry-badge {
      display: inline-block;
      margin-top: 4px;
      background: #fff3f0;
      color: #ff5600;
      border: 1px solid #ffd4c4;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 1px 5px;
    }
    .col-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    /* ── EMPTY / LOADING ── */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #9c9fa5;
      font-size: 14px;
    }
    .loading-state {
      text-align: center;
      padding: 48px 24px;
    }
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #dedbd6;
      border-top-color: #111111;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── TOAST ── */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #111111;
      color: #ffffff;
      border-radius: 4px;
      padding: 12px 16px;
      font-size: 13px;
      z-index: 9999;
      transform: translateY(calc(100% + 32px));
      opacity: 0;
      transition: transform 0.25s ease, opacity 0.25s ease;
      pointer-events: none;
      max-width: 320px;
    }
    .toast.toast-show {
      transform: translateY(0);
      opacity: 1;
    }
    .toast.toast-error { background: #c41c1c; }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .container { padding: 24px 16px; }
      .auth-row { flex-wrap: wrap; }
      .auth-row .auth-input { flex-basis: 100%; }
      .col-url { max-width: 160px; }
      .col-date { display: none; }
      .links-table th.th-date { display: none; }
    }
  </style>
</head>
<body>

  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo" id="homeLink">LZVR<span class="dot">.</span></a>
      <span class="nav-center">Admin Panel</span>
      <a href="/" class="nav-back" id="backLink">&#8592; Back</a>
    </div>
  </nav>

  <div class="container">

    <p class="page-eyebrow">Dashboard</p>
    <h1 class="page-title">Admin Panel</h1>

    <!-- AUTH CARD -->
    <div class="card" id="authCard">
      <div class="card-header">
        <span class="card-label">Authentication</span>
      </div>
      <div class="card-body">
        <div class="auth-row">
          <input
            type="password"
            id="apiKey"
            class="auth-input"
            placeholder="Enter Admin API Key"
          />
          <button class="btn btn-ghost" onclick="toggleApiKey(this)">Show</button>
          <button class="btn btn-dark" onclick="loadLinks()">Connect</button>
        </div>
      </div>
    </div>

    <!-- STATS GRID -->
    <div class="stats-grid" id="statsContainer" style="display:none;">
      <div class="stat-card">
        <div class="stat-value" id="totalLinks">0</div>
        <div class="stat-label">Total Links</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="totalClicks">0</div>
        <div class="stat-label">Total Clicks</div>
      </div>
    </div>

    <!-- LINKS CARD -->
    <div class="card" id="linksCard" style="display:none;">
      <div class="card-header">
        <span class="card-label">All Links</span>
        <button
          class="btn btn-ghost"
          style="height:30px;font-size:12px;padding:0 10px;"
          onclick="loadLinks()"
        >Refresh</button>
      </div>
      <div id="linksContainer">
        <div class="loading-state"><span class="spinner"></span></div>
      </div>
    </div>

  </div>

  <div class="toast" id="toast"></div>

  <script>
    const SESSION_KEY = 'ts_session_token';

    function handleSessionToken() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('_ts');
      if (token) {
        try { localStorage.setItem(SESSION_KEY, token); } catch(e) {}
        history.replaceState({}, '', '/admin');
      }
    }

    function getSessionToken() {
      try { return localStorage.getItem(SESSION_KEY); } catch(e) { return null; }
    }

    handleSessionToken();

    function toggleApiKey(btn) {
      const input = document.getElementById('apiKey');
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
      } else {
        input.type = 'password';
        btn.textContent = 'Show';
      }
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function formatDate(iso) {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    let toastTimer = null;
    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = \`toast toast-show\${isError ? ' toast-error' : ''}\`;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
    }

    document.getElementById('apiKey').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadLinks();
    });

    document.getElementById('backLink').addEventListener('click', (e) => {
      const token = getSessionToken();
      if (token) {
        e.preventDefault();
        window.location.href = \`/?_ts=\${token}\`;
      }
    });

    document.getElementById('homeLink').addEventListener('click', (e) => {
      const token = getSessionToken();
      if (token) {
        e.preventDefault();
        window.location.href = \`/?_ts=\${token}\`;
      }
    });

    async function loadLinks() {
      const statsContainer = document.getElementById('statsContainer');
      const linksCard      = document.getElementById('linksCard');
      const container      = document.getElementById('linksContainer');

      linksCard.style.display = 'block';
      container.innerHTML = '<div class="loading-state"><span class="spinner"></span></div>';

      try {
        const headers = { 'X-API-Key': document.getElementById('apiKey').value };
        const token = getSessionToken();
        if (token) headers['X-Session-Token'] = token;

        const response = await fetch('/api/links', { headers });
        const data = await response.json();

        if (response.status === 401) {
          linksCard.style.display = 'none';
          statsContainer.style.display = 'none';
          showToast(data.error || 'Unauthorized', true);
          return;
        }
        if (!response.ok) throw new Error(data.error || 'Failed to load links');

        const links = data.links || [];
        const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

        document.getElementById('totalLinks').textContent  = links.length;
        document.getElementById('totalClicks').textContent = totalClicks;
        statsContainer.style.display = 'grid';

        if (links.length === 0) {
          container.innerHTML = '<div class="empty-state">No links yet.</div>';
          return;
        }

        const rows = links.map(link => {
          const slug    = escapeHtml(link.slug);
          const url     = escapeHtml(link.url);
          const clicks  = escapeHtml(String(link.clicks || 0));
          const created = link.createdAt ? formatDate(link.createdAt) : '—';
          const expiryBadge = link.expiresAt
            ? \`<span class="expiry-badge">Expires \${escapeHtml(formatDate(link.expiresAt))}</span>\`
            : '';

          return \`<tr>
            <td class="col-slug">/\${slug}</td>
            <td class="col-url" title="\${url}">\${url}</td>
            <td class="col-clicks">\${clicks}</td>
            <td class="col-date">\${created}\${expiryBadge ? '<br>' + expiryBadge : ''}</td>
            <td><div class="col-actions">
              <button class="btn btn-copy"   onclick="copyLink('\${slug}')">Copy</button>
              <button class="btn btn-danger" onclick="deleteLink('\${slug}')">Delete</button>
            </div></td>
          </tr>\`;
        }).join('');

        container.innerHTML = \`
          <div class="table-wrapper">
            <table class="links-table">
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Destination</th>
                  <th>Clicks</th>
                  <th class="th-date">Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>\${rows}</tbody>
            </table>
          </div>
        \`;

      } catch (err) {
        container.innerHTML = \`<div class="empty-state" style="color:#c41c1c;">\${escapeHtml(err.message)}</div>\`;
      }
    }

    async function deleteLink(slug) {
      if (!confirm(\`Delete /\${slug}? This cannot be undone.\`)) return;
      try {
        const headers = { 'X-API-Key': document.getElementById('apiKey').value };
        const token = getSessionToken();
        if (token) headers['X-Session-Token'] = token;
        const response = await fetch(\`/api/delete/\${slug}\`, { method: 'DELETE', headers });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete');
        showToast(\`/\${slug} deleted\`);
        loadLinks();
      } catch (err) {
        showToast(err.message, true);
      }
    }

    function copyLink(slug) {
      navigator.clipboard.writeText(\`\${window.location.origin}/\${slug}\`)
        .then(() => showToast('Link copied!'))
        .catch(() => showToast('Failed to copy', true));
    }
  </script>

</body>
</html>`;
}
