/*
 * ═══════════════════════════════════════════════════════
 *   عداد الزيارات الاحترافي — منصة الرياضيات الذكية
 *   visitor-counter.js — ملف واحد يعمل لوحده
 * ═══════════════════════════════════════════════════════
 *
 *   ✅ يبدأ من 900
 *   ✅ حماية 10 دقائق من التحديث الوهمي
 *   ✅ كشف بوتات تلقائي
 *   ✅ إجمالي زيارات + زوار متصلين الآن
 *   ✅ أرقام متحركة flip animation
 *   ✅ تصميم احترافي داكن مع particles
 *   ✅ تحديث تلقائي كل 12 ثانية
 *
 *   📌 طريقة التركيب:
 *   1. ارفعي هذا الملف بجانب index.html في GitHub
 *   2. في index.html ابحثي عن: renderContent();
 *   3. أضيفي فوقه مباشرة هذا السطر الواحد فقط:
 *      initVisitorCounterPro();
 *
 * ═══════════════════════════════════════════════════════
 */

function initVisitorCounterPro() {

  // ━━━━━━ CONFIG ━━━━━━
  var BASE_COUNT   = 900;
  var COOLDOWN_MS  = 10 * 60 * 1000;
  var LIVE_TIMEOUT = 3 * 60 * 1000;
  var HEARTBEAT_MS = 45 * 1000;
  var POLL_MS      = 12 * 1000;

  // ━━━━━━ INJECT CSS ━━━━━━
  var style = document.createElement('style');
  style.textContent = '\
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700;800&display=swap");\
.vc-wrap{display:flex;justify-content:center;padding:20px 12px;width:100%}\
.vc-card{position:relative;overflow:hidden;width:100%;max-width:460px;border-radius:20px;padding:24px 20px 16px;background:linear-gradient(160deg,#020617 0%,#0c1a3a 45%,#0f172a 100%);box-shadow:0 16px 60px rgba(2,6,23,0.45),0 0 0 1px rgba(56,189,248,0.08);transition:transform .35s ease,box-shadow .35s ease;animation:vcFadeUp .7s ease-out both}\
.vc-card:hover{transform:translateY(-3px);box-shadow:0 28px 80px rgba(2,6,23,0.55),0 0 0 1px rgba(56,189,248,0.2),0 0 50px rgba(56,189,248,0.06)}\
.vc-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px);background-size:30px 30px;pointer-events:none}\
.vc-orb1{position:absolute;top:-35px;right:-35px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.12) 0%,transparent 70%);animation:vcOrbDrift 7s ease-in-out infinite;pointer-events:none}\
.vc-orb2{position:absolute;bottom:-25px;left:-25px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,0.09) 0%,transparent 70%);animation:vcOrbDrift 9s ease-in-out 2s infinite;pointer-events:none}\
.vc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;position:relative;z-index:2}\
.vc-header-left{display:flex;align-items:center;gap:10px}\
.vc-header-icon{font-size:20px;filter:drop-shadow(0 0 8px rgba(56,189,248,0.3))}\
.vc-header-title{color:#e2e8f0;font-size:15px;font-weight:800;letter-spacing:0.2px;font-family:Tajawal,sans-serif}\
.vc-badge{display:flex;align-items:center;gap:6px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.18);border-radius:99px;padding:4px 12px 4px 8px}\
.vc-badge-text{color:#34d399;font-size:11px;font-weight:700;letter-spacing:0.5px;font-family:Tajawal,sans-serif}\
.vc-pulse-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px}\
.vc-pulse-dot{position:absolute;width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,0.6)}\
.vc-pulse-ring{position:absolute;width:6px;height:6px;border-radius:50%;border:1.5px solid #34d399;animation:vcPulseRing 2s ease-out infinite}\
.vc-stats{display:flex;align-items:center;justify-content:center;gap:16px;position:relative;z-index:2}\
.vc-stat{display:flex;flex-direction:column;align-items:center;gap:10px;flex:1}\
.vc-icon-box{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:2px}\
.vc-icon-box.visits{background:linear-gradient(135deg,#1e3a5f,#0c4a6e);box-shadow:0 6px 22px rgba(56,189,248,0.12);animation:vcGlow 3.5s ease-in-out infinite}\
.vc-icon-box.live{background:linear-gradient(135deg,#1a3a2a,#064e3b);box-shadow:0 6px 22px rgba(16,185,129,0.12)}\
.vc-icon-box span{font-size:20px}\
.vc-digits{display:flex;gap:4px;direction:ltr}\
.vc-digit{position:relative;width:34px;height:46px;border-radius:10px;background:linear-gradient(180deg,rgba(15,23,42,0.95),rgba(30,41,59,0.55));border:1px solid rgba(56,189,248,0.1);display:flex;align-items:center;justify-content:center;overflow:hidden;animation:vcDigitIn .5s ease-out both;transition:transform .3s cubic-bezier(0.4,0,0.2,1)}\
.vc-digit:nth-child(1){animation-delay:0ms}.vc-digit:nth-child(2){animation-delay:80ms}.vc-digit:nth-child(3){animation-delay:160ms}.vc-digit:nth-child(4){animation-delay:240ms}.vc-digit:nth-child(5){animation-delay:320ms}\
.vc-digit .num{font-size:24px;font-weight:800;font-family:"JetBrains Mono","Courier New",monospace;color:#f0f9ff;text-shadow:0 0 14px rgba(56,189,248,0.5),0 2px 4px rgba(0,0,0,0.4);position:relative;z-index:2}\
.vc-digit .shine{position:absolute;top:0;left:0;right:0;height:48%;background:linear-gradient(to bottom,rgba(255,255,255,0.035),transparent);border-radius:10px 10px 0 0;pointer-events:none}\
.vc-digit .mid-line{position:absolute;top:50%;left:4px;right:4px;height:1px;background:rgba(56,189,248,0.05);pointer-events:none}\
.vc-digit.flip{transform:rotateX(90deg)}\
.vc-live-num{font-size:40px;font-weight:900;font-family:"JetBrains Mono","Courier New",monospace;color:#f0fdf4;text-shadow:0 0 22px rgba(16,185,129,0.5),0 2px 4px rgba(0,0,0,0.4);line-height:1;direction:ltr;height:46px;display:flex;align-items:center}\
.vc-label-blue{color:#38bdf8;font-size:13px;font-weight:700;letter-spacing:0.3px;font-family:Tajawal,sans-serif}\
.vc-label-green{color:#34d399;font-size:13px;font-weight:700;letter-spacing:0.3px;font-family:Tajawal,sans-serif}\
.vc-sub-label{color:rgba(148,163,184,0.4);font-size:9px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;direction:ltr;margin-top:-3px}\
.vc-v-divider{position:relative;width:1px;height:100px;background:linear-gradient(to bottom,transparent,rgba(56,189,248,0.12),transparent)}\
.vc-v-divider::after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:3px;height:20px;border-radius:2px;background:rgba(56,189,248,0.18);filter:blur(2px)}\
.vc-footer{margin-top:16px;position:relative;z-index:2}\
.vc-footer-bar{height:1px;margin-bottom:10px;background:linear-gradient(to left,transparent,rgba(56,189,248,0.08),transparent)}\
.vc-footer-inner{display:flex;align-items:center;justify-content:center;gap:6px;color:rgba(148,163,184,0.35);font-size:10px;font-weight:600;letter-spacing:0.3px;font-family:Tajawal,sans-serif}\
.vc-footer-dot{color:#34d399;font-size:7px;animation:vcFooterBlink 2s ease-in-out infinite}\
.vc-sparkle{position:absolute;border-radius:50%;background:rgba(255,255,255,0.1);pointer-events:none;animation:vcSparkle 4s ease-in-out infinite}\
@keyframes vcFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}\
@keyframes vcPulseRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.8);opacity:0}}\
@keyframes vcSparkle{0%,100%{opacity:0;transform:scale(.5) translateY(0)}50%{opacity:1;transform:scale(1.3) translateY(-8px)}}\
@keyframes vcOrbDrift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(10px,-10px) scale(1.1)}66%{transform:translate(-6px,5px) scale(.95)}}\
@keyframes vcFooterBlink{0%,100%{opacity:.35}50%{opacity:1}}\
@keyframes vcDigitIn{from{opacity:0;transform:translateY(10px) scale(.88)}to{opacity:1;transform:translateY(0) scale(1)}}\
@keyframes vcGlow{0%,100%{box-shadow:0 0 8px rgba(56,189,248,.15)}50%{box-shadow:0 0 16px rgba(56,189,248,.35)}}\
@media(max-width:768px){.vc-digit{width:30px;height:40px}.vc-digit .num{font-size:20px}.vc-live-num{font-size:34px;height:40px}.vc-card{padding:20px 16px 14px}}\
.visitor-stats-bar{display:none!important}\
';
  document.head.appendChild(style);

  // ━━━━━━ PATCH renderHome TO INJECT COUNTER HTML ━━━━━━
  var _origRenderHome = window.renderHome;
  window.renderHome = function(el) {
    _origRenderHome(el);

    // Remove old visitor bar if exists
    var oldBar = document.getElementById('visitorStatsBar');
    if (oldBar) oldBar.remove();

    // Inject new counter
    var target = el.querySelector('.chapter-grid');
    if (!target) target = el.querySelector('.fade-in');
    if (!target) return;

    var counterDiv = document.createElement('div');
    counterDiv.innerHTML = '\
<div class="vc-wrap" id="visitor-counter">\
  <div class="vc-card">\
    <div class="vc-sparkle" style="left:12%;top:15%;width:2.5px;height:2.5px;animation-delay:0s"></div>\
    <div class="vc-sparkle" style="left:85%;top:25%;width:3px;height:3px;animation-delay:1.2s"></div>\
    <div class="vc-sparkle" style="left:45%;top:80%;width:2px;height:2px;animation-delay:2.4s"></div>\
    <div class="vc-sparkle" style="left:70%;top:10%;width:3px;height:3px;animation-delay:0.8s"></div>\
    <div class="vc-sparkle" style="left:25%;top:70%;width:2px;height:2px;animation-delay:3s"></div>\
    <div class="vc-grid-bg"></div>\
    <div class="vc-orb1"></div>\
    <div class="vc-orb2"></div>\
    <div class="vc-header">\
      <div class="vc-header-left">\
        <span class="vc-header-icon">📊</span>\
        <span class="vc-header-title">إحصائيات الموقع</span>\
      </div>\
      <div class="vc-badge">\
        <span class="vc-pulse-wrap"><span class="vc-pulse-dot"></span><span class="vc-pulse-ring"></span></span>\
        <span class="vc-badge-text">مباشر</span>\
      </div>\
    </div>\
    <div class="vc-stats">\
      <div class="vc-stat">\
        <div class="vc-icon-box visits"><span>👁️</span></div>\
        <div class="vc-digits" id="vc-total-digits">\
          <div class="vc-digit"><span class="num">0</span><div class="shine"></div><div class="mid-line"></div></div>\
          <div class="vc-digit"><span class="num">9</span><div class="shine"></div><div class="mid-line"></div></div>\
          <div class="vc-digit"><span class="num">0</span><div class="shine"></div><div class="mid-line"></div></div>\
          <div class="vc-digit"><span class="num">1</span><div class="shine"></div><div class="mid-line"></div></div>\
        </div>\
        <div class="vc-label-blue">إجمالي الزيارات</div>\
        <div class="vc-sub-label">Total Visits</div>\
      </div>\
      <div class="vc-v-divider"></div>\
      <div class="vc-stat">\
        <div class="vc-icon-box live"><span>⚡</span></div>\
        <div class="vc-live-num" id="vc-live-count">1</div>\
        <div class="vc-label-green">متصل الآن</div>\
        <div class="vc-sub-label">Live Visitors</div>\
      </div>\
    </div>\
    <div class="vc-footer">\
      <div class="vc-footer-bar"></div>\
      <div class="vc-footer-inner">\
        <span class="vc-footer-dot">●</span>\
        <span>تحديث تلقائي</span>\
      </div>\
    </div>\
  </div>\
</div>';

    target.parentNode.insertBefore(counterDiv.firstElementChild, target.nextSibling);

    // Start counter logic after DOM is ready
    setTimeout(startCounter, 100);
  };

  // ━━━━━━ COUNTER LOGIC ━━━━━━
  function startCounter() {
    var digitsEl = document.getElementById('vc-total-digits');
    var liveEl = document.getElementById('vc-live-count');
    if (!digitsEl || !liveEl) return;

    function getVid() {
      var k = '_vc_sid', id = null;
      try { id = sessionStorage.getItem(k); } catch(e) {}
      if (!id) {
        id = 'v' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        try { sessionStorage.setItem(k, id); } catch(e) {}
      }
      return id;
    }

    function isBot() {
      try {
        var ua = (navigator.userAgent || '').toLowerCase();
        if (/bot|crawl|spider|slurp|facebook|twitter|whatsapp|telegram|preview|fetch|curl|wget|headless|phantom|puppeteer|selenium|lighthouse/i.test(ua)) return true;
        if (navigator.webdriver === true) return true;
        if (!navigator.languages || navigator.languages.length === 0) return true;
      } catch(e) {}
      return false;
    }

    function wasCounted() {
      try {
        var ts = localStorage.getItem('_vc_ts');
        if (!ts) return false;
        return (Date.now() - parseInt(ts, 10)) < COOLDOWN_MS;
      } catch(e) { return false; }
    }

    function markCounted() {
      try { localStorage.setItem('_vc_ts', String(Date.now())); } catch(e) {}
    }

    function updateDigits(num) {
      var str = String(num);
      while (str.length < 4) str = '0' + str;
      var chars = str.split('');
      if (digitsEl.children.length !== chars.length) {
        digitsEl.innerHTML = '';
        for (var i = 0; i < chars.length; i++) {
          var d = document.createElement('div');
          d.className = 'vc-digit';
          d.innerHTML = '<span class="num">' + chars[i] + '</span><div class="shine"></div><div class="mid-line"></div>';
          digitsEl.appendChild(d);
        }
        return;
      }
      for (var j = 0; j < chars.length; j++) {
        var numEl = digitsEl.children[j].querySelector('.num');
        if (numEl && numEl.textContent !== chars[j]) {
          (function(el, ch, box) {
            box.classList.add('flip');
            setTimeout(function() { el.textContent = ch; box.classList.remove('flip'); }, 150);
          })(numEl, chars[j], digitsEl.children[j]);
        }
      }
    }

    function updateLive(n) { liveEl.textContent = String(Math.max(1, n)); }

    var vid = getVid();

    function getLive() {
      try { var d = localStorage.getItem('_vc_live'); return d ? JSON.parse(d) : {}; }
      catch(e) { return {}; }
    }

    function registerLive() {
      var s = getLive(), now = Date.now();
      s[vid] = now;
      var a = {};
      for (var id in s) {
        if (s.hasOwnProperty(id) && (now - s[id]) < LIVE_TIMEOUT) a[id] = s[id];
      }
      try { localStorage.setItem('_vc_live', JSON.stringify(a)); } catch(e) {}
      return Object.keys(a).length;
    }

    function removeLive() {
      var s = getLive(); delete s[vid];
      try { localStorage.setItem('_vc_live', JSON.stringify(s)); } catch(e) {}
    }

    if (isBot()) return;

    // Local counting
    var localData;
    try { localData = JSON.parse(localStorage.getItem('_vc_data') || 'null'); } catch(e) { localData = null; }
    if (!localData) localData = { totalVisits: 0 };

    if (!wasCounted()) {
      localData.totalVisits = (localData.totalVisits || 0) + 1;
      markCounted();
      try { localStorage.setItem('_vc_data', JSON.stringify(localData)); } catch(e) {}
    }

    var currentTotal = BASE_COUNT + localData.totalVisits;
    updateDigits(currentTotal);

    // External API for cross-device counting
    var useExternal = false;
    try {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 4000;
      xhr.onload = function() {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && typeof data.value === 'number') {
            useExternal = true;
            currentTotal = BASE_COUNT + data.value;
            updateDigits(currentTotal);
          }
        } catch(e) {}
      };
      var extCounted = false;
      try { extCounted = !!sessionStorage.getItem('_vc_ext'); } catch(e) {}
      if (!wasCounted() && !extCounted) {
        xhr.open('GET', 'https://api.countapi.xyz/hit/awatif-math-platform/page-views', true);
        try { sessionStorage.setItem('_vc_ext', '1'); } catch(e) {}
      } else {
        xhr.open('GET', 'https://api.countapi.xyz/get/awatif-math-platform/page-views', true);
      }
      xhr.onerror = xhr.ontimeout = function() {};
      xhr.send();
    } catch(e) {}

    // Live visitors
    updateLive(registerLive());

    // Heartbeat
    setInterval(function() { updateLive(registerLive()); }, HEARTBEAT_MS);

    // Polling
    setInterval(function() {
      var s = getLive(), now = Date.now(), c = 0;
      for (var id in s) {
        if (s.hasOwnProperty(id) && (now - s[id]) < LIVE_TIMEOUT) c++;
      }
      updateLive(c);
      if (useExternal) {
        try {
          var x2 = new XMLHttpRequest();
          x2.timeout = 3000;
          x2.onload = function() {
            try {
              var d = JSON.parse(x2.responseText);
              if (d && typeof d.value === 'number') updateDigits(BASE_COUNT + d.value);
            } catch(e) {}
          };
          x2.open('GET', 'https://api.countapi.xyz/get/awatif-math-platform/page-views', true);
          x2.send();
        } catch(e) {}
      }
    }, POLL_MS);

    // Cleanup
    window.addEventListener('beforeunload', removeLive);
  }
}
