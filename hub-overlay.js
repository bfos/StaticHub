/*
 * StaticHub "return to hub" overlay.
 *
 * Shared across every site. The build (build.js) injects a one-line reference
 * to this file into each deployed site page:
 *
 *   <script src="<rel>/hub-overlay.js" data-hub-root="<rel>/" defer></script>
 *
 * where <rel> is the relative path from that page back to the repo root. This
 * script renders a small, fixed bottom-left "Hub" pill linking back to the hub.
 *
 * The pill lives inside a Shadow DOM so its styles are fully isolated from the
 * host site (and vice-versa) — no clashes with whatever CSS the site ships.
 * No dependencies; vanilla browser JS.
 */
(function () {
  'use strict';

  var MOUNT_ID = 'statichub-hub-overlay';

  function mount() {
    if (document.getElementById(MOUNT_ID)) return; // never mount twice

    // Read the hub location the build baked into our own <script> tag.
    var script = document.currentScript || document.querySelector('script[data-hub-root]');
    var hubRoot = (script && script.getAttribute('data-hub-root')) || '../../';

    var host = document.createElement('div');
    host.id = MOUNT_ID;
    // Position on the host element (inline styles beat ordinary site rules);
    // the pill's appearance is isolated inside the shadow root below.
    host.style.cssText = [
      'position: fixed',
      'left: max(16px, env(safe-area-inset-left, 16px))',
      'bottom: max(16px, env(safe-area-inset-bottom, 16px))',
      'z-index: 2147483647',
      'margin: 0',
      'padding: 0',
    ].join(';');

    var shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<style>' +
      'a{' +
        'display:inline-flex;align-items:center;gap:6px;' +
        'font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
        'color:#f8fafc;text-decoration:none;padding:8px 14px;border-radius:999px;' +
        'background:rgba(15,23,42,0.82);border:1px solid rgba(148,163,184,0.35);' +
        'box-shadow:0 4px 14px rgba(15,23,42,0.28);' +
        '-webkit-backdrop-filter:blur(6px) saturate(140%);backdrop-filter:blur(6px) saturate(140%);' +
        'opacity:0.92;cursor:pointer;' +
        'transition:transform .15s ease,background .15s ease,box-shadow .15s ease,opacity .15s ease;' +
      '}' +
      'a:hover,a:focus-visible{' +
        'background:rgba(14,165,233,0.96);opacity:1;transform:translateY(-2px);' +
        'box-shadow:0 8px 22px rgba(2,132,199,0.40);' +
      '}' +
      'a:focus-visible{outline:2px solid #38bdf8;outline-offset:2px;}' +
      '.arrow{font-size:14px;line-height:1;}' +
      '@media (prefers-reduced-motion: reduce){a{transition:none;}a:hover,a:focus-visible{transform:none;}}' +
      '@media print{:host{display:none !important;}}' +
      '</style>' +
      '<a part="pill" href="' + hubRoot + '" aria-label="Return to StaticHub">' +
        '<span class="arrow" aria-hidden="true">←</span><span>Hub</span>' +
      '</a>';

    document.body.appendChild(host);
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  }
})();
