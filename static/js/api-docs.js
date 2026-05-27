/**
 * api-docs.js
 * ─────────────────────────────────────────────
 * Renders the interactive REST API documentation panel.
 */

function renderApiDocs() {
  const container = document.getElementById('apiDocs');
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom:20px">
      <div style="font-family:var(--font-display);font-size:22px;margin-bottom:4px">REST API Reference</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:12px">
        Django REST Framework endpoints · Base URL:
        <code style="background:var(--surface2);padding:2px 8px;border-radius:6px;font-family:var(--font-mono);font-size:11px">http://localhost:8000</code>
      </div>
      <div style="background:rgba(34,211,238,0.07);border:0.5px solid rgba(34,211,238,0.2);border-radius:10px;padding:10px 14px;font-size:12px;color:var(--muted2)">
        💡 Click any endpoint to expand request/response details.
      </div>
    </div>
    ${API_ENDPOINTS.map((ep, i) => buildEndpointCard(ep, i)).join('')}
  `;
}

function buildEndpointCard(ep, i) {
  const methodClass = {
    GET:    'method-get',
    POST:   'method-post',
    DELETE: 'method-delete',
  }[ep.method] || 'method-get';

  const bodySection = ep.body ? `
    <div style="margin-bottom:10px">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px;font-family:var(--font-mono)">REQUEST BODY</div>
      <pre class="code-block">${escHtml(ep.body)}</pre>
    </div>
  ` : '';

  return `
    <div class="api-endpoint">
      <div class="api-ep-header" onclick="toggleEndpoint(${i})">
        <span class="http-method ${methodClass}">${ep.method}</span>
        <span class="api-path">${escHtml(ep.path)}</span>
        <span class="api-desc">${escHtml(ep.desc)}</span>
        <i class="ti ti-chevron-down" style="color:var(--muted);font-size:14px;transition:transform 0.2s" id="ep-chevron-${i}"></i>
      </div>
      <div class="api-ep-body" id="ep-body-${i}">
        ${bodySection}
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px;font-family:var(--font-mono)">RESPONSE</div>
          <pre class="code-block">${escHtml(ep.response)}</pre>
        </div>
      </div>
    </div>
  `;
}

function toggleEndpoint(i) {
  const body    = document.getElementById(`ep-body-${i}`);
  const chevron = document.getElementById(`ep-chevron-${i}`);
  if (!body) return;

  const isOpen = body.classList.toggle('open');
  if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
}
