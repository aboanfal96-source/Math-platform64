/*
 * عداد الزيارات الاحترافي v4 — منصة الرياضيات الذكية
 * يعتمد على localStorage (موثوق 100%) مع حماية من التكرار
 *
 * التركيب:
 * 1. ارفعي هذا الملف بجانب index.html في GitHub
 * 2. أضيفي قبل </body>:
 *    <script src="visitor-counter.js"></script>
 */

(function(){
  'use strict';

  // ━━━ CONFIG ━━━
  var BASE = 900;
  var COOLDOWN = 600000;   // 10 دقائق
  var LIVE_TTL = 180000;   // 3 دقائق
  var HEARTBEAT = 45000;
  var POLL = 12000;

  // ━━━ INJECT CSS ━━━
  var css = document.createElement('style');
  css.textContent = [
    '@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&display=swap");',
    '.visitor-stats-bar{display:none!important}',
    '.vc-wrap{display:flex;justify-content:center;padding:20px 12px;width:100%}',
    '.vc-card{position:relative;overflow:hidden;width:100%;max-width:460px;border-radius:20px;padding:24px 20px 16px;background:linear-gradient(160deg,#020617,#0c1a3a 45%,#0f172a);box-shadow:0 16px 60px rgba(2,6,23,.45),0 0 0 1px rgba(56,189,248,.08);transition:transform .35s,box-shadow .35s;animation:vcUp .7s ease-out both}',
    '.vc-card:hover{transform:translateY(-3px);box-shadow:0 28px 80px rgba(2,6,23,.55),0 0 0 1px rgba(56,189,248,.2)}',
    '.vc-gbg{position:absolute;inset:0;background-image:linear-gradient(rgba(56,189,248,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.025) 1px,transparent 1px);background-size:30px 30px;pointer-events:none}',
    '.vc-orb1{position:absolute;top:-35px;right:-35px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.12),transparent 70%);animation:vcDrift 7s ease-in-out infinite;pointer-events:none}',
    '.vc-orb2{position:absolute;bottom:-25px;left:-25px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.09),transparent 70%);animation:vcDrift 9s ease-in-out 2s infinite;pointer-events:none}',
    '.vc-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;position:relative;z-index:2}',
    '.vc-hl{display:flex;align-items:center;gap:10px}',
    '.vc-hi{font-size:20px;filter:drop-shadow(0 0 8px rgba(56,189,248,.3))}',
    '.vc-ht{color:#e2e8f0;font-size:15px;font-weight:800;font-family:Tajawal,sans-serif}',
    '.vc-bg{display:flex;align-items:center;gap:6px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.18);border-radius:99px;padding:4px 12px 4px 8px}',
    '.vc-bt{color:#34d399;font-size:11px;font-weight:700;font-family:Tajawal,sans-serif}',
    '.vc-pw{position:relative;display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px}',
    '.vc-pd{position:absolute;width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.6)}',
    '.vc-pr{position:absolute;width:6px;height:6px;border-radius:50%;border:1.5px solid #34d399;animation:vcPR 2s ease-out infinite}',
    '.vc-st{display:flex;align-items:center;justify-content:center;gap:16px;position:relative;z-index:2}',
    '.vc-sc{display:flex;flex-direction:column;align-items:center;gap:10px;flex:1}',
    '.vc-ib{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:2px}',
    '.vc-ib.v{background:linear-gradient(135deg,#1e3a5f,#0c4a6e);box-shadow:0 6px 22px rgba(56,189,248,.12);animation:vcGl 3.5s ease-in-out infinite}',
    '.vc-ib.l{background:linear-gradient(135deg,#1a3a2a,#064e3b);box-shadow:0 6px 22px rgba(16,185,129,.12)}',
    '.vc-ib span{font-size:20px}',
    '.vc-ds{display:flex;gap:4px;direction:ltr}',
    '.vc-d{position:relative;width:34px;height:46px;border-radius:10px;background:linear-gradient(180deg,rgba(15,23,42,.95),rgba(30,41,59,.55));border:1px solid rgba(56,189,248,.1);display:flex;align-items:center;justify-content:center;overflow:hidden;animation:vcDI .5s ease-out both;transition:transform .3s cubic-bezier(.4,0,.2,1)}',
    '.vc-d:nth-child(1){animation-delay:0ms}.vc-d:nth-child(2){animation-delay:80ms}.vc-d:nth-child(3){animation-delay:160ms}.vc-d:nth-child(4){animation-delay:240ms}.vc-d:nth-child(5){animation-delay:320ms}',
    '.vc-d .n{font-size:24px;font-weight:800;font-family:"JetBrains Mono",monospace;color:#f0f9ff;text-shadow:0 0 14px rgba(56,189,248,.5),0 2px 4px rgba(0,0,0,.4);position:relative;z-index:2}',
    '.vc-d .sh{position:absolute;top:0;left:0;right:0;height:48%;background:linear-gradient(to bottom,rgba(255,255,255,.035),transparent);border-radius:10px 10px 0 0;pointer-events:none}',
    '.vc-d .ml{position:absolute;top:50%;left:4px;right:4px;height:1px;background:rgba(56,189,248,.05);pointer-events:none}',
    '.vc-d.flip{transform:rotateX(90deg)}',
    '.vc-ln{font-size:40px;font-weight:900;font-family:"JetBrains Mono",monospace;color:#f0fdf4;text-shadow:0 0 22px rgba(16,185,129,.5),0 2px 4px rgba(0,0,0,.4);line-height:1;direction:ltr;height:46px;display:flex;align-items:center}',
    '.vc-lb{color:#38bdf8;font-size:13px;font-weight:700;font-family:Tajawal,sans-serif}',
    '.vc-lg{color:#34d399;font-size:13px;font-weight:700;font-family:Tajawal,sans-serif}',
    '.vc-sl{color:rgba(148,163,184,.4);font-size:9px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;direction:ltr;margin-top:-3px}',
    '.vc-vd{position:relative;width:1px;height:100px;background:linear-gradient(to bottom,transparent,rgba(56,189,248,.12),transparent)}',
    '.vc-vd::after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:3px;height:20px;border-radius:2px;background:rgba(56,189,248,.18);filter:blur(2px)}',
    '.vc-ft{margin-top:16px;position:relative;z-index:2}',
    '.vc-fb{height:1px;margin-bottom:10px;background:linear-gradient(to left,transparent,rgba(56,189,248,.08),transparent)}',
    '.vc-fi{display:flex;align-items:center;justify-content:center;gap:6px;color:rgba(148,163,184,.35);font-size:10px;font-weight:600;font-family:Tajawal,sans-serif}',
    '.vc-fp{color:#34d399;font-size:7px;animation:vcFB 2s ease-in-out infinite}',
    '.vc-sp{position:absolute;border-radius:50%;background:rgba(255,255,255,.1);pointer-events:none;animation:vcSp 4s ease-in-out infinite}',
    '@keyframes vcUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes vcPR{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.8);opacity:0}}',
    '@keyframes vcSp{0%,100%{opacity:0;transform:scale(.5) translateY(0)}50%{opacity:1;transform:scale(1.3) translateY(-8px)}}',
    '@keyframes vcDrift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(10px,-10px) scale(1.1)}66%{transform:translate(-6px,5px) scale(.95)}}',
    '@keyframes vcFB{0%,100%{opacity:.35}50%{opacity:1}}',
    '@keyframes vcDI{from{opacity:0;transform:translateY(10px) scale(.88)}to{opacity:1;transform:translateY(0) scale(1)}}',
    '@keyframes vcGl{0%,100%{box-shadow:0 0 8px rgba(56,189,248,.15)}50%{box-shadow:0 0 16px rgba(56,189,248,.35)}}',
    '@media(max-width:768px){.vc-d{width:30px;height:40px}.vc-d .n{font-size:20px}.vc-ln{font-size:34px;height:40px}.vc-card{padding:20px 16px 14px}}'
  ].join('');
  document.head.appendChild(css);

  // ━━━ COUNTER HTML ━━━
  var COUNTER_HTML = '<div class="vc-wrap" id="visitor-counter"><div class="vc-card">' +
    '<div class="vc-sp" style="left:12%;top:15%;width:2.5px;height:2.5px;animation-delay:0s"></div>' +
    '<div class="vc-sp" style="left:85%;top:25%;width:3px;height:3px;animation-delay:1.2s"></div>' +
    '<div class="vc-sp" style="left:45%;top:80%;width:2px;height:2px;animation-delay:2.4s"></div>' +
    '<div class="vc-sp" style="left:70%;top:10%;width:3px;height:3px;animation-delay:.8s"></div>' +
    '<div class="vc-gbg"></div><div class="vc-orb1"></div><div class="vc-orb2"></div>' +
    '<div class="vc-hd"><div class="vc-hl"><span class="vc-hi">📊</span><span class="vc-ht">إحصائيات الموقع</span></div>' +
    '<div class="vc-bg"><span class="vc-pw"><span class="vc-pd"></span><span class="vc-pr"></span></span><span class="vc-bt">مباشر</span></div></div>' +
    '<div class="vc-st"><div class="vc-sc">' +
    '<div class="vc-ib v"><span>👁️</span></div>' +
    '<div class="vc-ds" id="vc-digits"></div>' +
    '<div class="vc-lb">إجمالي الزيارات</div><div class="vc-sl">Total Visits</div></div>' +
    '<div class="vc-vd"></div>' +
    '<div class="vc-sc"><div class="vc-ib l"><span>⚡</span></div>' +
    '<div class="vc-ln" id="vc-live">1</div>' +
    '<div class="vc-lg">متصل الآن</div><div class="vc-sl">Live Visitors</div></div></div>' +
    '<div class="vc-ft"><div class="vc-fb"></div><div class="vc-fi"><span class="vc-fp">●</span><span>تحديث تلقائي</span></div></div>' +
    '</div></div>';

  // ━━━ UTILS ━━━
  function vid(){var k='_vcsid',v;try{v=sessionStorage.getItem(k)}catch(e){}if(!v){v='v'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);try{sessionStorage.setItem(k,v)}catch(e){}}return v}
  function bot(){try{var u=(navigator.userAgent||'').toLowerCase();if(/bot|crawl|spider|slurp|facebook|twitter|whatsapp|telegram|preview|fetch|curl|wget|headless|phantom|puppeteer|selenium|lighthouse/i.test(u))return!0;if(navigator.webdriver)return!0;if(!navigator.languages||!navigator.languages.length)return!0}catch(e){}return!1}
  function cooled(){try{var t=localStorage.getItem('_vcts');return t&&(Date.now()-parseInt(t,10))<COOLDOWN}catch(e){return!1}}
  function markCool(){try{localStorage.setItem('_vcts',String(Date.now()))}catch(e){}}

  // ━━━ DIGIT RENDERING ━━━
  function setDigits(el,num){
    var s=String(num);while(s.length<4)s='0'+s;var c=s.split('');
    if(el.children.length!==c.length){
      el.innerHTML='';
      for(var i=0;i<c.length;i++){var d=document.createElement('div');d.className='vc-d';d.innerHTML='<span class="n">'+c[i]+'</span><div class="sh"></div><div class="ml"></div>';el.appendChild(d)}
      return;
    }
    for(var j=0;j<c.length;j++){
      var n=el.children[j].querySelector('.n');
      if(n&&n.textContent!==c[j]){
        (function(n2,ch,bx){bx.classList.add('flip');setTimeout(function(){n2.textContent=ch;bx.classList.remove('flip')},150)})(n,c[j],el.children[j]);
      }
    }
  }

  // ━━━ LIVE TRACKING ━━━
  var myId=vid();
  function getLive(){try{var d=localStorage.getItem('_vclive');return d?JSON.parse(d):{}}catch(e){return{}}}
  function regLive(){var s=getLive(),now=Date.now();s[myId]=now;var a={};for(var id in s){if(s.hasOwnProperty(id)&&(now-s[id])<LIVE_TTL)a[id]=s[id]}try{localStorage.setItem('_vclive',JSON.stringify(a))}catch(e){}return Object.keys(a).length}
  function rmLive(){var s=getLive();delete s[myId];try{localStorage.setItem('_vclive',JSON.stringify(s))}catch(e){}}

  // ━━━ MAIN COUNTER LOGIC ━━━
  function getTotal(){try{var v=localStorage.getItem('_vctotal');return v?parseInt(v,10):0}catch(e){return 0}}
  function setTotal(n){try{localStorage.setItem('_vctotal',String(n))}catch(e){}}

  function runCounter(){
    if(bot())return;

    // Count visit
    var total=getTotal();
    if(!cooled()){
      total++;
      setTotal(total);
      markCool();
    }

    var display=BASE+total;

    // Find DOM
    var digEl=document.getElementById('vc-digits');
    var livEl=document.getElementById('vc-live');
    if(!digEl||!livEl)return;

    setDigits(digEl,display);
    livEl.textContent=String(Math.max(1,regLive()));

    // Heartbeat
    setInterval(function(){
      if(livEl)livEl.textContent=String(Math.max(1,regLive()));
    },HEARTBEAT);

    // Poll
    setInterval(function(){
      var t=BASE+getTotal();
      if(digEl)setDigits(digEl,t);
      var s=getLive(),now=Date.now(),c=0;
      for(var id in s){if(s.hasOwnProperty(id)&&(now-s[id])<LIVE_TTL)c++}
      if(livEl)livEl.textContent=String(Math.max(1,c));
    },POLL);

    window.addEventListener('beforeunload',rmLive);
  }

  // ━━━ PATCH renderHome ━━━
  var orig=window.renderHome;
  window.renderHome=function(el){
    orig(el);
    // Remove old bar
    var old=document.getElementById('visitorStatsBar');
    if(old)old.remove();
    // Inject counter
    var grid=el.querySelector('.chapter-grid');
    if(grid){
      var tmp=document.createElement('div');
      tmp.innerHTML=COUNTER_HTML;
      grid.parentNode.insertBefore(tmp.firstElementChild,grid.nextSibling);
    }
    setTimeout(runCounter,100);
  };
})();
