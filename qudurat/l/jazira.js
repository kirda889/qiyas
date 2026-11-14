/* الجزيرة «جزيرة»: حبة سوداء بحركة جزيرة الآيفون لوضع التركيز (الدرس، حل الأسئلة، المحاكي). اعتمدها يوسف 2026-11-14.
   الاستعمال من الموقع:
     Jazira.mount({ label: "الأسئلة 4/20", tabs: [{t:"الرئيسية",href:"#home"},{t:"الأسئلة",href:"#q",on:true}], close: "إنهاء الحل", onClose: fn })
     Jazira.set("الأسئلة 5/20")   // يغيّر النص بتلاشٍ خفيف ويعدّل العرض بالنابض
     Jazira.show() / Jazira.hide(cb) / Jazira.open() / Jazira.close()
   إذا كان في الصفحة #isl جاهز (صفحات الدروس) يستعمله، وإلا يبنيه. */
(function(){
if (window.Jazira) return;
var CSS = "/* === الحبة «الدروس»: مثل جزيرة الآيفون الديناميكية (طلب يوسف 2026-11-14) ===\n   من إرشادات أبل (Live Activities): خلفية سوداء معتمة، ارتفاع المضغوطة 36.67، زوايا 44 بشكل الكاميرا، والموسّعة عرضها 371 وارتفاعها 84–160،\n   وخط حافة رفيع في الداكن، والتحول يحفظ العناصر الموجودة بدل ما يشيلها، وأي حركة أقل من ثانيتين.\n   النابض: الفتح ζ≈0.72 بارتداد خفيف، والإغلاق ζ≈0.9 أهدأ (قيم أبل الدقيقة غير منشورة؛ هذي مقاربة بالعين). */\n:root{--spo:cubic-bezier(.34,1.36,.64,1);--spc:cubic-bezier(.25,1,.5,1)}\n@supports (transition-timing-function:linear(0,1)){:root{--spo:linear(0, 0.0343, 0.1193, 0.2327, 0.3578, 0.4826, 0.5992, 0.7028, 0.7911, 0.8635, 0.9206, 0.9639, 0.9951, 1.0162, 1.0293, 1.0361, 1.0384, 1.0374, 1.0344, 1.0301, 1.0253, 1.0205, 1.016, 1.0119, 1.0085, 1.0056, 1.0033, 1.0016, 1.0003, 0.9995, 0.9989, 0.9986, 0.9985, 0.9986, 0.9988, 0.9992, 0.9995, 1);--spc:linear(0, 0.0249, 0.0865, 0.169, 0.2612, 0.3555, 0.4467, 0.5317, 0.6086, 0.6768, 0.7361, 0.7869, 0.8298, 0.8655, 0.895, 0.9191, 0.9384, 0.9539, 0.966, 0.9755, 0.9828, 0.9883, 0.9925, 0.9955, 0.9977, 0.9992, 1.0002, 1.0009, 1.0013, 1.0015, 1.001, 1.0005, 1)}}\n#isl{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:60;width:var(--cw,124px);background:#000;color:#F4F1EA;border-radius:18.5px;font-family:var(--f,'Noto Kufi Arabic','Geeza Pro',sans-serif);direction:rtl;overflow:hidden;\n  box-shadow:0 2px 3px rgba(0,0,0,.22),0 8px 16px -4px rgba(0,0,0,.30),0 18px 30px -12px rgba(0,0,0,.35);\n  transition:width .55s var(--spc),border-radius .55s var(--spc),box-shadow .4s}\n#isl.open{width:min(371px,calc(100vw - 24px));border-radius:40px;transition:width .75s var(--spo),border-radius .75s var(--spo),box-shadow .4s;\n  box-shadow:0 4px 6px rgba(0,0,0,.2),0 24px 48px -12px rgba(0,0,0,.5)}\nhtml.dk #isl{box-shadow:0 0 0 1px rgba(255,255,255,.13),0 8px 16px -4px rgba(0,0,0,.45),0 18px 30px -12px rgba(0,0,0,.5)}\n#isl .ih{position:relative;display:flex;align-items:center;justify-content:center;gap:9px;border:0;background:none;color:inherit;padding:0 16px;height:37px;width:100%;font-size:13.5px;font-weight:700;white-space:nowrap}\n#isl .ih::after{content:\"\";position:absolute;inset:-6px 0}\n#isl .lens{flex:none;width:11px;height:11px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#3a4a6a 0,#141a28 45%,#06070b 75%);box-shadow:0 0 0 1.5px #111}\n#isl .ip{display:grid;grid-template-rows:0fr;transition:grid-template-rows .55s var(--spc)}\n#isl.open .ip{grid-template-rows:1fr;transition:grid-template-rows .75s var(--spo)}\n#isl .ip>div{overflow:hidden;min-width:min(371px,calc(100vw - 24px))}\n/* المحتوى الموسّع يطلع من الضباب ويتكبّر قليلاً، ويختفي بسرعة عند الإغلاق */\n#isl .tabs,#isl .ifoot{opacity:0;filter:blur(8px);transform:scale(.94) translateY(-6px);transition:opacity .14s,filter .14s,transform .2s}\n#isl.open .tabs,#isl.open .ifoot{opacity:1;filter:none;transform:none;transition:opacity .4s .1s,filter .45s .1s,transform .6s .08s var(--spo)}\n#isl .tabs{display:flex;gap:4px;padding:4px 12px 6px}\n#isl .tabs a{flex:1;text-align:center;color:#B9B4A8;text-decoration:none;font-size:14px;font-weight:600;padding:8px 6px;border-radius:999px;min-height:44px;display:grid;place-items:center;white-space:nowrap}\n#isl .tabs a.on{background:#1D4A3B;color:#fff}\n#isl .ifoot{display:flex;justify-content:center;padding:0 10px 10px;margin:0 14px;border-top:1px solid rgba(255,255,255,.08)}\n#isl .ifoot button{border:0;background:none;font-size:13.5px;font-weight:600;min-height:44px;padding:0 12px;color:#E3B98A}\n/* الدخول: تطلع من نقطة سوداء صغيرة وتتمدد بالنابض · الخروج: ترجع نقطة وتختفي */\n@keyframes islIn{from{width:37px;opacity:0;transform:translateX(-50%) scale(.55)}35%{opacity:1}to{width:var(--cw,124px);opacity:1;transform:translateX(-50%) scale(1)}}\n@keyframes islOut{from{width:var(--cw,124px);opacity:1;transform:translateX(-50%) scale(1)}to{width:37px;opacity:0;transform:translateX(-50%) scale(.55)}}\n#isl.in{animation:islIn .8s var(--spo) both}\n#isl.out{animation:islOut .38s var(--spc) both}\n#isl.in .ih>*,#isl.out .ih>*{transition:none}\n@keyframes lblIn{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:none}}\n#isl.in .ih>*{animation:lblIn .45s .25s both}\n@media (prefers-reduced-motion:reduce){#isl,#isl *{transition-duration:.01s!important;animation:none!important}}\n#isl .lbl{display:inline-block;transition:opacity .18s,filter .18s}#isl .lbl.sw{opacity:0;filter:blur(5px)}\n";
function css(){ if (document.getElementById("jazira-css")) return; var s = document.createElement("style"); s.id = "jazira-css"; s.textContent = CSS; document.head.appendChild(s); }
var isl, ih, lbl, opts = {};
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function fit(){ /* العرض حسب النص: نص + عدسة + حشو، وأقلها 124 */
  var r = lbl.getBoundingClientRect().width; isl.style.setProperty("--cw", Math.max(124, Math.ceil(r + 62)) + "px"); }
function build(o){
  isl = document.getElementById("isl");
  if (!isl){
    isl = document.createElement("div"); isl.id = "isl"; isl.setAttribute("role", "navigation"); isl.setAttribute("aria-label", "التنقل");
    isl.innerHTML = '<button type="button" class="ih" aria-expanded="false"><span class="lbl"></span><span class="lens" aria-hidden="true"></span></button><div class="ip"><div><nav class="tabs"></nav><div class="ifoot"><button type="button" class="xcl"></button></div></div></div>';
    document.body.appendChild(isl);
  }
  ih = isl.querySelector(".ih");
  lbl = isl.querySelector(".lbl");
  if (!lbl){ var f = ih.querySelector("span:not(.lens)"); lbl = f || document.createElement("span"); lbl.className = "lbl"; if (!f) ih.insertBefore(lbl, ih.firstChild); }
  if (o.label != null) lbl.textContent = o.label;
  if (o.tabs) isl.querySelector(".tabs").innerHTML = o.tabs.map(function(t){ return '<a href="' + esc(t.href || "#") + '"' + (t.on ? ' class="on" aria-current="page"' : "") + ">" + esc(t.t) + "</a>"; }).join("");
  var x = isl.querySelector(".xcl"); if (o.close != null) x.textContent = o.close; if (x) x.hidden = o.close === false;
  ih.onclick = function(){ isl.classList.toggle("open"); ih.setAttribute("aria-expanded", isl.classList.contains("open")); };
  if (x) x.onclick = function(){ api.close(); setTimeout(function(){ api.hide(function(){ if (opts.onClose) opts.onClose(); }); }, 420); };
  fit();
}
document.addEventListener("click", function(e){ if (isl && !isl.contains(e.target)) isl.classList.remove("open"); });
document.addEventListener("keydown", function(e){ if (isl && e.key === "Escape") isl.classList.remove("open"); });
var api = {
  mount: function(o){ opts = o || {}; css(); build(opts); if (opts.show !== false) api.show(); return api; },
  set: function(t){ if (!lbl || lbl.textContent === t) return; lbl.classList.add("sw"); setTimeout(function(){ lbl.textContent = t; fit(); lbl.classList.remove("sw"); }, 180); },
  show: function(){ isl.hidden = false; isl.classList.remove("out", "open"); void isl.offsetWidth; isl.classList.add("in"); setTimeout(function(){ isl.classList.remove("in"); }, 900); },
  hide: function(cb){ isl.classList.remove("open"); isl.classList.add("out"); setTimeout(function(){ isl.hidden = true; isl.classList.remove("out"); if (cb) cb(); }, 380); },
  open: function(){ isl.classList.add("open"); ih.setAttribute("aria-expanded", "true"); },
  close: function(){ isl.classList.remove("open"); ih.setAttribute("aria-expanded", "false"); },
  el: function(){ return isl; }
};
window.Jazira = api;
})();
