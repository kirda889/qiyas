/* نافذة الاشتراك والنسخة المجانية لمواقع qiyas (تُحقن في النسخة المجانية فقط؛ النسخة الكاملة لا تحتويها).
   الإعداد في window.__PWCFG يكتبه build.py. التطبيق يستدعي window.PW إن وُجد:
   PW.locked(id) · PW.gate(what) · PW.open(reason) · PW.banner() · PW.lockCard(lesson) · PW.afterDiag(weak) · PW.diag */
(function () {
  "use strict";
  var C = window.__PWCFG; if (!C) return;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  // نص زر الاشتراك في البانرات (2026-11-01): «افتح كامل الأسئلة · 89 ريال» بدل «النسخة الكاملة · من 59» اللي تلخبط مع سعر الكامل
  function fullBtn() { return C.plus ? "افتح كامل الأسئلة · " + N(C.plus.price) + " ريال" : "افتح النسخة الكاملة · " + N(C.plan.price) + " ريال"; }
  var N = function (n) { return Number(n).toLocaleString("en-US"); };
  var LOCK = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
  var WA = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.2 5.2 0 0 0 3.2.6 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
  var TG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.6zM9.6 14.3l-.4 4-1.4-4.6 10.8-6.8-9 7.4z"/></svg>';
  var waLink = function (t) { return "https://wa.me/" + C.wa + "?text=" + encodeURIComponent(t); };
  // أحداث القمع (GoatCounter إن وُجد): view_pricing · click_whatsapp · code_entered — عين الموقع 2026-10-20
  var ev = function (n) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: n, event: true }); } catch (e) {} try { var u = "https://api.yousefalshamrani.com/v1/ev"; if (navigator.sendBeacon) navigator.sendBeacon(u, n); else fetch(u, { method: "POST", body: n, keepalive: true }); } catch (e) {} };
  var srcCode = function () { try { return localStorage.getItem("qx.src") || ""; } catch (e) { return ""; } };
  // خصم الزارع (طلب يوسف 2026-11-05): لكل زوار موقع التربوي من أي رابط (تعميم يوسف 2026-11-05)، 15%. مكتوب «يوم واحد» بس بلا موعد انتهاء في الكود: يوسف وحده ينهيه. البوت يعرف السعر من «المرجع» في رسالة الواتساب.
  var PROMO = { key: "qx.promo.tarbawi", price: { plus: 75, plan: 50 } }, promoBase = null;
  var promoU = ""; try { promoU = (new URLSearchParams(location.search).get("src") || "").toLowerCase(); } catch (e) {}   // يُقرأ مرة عند الفتح: التطبيق قد يمسح الرابط، والتخزين قد يكون ممنوعاً (عميل 2026-11-05 وصل مرجعه بلا رمز)
  var promoSrc = function () { return promoU || srcCode(); };
  var promoOk = function () { return false; };   // خصم الزارع أُزيل من البطاقة والزر العائم (طلب يوسف 2026-11-07)، وكان: C.site === "tarbawi" && !!C.plus
  var promoOn = function () { return !!promoBase; };
  var promoSet = function (on) {
    if (on && !promoBase) { promoBase = { plus: C.plus.price, plan: C.plan.price }; C.plus.price = PROMO.price.plus; C.plan.price = PROMO.price.plan; try { localStorage.setItem(PROMO.key, "1"); } catch (e) {} }
    if (!on && promoBase) { C.plus.price = promoBase.plus; C.plan.price = promoBase.plan; promoBase = null; }
  };
  var promoSync = function () { if (!promoOk()) return promoSet(false); var f = null; try { f = localStorage.getItem(PROMO.key); } catch (e) {} if (f) promoSet(true); };
  promoSync();
  var promoApply = function () { promoSet(true); ev("promo_apply/" + C.site + "/" + promoSrc()); try { document.querySelectorAll("button,a,span").forEach(function (el) { if (!el.children.length && /^افتح (كامل الأسئلة|النسخة الكاملة) · /.test((el.textContent || "").trim())) el.textContent = fullBtn(); }); } catch (e) {} var f = document.getElementById("pw-promo-fab"); if (f) f.remove(); };
  // لحظة الخصم (طلب يوسف 2026-11-05): ينشطب المبلغ القديم بخط يترسم، والسعر ينزل عدّاً إلى الجديد
  var promoAnim = function (sheet) {
    if (!sheet) return; try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (e) {}
    sheet.classList.add("pw-anim");
    [].forEach.call(sheet.querySelectorAll("[data-to]"), function (el) { var a = +el.dataset.from, b = +el.dataset.to, t0 = 0, D = 750, W = 250; el.textContent = N(a);
      var step = function (t) { if (!t0) t0 = t; var p = Math.min(1, Math.max(0, (t - t0 - W) / D)), e = 1 - Math.pow(1 - p, 3); el.textContent = N(Math.round(a + (b - a) * e)); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); });
    setTimeout(function () { sheet.classList.remove("pw-anim"); }, 1500);
  };
  var daysLeft = function () { if (C.noCount) return null; return Math.round((new Date((C.countTo || C.until) + "T12:00:00") - new Date()) / 864e5); };
  var free = C.free || [];
  // رابط «اذهب للدرس» من قناة التليجرام (2026-10-29، طلب يوسف): ‎?src=chl#lesson-L06 يفتح هذا الدرس المقفل كاملاً على هذا الجهاز،
  // واختباره وبطاقاته وباقي الدروس المقفلة تبقى مقفلة (لحظة البيع). المحتوى في chl-<id>.js يكتبه free_page.mjs.
  var chlKey = "qx.chl." + C.site, chl = [];
  try { chl = JSON.parse(localStorage.getItem(chlKey) || "[]"); } catch (e) {}
  var chlM = /[?&]src=chl\b/.test(location.search) && /^#lesson-(L\d+)$/.exec(location.hash);
  if (chlM && free.indexOf(chlM[1]) < 0 && (C.chlVer || {})[chlM[1]] && chl.indexOf(chlM[1]) < 0) { chl.push(chlM[1]); try { localStorage.setItem(chlKey, JSON.stringify(chl)); } catch (e) {} }
  var chlRead = {}, chlDeep = {};
  var chlMerge = function () { if (window.DEEP) for (var k in chlDeep) if (!window.DEEP[k]) window.DEEP[k] = chlDeep[k]; };
  window.__chlDone = function (x) {
    var l = (window.LESSONS || []).filter(function (y) { return y.id === x.id; })[0]; if (!l) return;
    l.sec = x.sec; l.trap = x.trap; chlRead[x.id] = true;
    for (var k in x.deep || {}) chlDeep[k] = x.deep[k];
    chlMerge(); try { dispatchEvent(new Event("qx-deep")); } catch (e) {}   // الدرس المفتوح يعيد رسم نفسه
  };
  addEventListener("qx-deep", chlMerge);
  chl.forEach(function (id) { if (!(C.chlVer || {})[id]) return; var s = document.createElement("script"); s.src = "chl-" + id + ".js?v=" + C.chlVer[id]; s.async = true; document.head.appendChild(s); });
  var daysWord = function (n) { return n === 1 ? "يوم واحد" : n === 2 ? "يومان" : n <= 10 ? N(n) + " أيام" : N(n) + " يوماً"; };
  var perDay = function () { return null; };   // السعر باليوم أُلغي (2026-10-24، طلب يوسف: «ما لها داعي»)

  var css = [
    ".pw-dim{position:fixed;inset:0;z-index:300;background:rgba(8,14,11,.5);opacity:0;transition:opacity .25s;display:flex;align-items:flex-end;justify-content:center}",
    ".pw-dim.on{opacity:1}",
    ".pw-sheet{width:min(560px,100%);max-height:92vh;overflow:auto;background:var(--sheet,#fff);color:var(--ink,#172420);border-radius:22px 22px 0 0;padding:20px 20px calc(22px + env(safe-area-inset-bottom,0px));transform:translateY(24px);transition:transform .3s cubic-bezier(.2,.8,.2,1);box-shadow:0 -12px 40px rgba(0,0,0,.25);font-family:inherit;text-align:right;direction:rtl}",
    "@media (min-width:700px){.pw-dim{align-items:center}.pw-sheet{border-radius:22px}}",
    ".pw-dim.on .pw-sheet{transform:none}",
    ".pw-x{float:left;width:34px;height:34px;border-radius:50%;border:1px solid var(--rule,#D9E1DD);background:none;color:inherit;font:inherit;cursor:pointer}",
    ".pw-k{font-size:.78rem;font-weight:800;color:var(--accent,#1F6B4C)}",
    ".pw-sheet h2{margin:4px 0 6px;font-size:1.35rem;line-height:1.4}",
    ".pw-why{margin:0 0 10px;padding:8px 12px;border-radius:12px;background:color-mix(in srgb,var(--accent,#1F6B4C) 9%,transparent);font-size:.9rem}",
    ".pw-ul{list-style:none;margin:10px 0 14px;padding:0;display:grid;gap:7px}.pw-ul li{position:relative;padding-inline-start:24px;font-size:.93rem;line-height:1.6}.pw-ul li::before{content:'';position:absolute;inset-inline-start:2px;top:.45em;width:13px;height:7px;border:solid var(--accent,#1F6B4C);border-width:0 0 2.2px 2.2px;transform:rotate(-45deg)}",
    ".pw-prices{display:grid;gap:8px;margin:6px 0 12px}",
    ".pw-p{display:flex;align-items:center;gap:12px;border:1.5px solid var(--rule,#D9E1DD);border-radius:16px;padding:12px 14px;text-decoration:none;color:inherit;background:var(--sheet,#fff)}",
    ".pw-sheet [hidden],.pw-banner [hidden]{display:none!important}",
    "a.pw-p{cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .12s,box-shadow .12s}a.pw-p:hover{box-shadow:0 2px 10px rgba(0,0,0,.08)}a.pw-p:active{transform:scale(.985)}",
    ".pw-p.alt{opacity:.92}.pw-p.alt b{font-size:1.2rem}",
    ".pw-sold{display:inline-flex;align-items:center;gap:4px;width:max-content;margin-bottom:4px;padding:2px 9px;border-radius:999px;font-size:.72rem!important;font-weight:800;opacity:1!important;color:#fff;background:linear-gradient(135deg,#E0A526,#C9821A)}",
    ".pw-p.main{border-color:var(--accent,#1F6B4C);background:color-mix(in srgb,var(--accent,#1F6B4C) 6%,transparent)}",
    ".pw-p b{font-size:1.5rem;font-variant-numeric:tabular-nums;white-space:nowrap}.pw-p b small{font-size:.8rem;font-weight:700;opacity:.75;margin-inline-start:3px}",
    ".pw-p .pw-pt{flex:1;min-width:0}.pw-p .pw-pt .pw-pl{display:block;font-size:.95rem;font-weight:800;opacity:1}.pw-p .pw-pt span{display:block;font-size:.8rem;opacity:.75;line-height:1.5}",
    ".pw-p .pw-go{display:inline-flex;align-items:center;gap:6px;background:#1E9E57;color:#fff;border-radius:999px;padding:8px 13px;font-weight:800;font-size:.85rem;white-space:nowrap;text-decoration:none}",
    ".pw-dot{display:flex;gap:8px;align-items:center;margin:6px 0 10px;padding:7px 11px;border-radius:11px;background:color-mix(in srgb,var(--accent,#1F6B4C) 9%,transparent);font-size:.84rem;line-height:1.6}.pw-dot::before{content:'';flex:none;width:7px;height:7px;border-radius:50%;background:#2E9B6A;box-shadow:0 0 0 4px rgba(46,155,106,.18)}.pw-dot[hidden]{display:none}",
    ".pw-score{display:flex;gap:14px;align-items:center;margin:10px 0 12px;padding:12px 14px;border-radius:16px;border:1px solid var(--rule,#DCE5E0);background:color-mix(in srgb,#C9A24A 9%,var(--sheet,#fff))}",
    ".pw-ring{flex:none;width:70px;height:70px;border-radius:50%;background:conic-gradient(var(--accent,#1F6B4C) 0 78%,var(--rule,#DCE5E0) 78% 100%);display:grid;place-items:center}.pw-ring span{width:55px;height:55px;border-radius:50%;background:var(--sheet,#fff);display:grid;place-items:center;font-weight:900;font-size:1.05rem}",
    ".pw-score b{display:block;font-size:.98rem;font-weight:800}.pw-score b i{font-style:normal;background:var(--accent,#1F6B4C);color:var(--accent-ink,#fff);border-radius:7px;padding:0 8px;font-size:.76rem;margin-inline-start:4px;vertical-align:2px}.pw-score p{margin:2px 0 4px;font-size:.8rem;opacity:.75;line-height:1.6}",
    ".pw-ex{display:inline-block;font-size:.72rem;border:1px solid var(--rule,#DCE5E0);border-radius:7px;padding:0 6px;margin-inline-end:4px;opacity:.8;background:var(--sheet,#fff)}",
    ".pw-chk{list-style:none;padding:0;display:grid;gap:8px}.pw-chk li{position:relative;padding-inline-start:30px;line-height:1.65}.pw-chk li::before{content:'✓';position:absolute;inset-inline-start:0;top:2px;width:21px;height:21px;border:0;transform:none;border-radius:7px;display:grid;place-items:center;font-size:.75rem;font-weight:900;color:var(--accent,#1F6B4C);background:color-mix(in srgb,var(--accent,#1F6B4C) 12%,transparent)}",
    ".pw-p.pw-cta{background:var(--accent,#1F6B4C);border-color:var(--accent,#1F6B4C);color:var(--accent-ink,#fff);padding:14px 16px}.pw-cta .pw-pt .pw-pl{font-size:1.15rem}.pw-cta .pw-pt span{opacity:.9}.pw-cta .pw-go.tg{background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.4)}",
    ".pw-p.pw-sec{padding:10px 14px}.pw-p.pw-sec b{font-size:1.2rem}",
    ".pw-guar{display:flex;gap:10px;align-items:center;margin:10px 0 0;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,#C9A24A 14%,transparent);font-size:.86rem;line-height:1.6}.pw-seal{flex:none;width:32px;height:32px;border-radius:50%;border:2px solid #B7862F;color:#B7862F;display:grid;place-items:center;font-weight:900;font-size:.8rem}",
    ":root[data-theme=dark] .pw-th,:root[data-theme=dark] .pw-p.pw-cta2{color:#0F1512}@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .pw-th,:root:not([data-theme=light]) .pw-p.pw-cta2{color:#0F1512}}",
    /* بطاقة التذكرة (2026-10-24): مسافات بمقياس واحد تتمدد مع طول الشاشة (--s)، والنافذة ترتفع حتى 90% ومجموعتاها تتباعدان */
    ".pw-sheet.pw-tk{--s:clamp(8px,1.5vh,16px);display:flex;flex-direction:column;justify-content:space-between;gap:calc(var(--s)*1.5);min-height:min(90vh,760px);max-height:96vh;padding:calc(var(--s)*1.25) 20px calc(var(--s)*1.5 + env(safe-area-inset-bottom,0px))}",
    ".pw-tkg,.pw-tkb{display:flex;flex-direction:column}.pw-tkb{gap:calc(var(--s)*.85)}",
    ".pw-tkk{display:flex;justify-content:space-between;align-items:center;font-size:.82rem;font-weight:700;color:var(--accent-text,var(--accent,#1F6B4C))}.pw-tkd{display:flex;align-items:center;gap:10px;opacity:.85;font-weight:600}.pw-tk .pw-x{position:static;float:none;width:32px;height:32px;display:grid;place-items:center;padding:0}",
    ".pw-tk h2{margin:var(--s) 0 calc(var(--s)*1.25);font-size:1.38rem;line-height:1.35;font-weight:800}",
    ".pw-ticket{border:1.5px solid var(--accent,#1F6B4C);border-radius:20px;overflow:hidden;background:var(--sheet,#fff)}",
    ".pw-th{display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--accent,#1F6B4C);color:#fff;padding:calc(var(--s)*.9 + 4px) 18px}.pw-th span{display:block;font-size:.78rem;opacity:.9}.pw-th b{display:block;font-size:1.08rem;font-weight:800;line-height:1.5;margin:1px 0}.pw-th .pw-sold{margin-top:6px}",
    ".pw-tp{display:flex;flex-direction:column;align-items:center;gap:4px;line-height:1}.pw-tp b{font-size:2.3rem;font-weight:900}.pw-tp span{font-size:.8rem}",
    ".pw-perf{height:0;border-top:2px dashed color-mix(in srgb,var(--accent,#1F6B4C) 45%,transparent);margin:0 14px;position:relative}.pw-perf::before,.pw-perf::after{content:'';position:absolute;top:-11px;width:20px;height:20px;border-radius:50%;background:var(--sheet,#fff);border:1.5px solid var(--accent,#1F6B4C)}.pw-perf::before{right:-25px}.pw-perf::after{left:-25px}",
    ".pw-tl{list-style:none;margin:0;padding:calc(var(--s)*.6 + 5px) 16px calc(var(--s)*.6 + 6px);display:grid;gap:calc(var(--s)*.6)}.pw-tl li{position:relative;padding-inline-start:32px;font-size:.9rem;line-height:1.6}.pw-tl li b{font-weight:800}.pw-tl li::before{content:'✓';position:absolute;inset-inline-start:0;top:1px;width:22px;height:22px;border-radius:7px;display:grid;place-items:center;font-size:.74rem;font-weight:900;color:var(--accent,#1F6B4C);background:color-mix(in srgb,var(--accent,#1F6B4C) 12%,transparent)}",
    ".pw-tk .pw-dot{margin:var(--s) 0 0;padding:0;background:none;justify-content:center;font-size:.82rem;opacity:.85}",
    ".pw-p.pw-cta2{margin:0;justify-content:space-between;background:var(--accent,#1F6B4C);border-color:var(--accent,#1F6B4C);color:#fff;padding:calc(var(--s)*.35 + 3px) 12px;border-radius:18px}.pw-cta2 .pw-pl{font-size:1.25rem;font-weight:800}.pw-cta2 .pw-go{min-width:140px}",
    ".pw-tk .pw-wa{margin:0;padding:2px 0;border:0;justify-content:center;font-size:.9rem;line-height:1.5}.pw-tk .pw-wa svg{width:20px;height:20px}",
    ".pw-tk .pw-guar{margin:0;padding:0;background:none;justify-content:center;gap:8px;font-size:.84rem;line-height:1.5;opacity:.92}.pw-tk .pw-seal{width:24px;height:24px;font-size:.72rem;border-width:1.5px}.pw-tk .pw-msg:empty{display:none}.pw-tk .pw-tkb .pw-hr{height:1px;background:var(--rule,#DCE5E0);margin:2px 24px}",
    ".pw-codel{margin:2px 0 0;text-align:center;font-size:.86rem;opacity:.85}.pw-codel a{color:var(--accent-text,var(--accent,#1F6B4C));font-weight:800}.pw-tk .pw-code{margin:0}",
    /* نافذة الخيارين (2026-10-24): مقياس 8/16/24، الأخضر للمختار والزر فقط، المسافة بين المجموعات ضعف ما داخلها */
    ".pw-sheet.pw-tk2{max-height:96vh;padding:16px 20px calc(20px + env(safe-area-inset-bottom,0px))}",
    ".pw-tk2 .pw-tkk{display:flex;justify-content:space-between;align-items:center;font-size:.82rem;font-weight:700;color:var(--accent-text,var(--accent,#1F6B4C))}.pw-tk2 .pw-tkd{display:flex;align-items:center;gap:12px;opacity:.85;font-weight:600}.pw-tk2 .pw-x{position:static;float:none;width:32px;height:32px;display:grid;place-items:center;padding:0}",
    ".pw-tk2 h2{margin:8px 0 4px;font-size:1.4rem;line-height:1.3;font-weight:800}.pw-sub{display:flex;gap:8px;align-items:center;margin:0;font-size:.82rem;opacity:.8;line-height:1.6}.pw-sub::before{content:'';flex:none;width:7px;height:7px;border-radius:50%;background:#2E9B6A;box-shadow:0 0 0 4px rgba(46,155,106,.16)}.pw-sub[hidden]{display:none}",
    ".pw-opts{display:grid;gap:8px;margin-top:12px}",
    "small.mm{display:inline!important;margin:0!important;font-weight:400;font-size:.82em;opacity:.9;white-space:nowrap}",   // «(مماثلة)» في نفس السطر دائماً (طلب يوسف 2026-11-07)
    ".pw-promo{display:flex;align-items:center;gap:12px;width:100%;margin:10px 0 0;padding:6px 12px 6px 6px;font:inherit;color:inherit;text-align:start;border:1.5px solid #17A862;border-radius:40px;background:color-mix(in srgb,#17C76F 10%,transparent);cursor:pointer;-webkit-tap-highlight-color:transparent}.pw-promo b{display:block;font-size:.95rem;font-weight:800;line-height:1.4}.pw-promo small{display:block;font-size:.78rem;line-height:1.4;opacity:.8}.pw-promo.on{cursor:default;padding-block:4px}",
    ".pw-promo i{flex:none;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:1.05rem;font-weight:900;color:#fff;background:#0E9F57;box-shadow:0 0 0 3px rgba(23,199,111,.28);direction:ltr}.pw-promo.on i{width:36px;height:36px;font-size:.8rem}",
    ".pw-tp s,.pw-ap s{display:block;position:relative;text-decoration:none;font-size:.85rem;font-weight:600;opacity:.75;line-height:1.1}.pw-ap s{display:inline-block;margin:0 8px}.pw-tp s::after,.pw-ap s::after{content:'';position:absolute;inset-inline:-3px;top:50%;height:2px;margin-top:-1px;border-radius:2px;background:currentColor;transform:rotate(-10deg)}",
    ".pw-anim .pw-tp s,.pw-anim .pw-ap s{animation:pwold .7s ease both}.pw-anim .pw-tp s::after,.pw-anim .pw-ap s::after{animation:pwstrike .45s .2s ease-out both}.pw-anim [data-to]{display:inline-block;animation:pwnew .5s .75s ease-out}.pw-anim .pw-promo i{animation:pwnew .5s ease-out}@keyframes pwstrike{from{transform:rotate(-10deg) scaleX(0)}to{transform:rotate(-10deg) scaleX(1)}}@keyframes pwold{from{font-size:1.7rem;opacity:1}to{font-size:.85rem;opacity:.75}}@keyframes pwnew{0%{transform:scale(1)}45%{transform:scale(1.22)}100%{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.pw-anim .pw-tp s,.pw-anim .pw-ap s,.pw-anim .pw-tp s::after,.pw-anim .pw-ap s::after,.pw-anim [data-to],.pw-anim .pw-promo i{animation:none}}",
    "#pw-promo-fab{position:fixed;left:14px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:900;width:78px;height:78px;padding:0;border:3px solid #fff;border-radius:50%;background:#0E9F57;color:#fff;font:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;line-height:1.15;cursor:pointer;box-shadow:0 8px 22px rgba(8,80,44,.38);animation:pwfab 2.4s ease-in-out 4;-webkit-tap-highlight-color:transparent}html.pw-open #pw-promo-fab{display:none}#pw-promo-fab b{font-size:1.15rem;font-weight:900;direction:ltr}#pw-promo-fab span{font-size:.62rem;font-weight:800}#pw-promo-fab small{font-size:.6rem;font-weight:700;opacity:.95}@keyframes pwfab{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@media (prefers-reduced-motion:reduce){#pw-promo-fab{animation:none}}",
    ".pw-tkt{position:relative;border:2px solid var(--accent,#1F6B4C);border-radius:20px;overflow:hidden;background:var(--sheet,#fff)}.pw-tag{position:absolute;top:0;left:16px;background:#C9A24A;color:#3A2A05;font-size:.7rem;font-weight:800;border-radius:0 0 8px 8px;padding:1px 10px}",
    ".pw-th2{display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--accent,#1F6B4C);color:#fff;padding:10px 16px}.pw-tkt .pw-tag~.pw-th2{padding-top:26px}.pw-th2 .pw-tp b{line-height:1}.pw-t2{display:flex;gap:10px;align-items:center;text-align:start}.pw-th2 b{display:block;font-size:1.06rem;font-weight:800;line-height:1.4}.pw-th2 small{display:block;font-size:.76rem;opacity:.88;line-height:1.5}",
    ".pw-rad{flex:none;width:22px;height:22px;border-radius:50%;border:2px solid currentColor;display:grid;place-items:center}.pw-rad.on::after{content:'';width:10px;height:10px;border-radius:50%;background:currentColor}",
    ".pw-tk2 .pw-tp b{font-size:2rem}.pw-tk2 .pw-perf{margin:0 12px}.pw-tk2 .pw-perf::before,.pw-tk2 .pw-perf::after{border-width:2px;top:-11px}.pw-tk2 .pw-perf::before{right:-24px}.pw-tk2 .pw-perf::after{left:-24px}",
    ".pw-tk2 .pw-tl{padding:10px 16px 12px;gap:6px}.pw-tk2 .pw-tl li{font-size:.88rem;line-height:1.6}",
    ".pw-alt{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;font:inherit;color:inherit;text-align:start;border:1px solid var(--rule,#DCE5E0);border-radius:16px;background:none;padding:12px 16px;cursor:pointer;-webkit-tap-highlight-color:transparent}.pw-alt .pw-rad{color:color-mix(in srgb,currentColor 40%,transparent)}.pw-alt b{display:block;font-size:.95rem;font-weight:800;line-height:1.4}.pw-alt small{display:block;font-size:.76rem;opacity:.75;line-height:1.5}.pw-alt:active{transform:scale(.99)}",
    ".pw-alt.up{border-color:color-mix(in srgb,#C9A24A 70%,transparent);background:color-mix(in srgb,#C9A24A 8%,transparent)}.pw-alt.up small{opacity:1;color:#8A6416;font-weight:700}",
    ".pw-ap{font-size:1.25rem;font-weight:900;white-space:nowrap}.pw-ap small{display:inline;font-size:.72rem;font-weight:600;opacity:.7;margin-inline-start:2px}",
    ".pw-tk2 .pw-cta2{margin-top:16px;min-height:54px;padding:8px 8px 8px 16px;border-radius:16px}.pw-tk2 .pw-cta2 .pw-pl{padding-inline-start:8px}",
    ".pw-tk2 .pw-guar a{color:inherit;opacity:.75}.pw-tk2 .pw-guar{margin:12px 0 0;padding:0;background:none;justify-content:center;gap:8px;font-size:.82rem;line-height:1.5}.pw-tk2 .pw-seal{width:22px;height:22px;font-size:.68rem;border-width:1.5px}",
    ".pw-tk2 .pw-hr{height:1px;background:var(--rule,#DCE5E0);margin:12px 24px 10px}",
    ".pw-foot2{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:.84rem}.pw-foot2 .pw-tm{color:inherit;font-weight:600;opacity:.7}.pw-wa2{display:flex;gap:6px;align-items:center;color:#14773F;text-decoration:none}.pw-wa2 svg{width:18px;height:18px;flex:none}.pw-wa2 b{font-weight:800}.pw-foot2 .pw-codel{margin:0;white-space:nowrap}",
    ".pw-code2{align-items:center;gap:0;border:1.5px solid var(--rule,#D9E1DD);border-radius:14px;padding:4px;background:var(--paper,#F4F7F5)}.pw-code2 label{flex:none;padding:0 10px 0 6px;font-weight:800;font-size:.95rem;color:var(--ink,#172420);white-space:nowrap}.pw-code2 input{border:0!important;background:transparent!important;padding:8px 4px!important}.pw-code2 button{align-self:stretch;padding:0 16px}",
    ".pw-tk2 .pw-code{margin:10px 0 0}.pw-tk2 .pw-msg:empty{display:none}.pw-terms{margin:8px 0 0;text-align:center;font-size:.72rem;opacity:.6}.pw-terms a{color:inherit}",
    ":root[data-theme=dark] .pw-th2,:root[data-theme=dark] .pw-tk2 .pw-cta2{color:#0F1512}@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .pw-th2,:root:not([data-theme=light]) .pw-tk2 .pw-cta2{color:#0F1512}}:root[data-theme=dark] .pw-wa2{color:#7BD8A2}@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .pw-wa2{color:#7BD8A2}:root:not([data-theme=light]) .pw-alt.up small{color:#E0B85C}}:root[data-theme=dark] .pw-alt.up small{color:#E0B85C}",
    ".pw-wa{display:flex;align-items:center;gap:10px;margin:10px 0 0;padding:11px 14px;border:1.5px solid #1E9E57;border-radius:14px;color:#14773F;text-decoration:none;font-size:.88rem;line-height:1.6;-webkit-tap-highlight-color:transparent}.pw-wa svg{flex:none;color:#1E9E57}.pw-wa b{font-weight:800;margin-inline-end:4px}.pw-wa:active{transform:scale(.985)}",
    ":root[data-theme=dark] .pw-wa{color:#7BD8A2;border-color:#3FB873}",
    ".pw-gos{display:grid;gap:6px;flex:none}.pw-p .pw-go.tg{background:#229ED9}.pw-gos .pw-go{justify-content:center;min-height:38px}",
    ".pw-steps{margin:2px 0 12px;font-size:.84rem;opacity:.8;line-height:1.7}",
    ".pw-save{display:block;font-size:.78rem;font-weight:700;color:var(--accent-text,var(--accent,#1F6B4C));opacity:1!important}",
    ".pw-ok{margin:0 0 8px;font-size:.86rem;font-weight:600;color:var(--good,#1B7A4A)}",
    ".pw-res{border:1px solid color-mix(in srgb,var(--accent,#1F6B4C) 30%,transparent);background:color-mix(in srgb,var(--accent,#1F6B4C) 6%,transparent);border-radius:18px;padding:14px 16px;display:grid;gap:8px}",
    ".pw-res p{margin:0;font-size:.95rem;line-height:1.75}.pw-res .pw-btn{justify-self:start}.pw-res small{font-size:.8rem;opacity:.85;line-height:1.6}.pw-res a{color:var(--accent-text,var(--accent,#1F6B4C));font-weight:600}",
    ".pw-nudge{margin-top:10px;padding:8px 12px;border-radius:12px;background:color-mix(in srgb,var(--accent,#1F6B4C) 7%,transparent);font-size:.88rem;line-height:1.7}.pw-nudge a{color:var(--accent-text,var(--accent,#1F6B4C));font-weight:700}",
    ".pw-bank{border:1.5px solid var(--accent,#1F6B4C);border-radius:16px;padding:12px 14px;margin:0 0 12px;display:grid;gap:8px;background:color-mix(in srgb,var(--accent,#1F6B4C) 5%,transparent)}",
    ".pw-bk{display:grid;gap:2px;font-size:.92rem}.pw-bk b{font-size:1rem}.pw-bk code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:1rem;letter-spacing:.04em;direction:ltr;text-align:left;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-radius:10px;padding:6px 10px;overflow-wrap:anywhere}",
    ".pw-btn.q{background:none;color:var(--accent,#1F6B4C);border:1.5px solid currentColor;text-decoration:none}",
    ".pw-code{display:flex;gap:8px;margin:6px 0 4px}.pw-code input{flex:1;min-width:0;font:inherit;font-size:1rem;letter-spacing:.06em;text-align:center;direction:ltr;border:1.5px solid var(--rule,#D9E1DD);border-radius:12px;padding:10px;background:var(--paper,#F4F7F5);color:inherit;text-transform:uppercase}",
    ".pw-code button{font:inherit;font-weight:800;border:0;border-radius:12px;padding:0 18px;background:var(--ink,#172420);color:var(--sheet,#fff);cursor:pointer}",
    ".pw-msg{min-height:1.4em;font-size:.86rem;margin:2px 0 8px}.pw-msg.bad{color:#B42318}.pw-msg.good{color:#1E7A45}",
    ".pw-foot{border-top:1px solid var(--rule,#D9E1DD);padding-top:10px;margin-top:6px;font-size:.8rem;opacity:.8;line-height:1.8}.pw-foot a{color:inherit}",
    /* داخل التطبيق */
    ".pw-banner{border:1px solid color-mix(in srgb,var(--accent,#1F6B4C) 28%,transparent);border-radius:18px;padding:12px 14px;display:grid;gap:8px;background:color-mix(in srgb,var(--accent,#1F6B4C) 5%,transparent)}",
    ".pw-banner p{margin:0;font-size:.9rem;line-height:1.7}.pw-row{display:flex;gap:8px;flex-wrap:wrap}",
    ".pw-btn{font:inherit;font-weight:800;font-size:.9rem;border:0;border-radius:999px;padding:9px 16px;cursor:pointer;background:var(--accent,#1F6B4C);color:var(--accent-ink,#fff);display:inline-flex;align-items:center;gap:6px}",
    ".pw-btn.q{background:none;color:var(--accent,#1F6B4C);border:1.5px solid currentColor}",
    ".pw-lock{border-radius:18px;padding:16px;border:1px solid var(--rule,#D9E1DD);background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--accent,#1F6B4C) 7%,transparent));display:grid;gap:8px;text-align:center;justify-items:center;margin-top:-30px;position:relative}",
    ".pw-lock::before{content:'';position:absolute;left:0;right:0;top:-60px;height:60px;background:linear-gradient(transparent,var(--sheet,#fff));pointer-events:none}",
    ".pw-lock h3{margin:0;font-size:1.05rem}.pw-lock p{margin:0;font-size:.88rem;opacity:.85;line-height:1.7}",
    ".pw-ic{display:inline-flex;vertical-align:-2px;opacity:.7;margin-inline-start:4px}",
    // خانة الكود الظاهرة أضافت سطراً (2026-10-27): نضغط المسافات حتى تبقى النافذة شاشة واحدة على آيفون 13
    ".pw-tk2 .pw-tl{padding:6px 16px 8px;gap:2px}.pw-tk2 .pw-th2{padding:8px 16px}.pw-tk2 .pw-cta2{margin-top:12px;min-height:50px}.pw-tk2 .pw-hr{margin:8px 24px 6px}.pw-tk2 .pw-code2{margin:8px 0 0;padding:2px}.pw-tk2 .pw-code2 input{padding:6px 4px!important}.pw-guar a{color:inherit;opacity:.75;font-weight:600}"
  ].join("\n");
  function addCss() { if (document.getElementById("pw-css")) return; var st = document.createElement("style"); st.id = "pw-css"; st.textContent = css; document.head.appendChild(st); }

  // العدّاد الحقيقي (2026-10-23): كم شخصاً أنهى الأسئلة المجانية (20 من 2026-10-23، وقبلها 60)؛ يظهر فقط إذا تجاوز C.proofMin (يوسف يراه دائماً بأمر /counter في البوت)
  var PROOF = null, SOLD = {}, PAYON = false, VIA = null;   // VIA: «telegram» أو «whatsapp» من الخادم — يوسف يبدّله من البوت بـ/tg و/wa
  // لو تحوّل لتيليجرام بعد ما انفتحت النافذة: نعدّل زر «اشترك» نفسه بدل ما نعيد رسمها
  var applyVia = function () { if (!dim || VIA !== "telegram" || !C.tgBot || promoOn()) return;   // خصم الزارع: يبقى واتساب لأن البوت يقرأ السعر من المرجع
    [].forEach.call(dim.querySelectorAll("a.pw-cta2[data-prod]"), function (a) { if (a.dataset.ch === "telegram" || a.dataset.ch === "card") return; a.href = "https://t.me/" + esc(C.tgBot) + "?start=" + a.dataset.prod; a.setAttribute("target", "_blank"); a.dataset.ch = "telegram"; var g = a.querySelector(".pw-go"); if (g) { g.classList.add("tg"); g.innerHTML = TG + "تيليجرام"; } }); };
  // الدفع الإلكتروني (2026-10-23): متى قال الخادم pay=true، زر «اشترك» يفتح صفحة الدفع بمدى وآبل باي (الكود فوراً)، والبوت يبقى للتحويل
  var card = function () { if (!PAYON || !dim) return;
    [].forEach.call(dim.querySelectorAll("a.pw-p[data-prod]"), function (a) { a.href = "/qiyas/pay/?p=" + a.dataset.prod; a.removeAttribute("target"); a.dataset.ch = "card"; var g = a.querySelector(".pw-go"); if (g) { g.classList.remove("tg"); g.textContent = "ادفع"; } });
    var st = dim.querySelector(".pw-steps"); if (st) st.innerHTML = 'اضغط «ادفع»: تدفع بـ<b>مدى أو آبل باي أو البطاقة</b>، ويظهر لك <b>كود الدخول فوراً</b> ويفتح الموقع كاملاً. أو حوّل بالطرق تحت وأرسل الإيصال في <a href="https://t.me/' + esc(C.tgBot) + '" target="_blank" rel="noopener">بوت تيليجرام</a>.'; };
  function fillProof() {
    var sold = function () { card(); var min = C.soldMin || 10; [].forEach.call(document.querySelectorAll(".pw-sold"), function (el) { var n = ({ T: ["T", "U"], E: ["E", "F"], B: ["B", "C"] }[el.dataset.p] || [el.dataset.p]).reduce(function (t, k) { return t + (SOLD[k] || 0); }, 0); if (n >= min) { el.textContent = "✓ تم الشراء " + N(n) + " مرة"; el.hidden = false; } }); };
    var go = function (n) { sold(); var min = C.proofMin || 300; if (!n || n < min) return; var t = "أكثر من " + N(Math.floor(n / 50) * 50) + " معلم ومعلمة حلّوا الأسئلة المجانية";
      [].forEach.call(document.querySelectorAll(".pw-proof"), function (el) { el.textContent = t; el.hidden = false; }); };
    if (PROOF !== null) { go(PROOF); return applyVia(); }
    try { fetch("https://api.yousefalshamrani.com/v1/proof").then(function (r) { return r.json(); }).then(function (d) { SOLD = d.sold || {}; PAYON = !!d.pay; VIA = d.via || null; PROOF = d[{ english2: "en2" }[C.site] || C.site] || 0; go(PROOF); applyVia(); }).catch(function () { PROOF = 0; }); } catch (e) { PROOF = 0; }
  }
  function sheetHtml(reason, pick) {
    var d = daysLeft(), exp = null; try { exp = localStorage.getItem("qx.expired." + C.site); } catch (e) {}
    var msg = function (pl) { var sc = promoOn() ? promoSrc() : srcCode(); return "السلام عليكم، أبغى الاشتراك في " + (/الاختباران/.test(pl.label) ? "" : C.exam + " — ") + pl.label + " (" + pl.price + " ريال) من موقع yousefalshamrani.com/qiyas" + " — المرجع: " + C.site + "-" + pl.price + (sc ? "-" + sc : ""); };
    // خياران (2026-10-24، قرار يوسف): الخيار اللي ضغطه العميل في الموقع يطلع «تذكرة» بتفاصيله، والثاني سطر هادئ تحته يبدّل بضغطة.
    // كامل الأسئلة 89 هو الافتراضي؛ وإذا ضغط «أهم 120» (59) يطلع سطر الكامل بسنارة «+N سؤالاً بـ30 ريال فقط» (أسعار 2026-11-01).
    var S1 = { english2: "E", tarbawi: "T", step: "S" }[C.site] || C.site, S2 = { english2: "F", tarbawi: "U" }[C.site];
    var nAll = C.similarTotal || 0, nT = C.tierN || 120, nQ = Math.floor((C.qTotal || 0) / 100) * 100;
    // ملزمتا الدروس (2026-10-26، طلب يوسف): «كامل الأسئلة» فيه المفصّلة 20 صفحة والمختصرة 15، و«أهم 120» فيه المختصرة فقط
    var SUMP = C.summary ? ["<b>ملزمة شرح الدروس</b> تُقرأ في الموقع"] : [], SUMI = C.summaryLite ? ["<b>ملزمة شرح مختصرة</b> تُقرأ في الموقع"] : [];
    var O = { plus: C.plus && S2 ? { pl: C.plus, prod: S2, title: "كامل الأسئلة", sub: (nQ ? "أكثر من " + N(nQ) + " سؤال<br>" : "") + "منها " + N(nAll) + " من الخمس سنوات <small class=mm>(مماثلة)</small>", tag: "الأشمل",
        items: (nQ ? ["<b>أكثر من " + N(nQ) + " سؤال</b> في الموقع بشرحها"] : []).concat(["<b>" + N(nAll) + " سؤالاً</b> من الخمس سنوات الماضية <small class=mm>(مماثلة)</small>"]).concat([ "<b>ملزمة أهم " + N(nT) + " PDF</b> محلولة"].concat(SUMP, ["<b>3 اختبارات موقوتة</b> ومستواك المتوقع"])) } : null,
      single: { pl: C.plan, prod: S1, title: C.site === "step" ? "دليل STEP كاملاً" : "أهم " + N(nT) + " سؤالاً", sub: C.site === "step" ? "القواعد والمفردات والقراءة والاستماع" : "من الثلاث سنوات الماضية <small class=mm>(مماثلة)</small><br>+ الملزمة والمحاكيات",
        items: C.site === "step" ? C.includes.slice(0, 3).map(function (x) { return esc(x); }) : ["<b>" + N(nT) + " سؤالاً</b> من الثلاث سنوات الماضية <small class=mm>(مماثلة)</small>", "<b>ملزمة أهم " + N(nT) + " PDF</b> محلولة"].concat(SUMI, ["<b>3 اختبارات موقوتة</b> ومستواك المتوقع"]) } };
    if (!O.plus) pick = "single"; else if (pick !== "single") pick = "plus";
    var cur = O[pick], other = pick === "plus" ? O.single : O.plus, otherKey = pick === "plus" ? "single" : "plus";
    // زر «اشترك» يفتح واتساب يوسف برسالة جاهزة فيها الاختبار والمنتج والسعر والمرجع (طلب يوسف 2026-10-27: واتساب فقط بدل البوت)
    var ch = promoOn() && C.wa ? "whatsapp" : VIA === "telegram" && C.tgBot ? "telegram" : C.wa ? "whatsapp" : C.tgBot || C.tgUser ? "telegram" : "whatsapp";
    var href = function (o) { return ch === "whatsapp" ? waLink(msg(o.pl)) : C.tgBot ? "https://t.me/" + esc(C.tgBot) + "?start=" + o.prod : "https://t.me/" + esc(C.tgUser) + "?text=" + encodeURIComponent(msg(o.pl)); };
    var was = function (k) { return promoOn() ? "<s>" + N(promoBase[k === "single" ? "plan" : k]) + "</s>" : ""; };
    var cnt = function (k) { var kk = k === "single" ? "plan" : k; return promoOn() ? ' data-from="' + promoBase[kk] + '" data-to="' + PROMO.price[kk] + '"' : ""; };
    var promoRow = !promoOk() ? "" : promoOn() ? '<div class="pw-promo on"><i>15%</i><span><b>طُبّق خصم الزارع</b><small>خصم يوم واحد</small></span></div>' : '<button type="button" class="pw-promo" data-pw="promo"><i>15%</i><span><b>خصم الزارع · يوم واحد</b><small>اضغط الدائرة وينزل السعر إلى ' + N(PROMO.price[pick === "single" ? "plan" : pick]) + " ريال</small></span></button>";
    var rad = function (on) { return '<span class="pw-rad' + (on ? " on" : "") + '"></span>'; };
    var altSub = !other ? "" : otherKey === "plus" ? "+" + N(nAll - nT) + " سؤالاً إضافياً بـ" + N(other.pl.price - cur.pl.price) + " ريال فقط" : other.sub;
    return '<div class="pw-sheet pw-tk2" role="dialog" aria-modal="true" aria-labelledby="pw-t">' +
      '<div class="pw-tkk"><span>' + esc(C.exam) + '</span><span class="pw-tkd">' + '<button type="button" data-pw="gocode" style="all:unset;cursor:pointer;font:inherit;font-weight:700;color:inherit;text-decoration:underline;text-underline-offset:3px;padding:10px 0">عندي كود</button>' + '<button class="pw-x" data-pw="close" aria-label="إغلاق">✕</button></span></div>' +
      '<h2 id="pw-t">' + (C.site === "step" ? "افتح الدليل كاملاً" : "جهّز مقعدك في الاختبار") + '</h2>' +
      (exp ? '<p class="pw-why">انتهت مدة اشتراكك (' + esc(exp) + "). تقدر تجدد باشتراك جديد من هنا.</p>" : "") +
      '<p class="pw-proof pw-sub" hidden></p>' +
      promoRow + '<div class="pw-opts"><div class="pw-tkt">' + (cur.tag ? '<span class="pw-tag">' + cur.tag + "</span>" : "") +
        '<div class="pw-th2"><div class="pw-t2">' + rad(true) + '<div><b>' + cur.title + '</b><small>' + cur.sub + '</small></div></div><div class="pw-tp">' + was(pick) + '<b' + cnt(pick) + '>' + N(cur.pl.price) + '</b><span>ريال</span></div></div>' +
        '<div class="pw-perf"></div><ul class="pw-tl">' + cur.items.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>" +
      (other ? '<button type="button" class="pw-alt' + (otherKey === "plus" ? " up" : "") + '" data-pw="pick" data-v="' + otherKey + '"><span class="pw-t2">' + rad(false) + '<span><b>' + other.title + '</b><small>' + altSub + '</small></span></span><span class="pw-ap">' + was(otherKey) + '<span' + cnt(otherKey) + '>' + N(other.pl.price) + "</span><small>ريال</small></span></button>" : "") + "</div>" +
      '<a class="pw-p pw-cta2" data-ch="' + ch + '" data-prod="' + cur.prod + '" data-plan="' + pick + '" href="' + href(cur) + '" target="_blank" rel="noopener"><span class="pw-pl">اشترك</span><span class="pw-gos"><span class="pw-go' + (ch === "telegram" ? ' tg">' + TG + "تيليجرام" : '">' + WA + "واتساب") + "</span></span></a>" +
      '<div class="pw-guar"><span class="pw-seal">3</span><span><b>ضمان 3 أيام:</b> إذا ما ناسبك يرجع لك المبلغ كاملاً · <a href="' + C.terms + '">الشروط</a></span></div>' +
      '<div class="pw-hr"></div><div class="pw-foot2">' +
        (C.wa && ch !== "whatsapp" ? '<a class="pw-wa2" data-ch="whatsapp" data-plan="direct" href="' + waLink("السلام عليكم أستاذ يوسف، أبغى الاشتراك في " + C.exam + " — من الموقع (المرجع: " + (srcCode() || "site") + ")") + '" target="_blank" rel="noopener">' + WA + '<span><b>تفضّل الواتساب؟</b> يكلمك يوسف الشمراني بنفسه</span></a>' : "") +
        "</div>" +
      // خانة الكود ظاهرة دائماً (2026-10-27، طلب يوسف): العميل ما كان يلقى وين يحط الكود خلف «عندك كود؟ أدخله»
      '<div class="pw-code pw-code2" id="pw-cb"><label for="pw-c">أدخل الكود</label><input id="pw-c" autocomplete="one-time-code" placeholder="X-XXXXX-XXXXX" dir="ltr"><button data-pw="code">فتح</button></div><div class="pw-msg" id="pw-m" role="status"></div></div>';
  }
  var dim = null;
  function open(reason, pick) {
    addCss(); close(true); promoSync(); document.documentElement.classList.add("pw-open");
    dim = document.createElement("div"); dim.className = "pw-dim"; dim.innerHTML = sheetHtml(reason, pick); setTimeout(fillProof, 0);
    document.body.appendChild(dim); document.documentElement.style.overflow = "hidden"; ev("view_pricing/" + C.site);
    requestAnimationFrame(function () { dim.classList.add("on"); });
    dim.addEventListener("click", function (e) {
      var go = e.target.closest("[data-ch]"); if (go) ev("click_" + go.dataset.ch + "/" + C.site + "/" + go.dataset.plan);
      var b = e.target.closest("[data-pw]"); if (e.target === dim) return close();
      if (!b) return; if (b.dataset.pw === "close") return close();
      // الخانة تحت حد الشاشة في الآيفون (2026-11-06، يوسف ما شافها): الرابط يوصله لها بضغطة
      if (b.dataset.pw === "gocode") { var cf = dim.querySelector("#pw-c"); if (cf) { cf.scrollIntoView({ block: "center" }); cf.focus({ preventScroll: true }); } return; }
      if (b.dataset.pw === "promo") { promoApply(); var oldP = dim.querySelector(".pw-sheet"), plan = dim.querySelector(".pw-cta2").dataset.plan, tmpP = document.createElement("div"); tmpP.innerHTML = sheetHtml(reason, plan); oldP.replaceWith(tmpP.firstChild); dim.querySelector(".pw-sheet").style.transform = "none"; promoAnim(dim.querySelector(".pw-sheet")); fillProof(); var ci3 = dim.querySelector("#pw-c"); if (ci3) ci3.addEventListener("keydown", function (e3) { if (e3.key === "Enter") tryCode(); }); return; }
      if (b.dataset.pw === "pick") { var old = dim.querySelector(".pw-sheet"); var tmp = document.createElement("div"); tmp.innerHTML = sheetHtml(reason, b.dataset.v); old.replaceWith(tmp.firstChild); dim.querySelector(".pw-sheet").style.transform = "none"; fillProof(); var ci2 = dim.querySelector("#pw-c"); if (ci2) ci2.addEventListener("keydown", function (e2) { if (e2.key === "Enter") tryCode(); }); ev("pick_" + b.dataset.v + "/" + C.site); return; } if (b.dataset.pw === "showcode") { e.preventDefault(); var cb = dim.querySelector("#pw-cb"), cl = dim.querySelector("#pw-cl"); if (cb) cb.hidden = false; if (cl) cl.hidden = true; var ci = dim.querySelector("#pw-c"); if (ci) ci.focus(); return; } if (b.dataset.pw === "code") return tryCode();
      if (b.dataset.pw === "iban" || b.dataset.pw === "wallet") { var ib = b.dataset.pw === "wallet" ? C.pay.wallet : C.pay.iban, lbl = b.textContent; var done = function () { b.textContent = "تم النسخ ✓"; setTimeout(function () { b.textContent = lbl; }, 1800); }; if (navigator.clipboard) navigator.clipboard.writeText(ib).then(done, done); else { try { var t = document.createElement("textarea"); t.value = ib; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); } catch (e) {} done(); } return; }
    });
    dim.querySelector("#pw-c").addEventListener("keydown", function (e) { if (e.key === "Enter") tryCode(); });
  }
  function close(now) { if (!dim) return; var d = dim; dim = null; document.documentElement.style.overflow = ""; document.documentElement.classList.remove("pw-open"); if (now) return d.remove(); d.classList.remove("on"); setTimeout(function () { d.remove(); }, 260); }
  var PAGE_ID = Date.now() + "-" + Math.random();   // يميّز تحميل الصفحة: نعرف إذا حدّثها العميل بين محاولتين
  async function tryCode() {
    var inp = document.getElementById("pw-c"), m = document.getElementById("pw-m"), v = inp.value.trim();
    if (!v) { m.className = "pw-msg bad"; m.textContent = "اكتب الكود أولاً."; return; }
    if (!window.__QXUNLOCK) { m.className = "pw-msg bad"; m.textContent = "تعذّر التحقق الآن، حدّث الصفحة وحاول مرة ثانية."; return; }
    m.className = "pw-msg"; m.textContent = "جاري التحقق…";
    var r = await window.__QXUNLOCK(v); ev("code_entered/" + C.site + "/" + (r && r.html ? "ok" : r && r.err === "stale" ? "stale" : "bad"));
    setTimeout(function () { try { m.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {} }, 60);   // في الآيفون الرسالة كانت تحت حافة الشاشة وما تبان (2026-11-05)
    var FK = "qx.codefail." + C.site, fl = function (x) { try { if (x === undefined) return JSON.parse(localStorage.getItem(FK) || "null"); if (x === null) localStorage.removeItem(FK); else localStorage.setItem(FK, JSON.stringify(x)); } catch (e) { return false; } };
    if (r && r.html) { fl(null); m.className = "pw-msg good"; m.textContent = "تم. تنفتح نسختك الكاملة الآن…"; try { localStorage.removeItem("qx.expired." + C.site); } catch (e) {} setTimeout(function () { location.reload(); }, 600); return; }
    m.className = "pw-msg bad";
    if (r && r.err === "expired") { m.textContent = "هذا الكود انتهت صلاحيته."; return; }
    if (r && r.err === "old") { m.textContent = "متصفحك قديم ولا يدعم الفتح؛ حدّثه أو جرّب متصفحاً آخر."; return; }
    // طلب يوسف (2026-11-05): أول فشل «حدّث الصفحة أولاً»، وإذا تكرر بعد التحديث «تأكد من الكود»
    var prev = fl(), again = r && r.err !== "stale" && prev && prev.p !== PAGE_ID && Date.now() - prev.t < 1800000;
    if (again) {
      m.textContent = "ما زال الكود ما فتح. تأكد من الكود، قد يكون غير صحيح: انسخه وحده من رسالة الاشتراك. وإذا استمرت المشكلة ";
      var wa = document.createElement("a"); wa.href = waLink("السلام عليكم، الكود ما يفتح معي في الموقع"); wa.target = "_blank"; wa.rel = "noopener"; wa.textContent = "راسلنا على واتساب"; wa.style.cssText = "color:inherit;text-decoration:underline;font-weight:700"; m.appendChild(wa);
      return;
    }
    if (fl({ p: PAGE_ID, t: Date.now() }) === false) { m.textContent = "تأكد من الكود، قد يكون غير صحيح، ثم حدّث الصفحة وجرّب مرة ثانية."; return; }
    m.textContent = "حدّث الصفحة أولاً، ثم أدخل الكود مرة ثانية. ";
    var rb = document.createElement("button"); rb.type = "button"; rb.textContent = "تحديث الصفحة"; rb.style.cssText = "display:block;width:100%;margin-top:8px;padding:10px;border:0;border-radius:10px;background:#1F6B4C;color:#fff;font:inherit;font-weight:700;cursor:pointer"; rb.onclick = function () { location.reload(); }; m.appendChild(rb);
  }

  // من انتهت مدة كوده يشوف السبب مرة واحدة عند الفتح، بدل ما يرجع للنسخة المجانية بلا تفسير (2026-11-06)
  try { if (localStorage.getItem("qx.expired." + C.site) && !sessionStorage.getItem("qx.expnote")) { sessionStorage.setItem("qx.expnote", "1"); setTimeout(function () { open(); }, 900); } } catch (e) {}
  window.PW = {
    diag: C.diag || null,
    locked: function (id) { return free.indexOf(id) < 0; },
    open: open,
    gate: function (what) {
      var w = String(what);
      var reason = /^test:mock/.test(w) ? "الاختبارات المحاكية الثلاثة (" + C.mockQ + " سؤالاً لكل اختبار بأوزان المعايير الرسمية)" :
        (w === "test:diag" && C.site === "tarbawi") ? "الاختبار التشخيصي: يبيّن لك المعايير التي تحتاج إلى مذاكرتها، ويحيلك إلى دروسها" : w === "sheet" ? "خلاصة الفخاخ" : /^lesson:/.test(w) ? "اختبار هذا الدرس وبطاقاته" : null;
      if (/^lesson:/.test(w) && free.indexOf(w.slice(7)) >= 0) return false;
      if (!reason) return false; open(reason); return true;
    },
    banner: function () {
      addCss();
      return '<div class="pw-banner"><p>' + LOCK + " أنت على <b>النسخة المجانية</b>: " + C.freeDesc + "</p>" +
        '<div class="pw-row"><button class="pw-btn" onclick="PW.open()">' + fullBtn() + '</button><button class="pw-btn q" onclick="PW.open()">عندي كود</button></div></div>';
    },
    lockCard: function (l) {
      addCss(); var info = (C.lessonInfo || {})[l.id] || {};
      if (chlRead[l.id]) return '<div class="pw-lock">' + LOCK + "<h3>اختبر نفسك في هذا الدرس</h3><p>قرأت الدرس كاملاً. اختبار الدرس (" + N(info.q || 0) + " سؤالاً بتصحيح فوري وشرح لكل إجابة) وبطاقاته في النسخة الكاملة.</p>" +
        '<button class="pw-btn" onclick="PW.open(\'اختبار هذا الدرس وبطاقاته\')">افتح أسئلة الدرس</button></div>';
      return '<div class="pw-lock">' + LOCK + "<h3>بقية الدرس في النسخة الكاملة</h3><p>قرأت أول قسم من " + N(info.sec || 0) + " أقسام. البقية، مع الفخاخ واختبار الدرس (" + N(info.q || 0) + " سؤالاً بشرح لكل إجابة)، في النسخة الكاملة.</p>" +
        '<button class="pw-btn" onclick="PW.open(\'بقية هذا الدرس\')">افتح الدرس كاملاً</button></div>';
    },
    afterDiag: function (weak) {
      addCss();
      return '<div class="pw-banner"><p><b>خطتك من نتيجتك:</b> أضعف المعايير عندك ' + weak.map(function (w) { return "<b>" + esc(w) + "</b>"; }).join("، ") +
        ". النسخة الكاملة تعالجها بدروسها كاملة، و " + N(C.qTotal) + " سؤالاً، و 3 اختبارات محاكية.</p>" +
        '<div class="pw-row"><button class="pw-btn" onclick="PW.open(\'خطة علاج نقاط ضعفك\')">افتح النسخة الكاملة</button></div></div>';
    },
    afterTest: function (score, cor, total, doms) {
      addCss(); var need = function (p) { return Math.max(0, Math.ceil(total * p / 100) - cor); };
      var ans = function (n) { return n === 1 ? "إجابة واحدة" : n === 2 ? "إجابتان" : n <= 10 ? N(n) + " إجابات" : N(n) + " إجابة"; };
      var lvl = score >= 80 ? "خبير" : score >= 70 ? "متقدم" : score >= 50 ? "ممارس" : "دون ممارس";
      var head = score < 50 ? "درجتك " + N(score) + "%، والنجاح من 50%. ينقصك " + ans(need(50)) + " صحيحة للنجاح، و" + ans(need(70)) + " لمستوى متقدم."
        : score < 70 ? "ناجح بـ" + N(score) + "% (مستوى ممارس). باقي " + ans(need(70)) + " وتصير متقدم."
        : "مستوى " + lvl + " بـ" + N(score) + "%. المحاكيات الثلاث (88 سؤالاً لكل واحد) تعطيك مستواك المتوقع وتتأكد أنه ثابت.";
      var w = (doms || []).slice().sort(function (x, y) { return y.w * (1 - y.c / Math.max(1, y.n)) - x.w * (1 - x.c / Math.max(1, x.n)); })[0];
      var rest = Math.max(0, (C.similarTotal || 0) - (C.similar || []).length);
      var pd = perDay();
      return '<div class="pw-res"><p><b>' + head + '</b></p>' +
        (w ? '<p>أكبر مجال يرفع درجتك: <b>' + esc(w.name) + '</b>، وزنه ' + N(w.w) + '% من الاختبار، وأجبت فيه ' + N(w.c) + ' من ' + N(w.n) + '.</p>' : "") +
        '<button class="pw-btn" onclick="PW.open(\'!درجتك في الاختبار المجاني ' + N(score) + '%. هذا ما يفتحه الاشتراك:\')">' + fullBtn() + '</button>' +
        '<small>كل أسئلة الخمس سنوات الماضية (' + N(C.similarTotal) + ' مماثلة) بشرحها + 3 اختبارات محاكية للاختبار الحقيقي (' + N(C.mockQ || 88) + ' سؤالاً)' + (pd ? ' · تقريباً ' + N(pd) + ' ريال لليوم' : "") + '</small>' +
        '<small>أو كمّل مجاناً: <a href="#" onclick="startTest(\'diag\');return false">الاختبار التشخيصي، 40 سؤالاً جديدة</a></small></div>';
    },
    bankNudge: function (k, total) {
      addCss(); var rest = Math.max(0, (C.similarTotal || 0) - total);
      if (total > 30 && k === 20) return '<p class="pw-nudge">حلّيت 20 من ' + N(total) + ' سؤالاً المجانية. في النسخة الكاملة ' + N(rest) + ' سؤالاً غيرها بنفس الشرح. <a href="#" onclick="PW.open(\'بقية أسئلة الاختبارات الماضية (مماثلة)\');return false">شوف ما فيها</a></p>';
      var mid = total > 30 ? 40 : Math.round(total / 2);   // المجاني 20 (2026-10-23): العرض الهادئ في المنتصف، والنهاية لها عرضها
      if (k === mid && k < total) return '<p class="pw-nudge">باقي ' + N(total - mid) + ' سؤالاً مجانياً. وبعدها تكمل على كامل أسئلة الخمس سنوات الماضية <small class=mm>(مماثلة)</small> (' + N(C.similarTotal) + ' سؤالاً) بـ' + N((C.plus || C.plan).price) + ' ريال، مع ضمان 3 أيام. <a href="#" onclick="PW.open(\'!وش في الاشتراك\');return false">شوف ما فيه</a></p>';
      return "";
    },
    similar: C.similar || [],
    similarCard: function () {
      addCss(); var n = (C.similar || []).length;
      return '<button class="mode" data-act="similar"><span class="mt">أسئلة الاختبارات الماضية <small class=mm>(مماثلة)</small> ' + LOCK + '</span><span class="md">' + N(C.similarTotal) + ' سؤالاً من الاختبارات الماضية <small class=mm>(مماثلة)</small>، بشرح لكل إجابة. جرّب ' + N(n) + ' منها مجاناً الآن.</span><span class="mx"><span class="btn sm ghost">جرّب ' + N(n) + ' أسئلة</span></span></button>';
    },
    similarDone: function () {
      addCss(); var n = (C.similar || []).length, pd = perDay();
      return '<div class="pw-banner"><p>أحسنت، أنهيت ' + N(n) + ' سؤالاً من الاختبارات الماضية <small class=mm>(مماثلة)</small>. تكمل على:</p>' +
        '<p>• <b>كامل الأسئلة</b> (أكثر من ' + N(Math.floor((C.qTotal || 0) / 100) * 100) + ' سؤال، منها ' + N(C.similarTotal) + ' من الخمس سنوات الماضية، مماثلة) بـ' + N((C.plus || C.plan).price) + ' ريال<br>• أو <b>أهم ' + N(C.tierN || 120) + ' سؤالاً</b> بـ' + N(C.plan.price) + ' ريال، وفي الاثنين الملزمة والاختبارات المحاكية.</p>' +
        '<p class="small pw-proof" hidden></p>' + '<p class="small">ضمان 3 أيام: إذا ما ناسبك المحتوى يرجع لك المبلغ كاملاً.</p>' + (setTimeout(fillProof, 60), "") +
        '<div class="pw-row"><button class="pw-btn" onclick="PW.open(\'!أنهيت الأسئلة المجانية، اختر اللي يناسب وقتك\')">اختر اشتراكك</button><button class="pw-btn q" onclick="startTest(\'diag\')">أو اختبر نفسك في التشخيصي مجاناً</button></div></div>';
    },
    lessonSimilar: function (id) {
      var h = ((C.lessonInfo || {})[id] || {}).h || 0; if (!h) return "";
      return '<p class="small muted" style="margin:0">' + LOCK + ' ومعه <b>' + N(h) + ' سؤالاً من الاختبارات الماضية <small class=mm>(مماثلة)</small></b> لهذا الدرس في النسخة الكاملة. <a href="#" onclick="PW.open(\'أسئلة الاختبارات الماضية (مماثلة) لهذا الدرس\');return false">افتحها</a></p>';
    },
    qCount: function (id) { return ((C.lessonInfo || {})[id] || {}).q || 0; },
    lockIcon: '<span class="pw-ic" title="في النسخة الكاملة">' + LOCK + "</span>"
  };
  // دائرة خصم الزارع في الصفحة: تطبّق الخصم وتفتح نافذة الاشتراك
  (function promoFab() { var show = function () { if (!promoOk() || promoOn() || document.getElementById("pw-promo-fab") || !document.body) return; addCss(); var f = document.createElement("button"); f.type = "button"; f.id = "pw-promo-fab"; f.setAttribute("aria-label", "طبّق خصم الزارع 15%، خصم يوم واحد"); f.innerHTML = "<b>15%</b><span>خصم الزارع</span><small>يوم واحد</small>"; f.addEventListener("click", function () { promoApply(); open(undefined, "plus"); if (dim) setTimeout(function () { promoAnim(dim && dim.querySelector(".pw-sheet")); }, 280); }); document.body.appendChild(f); }; if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show(); })();
  try { fillProof(); } catch (e) {}   // جلب مبكر: «اشترك» يعرف الوضع (واتساب/تيليجرام) قبل ما تنفتح النافذة
})();
