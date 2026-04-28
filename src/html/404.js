export function get404HTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 &mdash; LZVR</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background:
        radial-gradient(circle at 80% 16%, rgba(255, 86, 0, 0.16), transparent 30%),
        linear-gradient(135deg, #fffaf2 0%, #faf9f6 48%, #eeece6 100%);
      color: #111111;
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(20px, 5vw, 72px);
    }

    .wrapper {
      text-align: center;
      max-width: 520px;
      width: 100%;
    }

    .ghost-number {
      font-size: 120px;
      font-weight: 400;
      letter-spacing: -5px;
      line-height: 1;
      color: #111111;
      opacity: 0.06;
      margin-bottom: -24px;
      user-select: none;
    }

    .card {
      background: #ffffff;
      border: 1px solid #dedbd6;
      border-radius: 20px;
      padding: clamp(32px, 5vw, 52px);
      position: relative;
      z-index: 1;
      box-shadow: 0 28px 70px rgba(17, 17, 17, 0.10);
    }

    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ff5600;
      margin-bottom: 12px;
    }

    h1 {
      font-size: 28px;
      font-weight: 400;
      letter-spacing: -0.8px;
      line-height: 1.00;
      color: #111111;
      margin-bottom: 10px;
    }

    .description {
      font-size: 14px;
      color: #626260;
      line-height: 1.5;
      margin-bottom: 28px;
    }

    .btn-home {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      background: #111111;
      color: #ffffff;
      border: 1px solid transparent;
      border-radius: 4px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
    }

    .btn-home:hover {
      background: #ffffff;
      color: #111111;
      border-color: #111111;
      transform: scale(1.05);
    }

    .btn-home:active {
      transform: scale(0.85);
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="ghost-number">404</div>
    <div class="card">
      <div class="eyebrow">Not Found</div>
      <h1>Link not found<span style="color:#ff5600">.</span></h1>
      <p class="description">This short link doesn&rsquo;t exist or has expired. Double-check the URL and try again.</p>
      <a href="/" class="btn-home">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path d="M9 22V12h6v10"/>
        </svg>
        Go Home
      </a>
    </div>
  </div>
</body>
</html>`;
}
