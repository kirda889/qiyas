/* التقييمات والتعليقات — yousefalshamrani.com/qiyas
   .qr-full[data-exam]  قسم كامل (تقييم + تعليقات + تعديل) أسفل رئيسية كل اختبار
   .qr-sum[data-exam]   ملخص في بطاقات البوابة + زر يفتح التعليقات */
(function () {
  "use strict";
  var API = "https://api.yousefalshamrani.com/v1";
  var SITEKEY = "0x4AAAAAAFTEffh8BwtMo5vB";
  // للاختبار المحلي فقط: خدمة محلية ومفتاح Cloudflare التجريبي
  try { if (location.hostname === "localhost" && localStorage.getItem("qr.dev") === "1") { API = "http://localhost:8787/v1"; SITEKEY = "1x00000000000000000000AA"; } } catch (e) {}
  var BASE = (document.currentScript && document.currentScript.src || "").replace(/reviews\.js.*$/, "");
  var EX = { tarbawi: "الاختبار التربوي", english2: "التخصصي English 2", step: "STEP" };
  var MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  var LS = "qr.owner";

  // ---------- أدوات ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function token() {
    var t = null; try { t = localStorage.getItem(LS); } catch (e) {}
    if (!t) {
      var a = new Uint8Array(24); crypto.getRandomValues(a);
      t = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      try { localStorage.setItem(LS, t); } catch (e) {}
    }
    return t;
  }
  function req(method, path, body) {
    var h = { "X-Owner-Token": token() }; if (body) h["Content-Type"] = "application/json";
    return fetch(API + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || "تعذّر الاتصال، حاول لاحقاً"); return d; }); });
  }
  function when(iso) {
    var d = new Date(iso), days = Math.floor((Date.now() - d.getTime()) / 864e5);
    if (days <= 0) return "اليوم"; if (days === 1) return "أمس"; if (days === 2) return "قبل يومين";
    if (days < 11) return "قبل " + days + " أيام"; if (days < 31) return "قبل " + days + " يوماً";
    return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.6 6.15.9-4.45 4.35 1.05 6.15L12 16.9l-5.5 2.9 1.05-6.15L3.1 9.3l6.15-.9z"/></svg>';
  function stars(n, cls) { var s = ""; for (var i = 1; i <= 5; i++) s += '<span class="qr-st' + (i <= Math.round(n) ? " on" : "") + '">' + STAR + "</span>"; return '<span class="qr-stars ' + (cls || "") + '" aria-label="' + n + ' من 5">' + s + "</span>"; }
  function fmtAvg(a) { return (Math.round(a * 10) / 10).toFixed(1); }
  function countWord(n) { return n === 1 ? "تقييم واحد" : n === 2 ? "تقييمان" : n + (n <= 10 ? " تقييمات" : " تقييماً"); }

  // ---------- Turnstile ----------
  var tsReady = null;
  function loadTS() {
    if (tsReady) return tsReady;
    tsReady = new Promise(function (res, rej) {
      if (window.turnstile) return res();
      var s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; s.async = true;
      s.onload = function () { res(); }; s.onerror = function () { tsReady = null; rej(new Error("تعذّر تحميل التحقق")); };
      document.head.appendChild(s);
    });
    return tsReady;
  }
  function mountTS(box, dark) {
    return loadTS().then(function () {
      box.innerHTML = "";
      var holder = { token: "" };
      holder.id = window.turnstile.render(box, { sitekey: SITEKEY, language: "ar", theme: dark ? "dark" : "auto", size: "flexible",
        callback: function (t) { holder.token = t; }, "expired-callback": function () { holder.token = ""; } });
      holder.reset = function () { try { window.turnstile.reset(holder.id); } catch (e) {} holder.token = ""; };
      return holder;
    });
  }

  // ---------- الأنماط ----------
  function css() {
    if (document.getElementById("qr-css")) return;
    var st = document.createElement("style"); st.id = "qr-css";
    st.textContent = [
      ".qr{--qr-bg:#fff;--qr-soft:#F2F5F3;--qr-ink:#172420;--qr-mut:#5A6963;--qr-line:#D9E1DD;--qr-acc:#1F6B4C;--qr-accink:#fff;--qr-star:#E3A008;--qr-off:#D5DDD9;--qr-warn:#8A5A00;--qr-warnbg:#FFF4D6;--qr-bad:#B42318;",
      "font-family:inherit;color:var(--qr-ink);direction:rtl;text-align:right;line-height:1.7}",
      "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .qr{--qr-bg:#16201B;--qr-soft:#1C2822;--qr-ink:#E6ECE8;--qr-mut:#A3B1AA;--qr-line:#2A3630;--qr-acc:#5BC093;--qr-accink:#0F1512;--qr-off:#3A4842;--qr-warn:#F2C35B;--qr-warnbg:#3A3015;--qr-bad:#FF8A80}}",
      ":root[data-theme=dark] .qr,.qr.qr-dark{--qr-bg:#16201B;--qr-soft:#1C2822;--qr-ink:#E6ECE8;--qr-mut:#A3B1AA;--qr-line:#2A3630;--qr-acc:#5BC093;--qr-accink:#0F1512;--qr-off:#3A4842;--qr-warn:#F2C35B;--qr-warnbg:#3A3015;--qr-bad:#FF8A80}",
      ".qr *{box-sizing:border-box}.qr button{font:inherit;cursor:pointer}",
      ".qr-card{background:var(--qr-bg);border:1px solid var(--qr-line);border-radius:20px;padding:18px}",
      ".qr-h{margin:0 0 12px;font-size:1.15rem;font-weight:700}",
      ".qr-top{display:flex;align-items:center;gap:16px;flex-wrap:wrap}",
      ".qr-big{text-align:center;min-width:92px}.qr-big b{display:block;font-size:2.2rem;line-height:1.1;font-weight:700}.qr-big small{color:var(--qr-mut);font-size:.82rem}",
      ".qr-dist{flex:1;min-width:170px;display:grid;gap:4px;font-size:.8rem;color:var(--qr-mut)}",
      ".qr-row{display:flex;align-items:center;gap:8px}.qr-bar{flex:1;height:7px;border-radius:4px;background:var(--qr-soft);overflow:hidden}.qr-bar i{display:block;height:100%;background:var(--qr-star);border-radius:4px}",
      ".qr-stars{display:inline-flex;gap:2px;vertical-align:middle;direction:ltr}.qr-st svg{width:16px;height:16px;display:block;fill:var(--qr-off)}.qr-st.on svg{fill:var(--qr-star)}",
      ".qr-big .qr-st svg{width:15px;height:15px}",
      ".qr-empty{color:var(--qr-mut);font-size:.92rem;margin:4px 0 0}",
      ".qr-form{margin-top:16px;padding-top:14px;border-top:1px solid var(--qr-line);display:grid;gap:10px}",
      ".qr-pick{display:flex;gap:6px;direction:ltr;justify-content:flex-end}.qr-pick button{background:none;border:0;padding:2px;border-radius:8px}.qr-pick svg{width:34px;height:34px;fill:var(--qr-off);transition:transform .12s}.qr-pick button.on svg{fill:var(--qr-star)}.qr-pick button:active svg{transform:scale(.9)}",
      ".qr-pick button:focus-visible{outline:2px solid var(--qr-acc)}",
      ".qr input[type=text],.qr textarea{width:100%;font:inherit;color:var(--qr-ink);background:var(--qr-soft);border:1px solid var(--qr-line);border-radius:12px;padding:10px 12px;direction:rtl}",
      ".qr textarea{min-height:92px;resize:vertical}.qr input:focus,.qr textarea:focus{outline:2px solid var(--qr-acc);outline-offset:1px}",
      ".qr-consent{display:flex;gap:8px;align-items:flex-start;font-size:.85rem;color:var(--qr-mut)}.qr-consent input{margin-top:6px;flex:none;width:18px;height:18px;accent-color:var(--qr-acc)}",
      ".qr a{color:var(--qr-acc)}",
      ".qr-full{scroll-margin-top:84px}",
      ".qr-btn{white-space:nowrap;flex:none;border:0;border-radius:999px;padding:10px 20px;background:var(--qr-acc);color:var(--qr-accink);font-weight:700}.qr-btn[disabled]{opacity:.6}",
      ".qr-ghost{background:none;border:1px solid var(--qr-line);border-radius:999px;padding:6px 14px;color:var(--qr-ink);font-weight:600;font-size:.88rem}",
      ".qr-link{background:none;border:0;padding:0;color:var(--qr-mut);font-size:.84rem;text-decoration:underline;text-underline-offset:3px}",
      ".qr-msg{font-size:.88rem;border-radius:12px;padding:8px 12px;background:var(--qr-soft)}.qr-msg.bad{color:var(--qr-bad)}",
      ".qr-list{margin-top:16px;display:grid;gap:10px}",
      ".qr-item{border-top:1px solid var(--qr-line);padding-top:12px}.qr-item:first-child{border-top:0;padding-top:0}",
      ".qr-ih{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.qr-ih b{font-weight:700}.qr-ih small{color:var(--qr-mut);font-size:.8rem}",
      ".qr-body{margin:4px 0 0;white-space:pre-wrap;word-break:break-word}",
      ".qr-reply{margin-top:8px;background:var(--qr-soft);border-radius:12px;padding:8px 12px;font-size:.9rem}.qr-reply b{font-weight:700}",
      ".qr-acts{display:flex;gap:8px 14px;margin-top:6px;align-items:center;flex-wrap:wrap}",
      ".qr-mine{margin-top:16px;padding:14px;border-radius:16px;background:var(--qr-soft)}",
      ".qr-badge{font-size:.75rem;border-radius:999px;padding:2px 10px;background:var(--qr-warnbg);color:var(--qr-warn);font-weight:700}",
      ".qr-legal{margin-top:14px;font-size:.78rem;color:var(--qr-mut);display:flex;flex-wrap:wrap;gap:4px 12px}.qr-legal a{color:var(--qr-mut)}",
      ".qr-ts{min-height:0}",
      /* الملخص في البوابة */
      ".qr-s{border-top:1px solid var(--qr-line);padding:12px 20px;display:grid;gap:8px;background:transparent}",
      ".qr-sline{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.9rem}.qr-sline b{font-size:1.05rem}.qr-sline small{color:var(--qr-mut)}",
      ".qr-sbtns{display:flex;gap:8px;flex-wrap:wrap}",
      ".qr-s .qr-list{margin-top:4px}"
    ].join("\n");
    document.head.appendChild(st);
  }

  // ---------- البيانات ----------
  var cache = {};
  function load(exam, force) {
    if (!force && cache[exam]) return cache[exam];
    cache[exam] = req("GET", "/reviews?exam=" + exam);
    cache[exam].catch(function () { delete cache[exam]; });
    return cache[exam];
  }
  var sumP = null;
  function loadSummary() { if (!sumP) { sumP = req("GET", "/summary"); sumP.catch(function () { sumP = null; }); } return sumP; }

  function summaryHTML(s) {
    if (!s || !s.count) return '<div class="qr-top"><div><div class="qr-stars-wrap">' + stars(0) + '</div><p class="qr-empty">لا توجد تقييمات بعد. كن أول من يقيّم.</p></div></div>';
    var rows = "";
    for (var i = 0; i < 5; i++) { var n = s.dist[i], pct = s.count ? Math.round(n / s.count * 100) : 0; rows += '<div class="qr-row"><span>' + (5 - i) + '</span><div class="qr-bar"><i style="width:' + pct + '%"></i></div><span style="min-width:22px">' + n + "</span></div>"; }
    return '<div class="qr-top"><div class="qr-big"><b>' + fmtAvg(s.avg) + "</b>" + stars(s.avg) + "<small>" + countWord(s.count) + '</small></div><div class="qr-dist">' + rows + "</div></div>";
  }
  function itemHTML(r, canReport) {
    return '<div class="qr-item" data-id="' + r.id + '"><div class="qr-ih"><b>' + esc(r.name || "زائر") + "</b>" + stars(r.stars) + "<small>" + when(r.created_at) + (r.edited ? " · معدّل" : "") + "</small></div>" +
      (r.body ? '<p class="qr-body">' + esc(r.body) + "</p>" : "") +
      (r.reply ? '<div class="qr-reply"><b>رد يوسف الشمراني:</b> ' + esc(r.reply) + "</div>" : "") +
      (canReport ? '<div class="qr-acts"><button class="qr-link" data-act="report" type="button">تبليغ</button></div><div class="qr-rep"></div>' : "") + "</div>";
  }
  function legal() {
    return '<div class="qr-legal"><a href="' + BASE + 'terms/">شروط الاستخدام</a><a href="' + BASE + 'privacy/">سياسة الخصوصية</a><a href="' + BASE + 'comments-policy/">سياسة التعليقات</a><a href="' + BASE + 'copyright/">حقوق الملكية والإبلاغ</a></div>';
  }

  // ---------- القسم الكامل ----------
  function mountFull(el) {
    var exam = el.getAttribute("data-exam"); if (!EX[exam]) return;
    var dark = el.classList.contains("qr-dark");
    el.classList.add("qr"); el.setAttribute("dir", "rtl");
    el.addEventListener("keydown", function (e) { e.stopPropagation(); });   // لا تتحرك شرائح STEP أثناء الكتابة
    el.innerHTML = '<div class="qr-card"><h2 class="qr-h">قيّم ' + EX[exam] + '</h2><div class="qr-sumbox"><p class="qr-empty">جارٍ التحميل…</p></div><div class="qr-me"></div><div class="qr-list"></div>' + legal() + "</div>";
    var state = { pick: 0 };
    function render(d) {
      el.querySelector(".qr-sumbox").innerHTML = summaryHTML(d.summary);
      var me = el.querySelector(".qr-me");
      if (d.mine && !state.editing) {
        var m = d.mine;
        var badge = m.hidden ? '<span class="qr-badge">مخفي للمراجعة</span>' : m.text_status === "pending" ? '<span class="qr-badge">التعليق بانتظار المراجعة</span>' : "";
        me.innerHTML = '<div class="qr-mine"><div class="qr-ih"><b>تقييمك</b>' + stars(m.stars) + badge + "</div>" + (m.body ? '<p class="qr-body">' + esc(m.body) + "</p>" : "") +
          (m.reply ? '<div class="qr-reply"><b>رد يوسف الشمراني:</b> ' + esc(m.reply) + "</div>" : "") +
          '<div class="qr-acts"><button class="qr-ghost" data-act="edit" type="button">تعديل</button><button class="qr-link" data-act="del" type="button">حذف تقييمي</button><button class="qr-link" data-act="code" type="button">رمز التعديل</button></div><div class="qr-codebox"></div></div>';
      } else {
        var m2 = state.editing ? d.mine : null;
        state.pick = m2 ? m2.stars : state.pick;
        me.innerHTML = '<form class="qr-form" novalidate><div><div style="font-weight:700;margin-bottom:4px">' + (m2 ? "عدّل تقييمك" : "كم تعطي " + EX[exam] + "؟") + '</div><div class="qr-pick" role="radiogroup" aria-label="التقييم من 5">' +
          [1, 2, 3, 4, 5].map(function (i) { return '<button type="button" role="radio" data-v="' + i + '" aria-label="' + i + ' من 5">' + STAR + "</button>"; }).join("") + "</div></div>" +
          '<input type="text" name="name" maxlength="40" placeholder="اسمك أو اسم مستعار (اختياري)" value="' + esc(m2 ? m2.name : "") + '">' +
          '<textarea name="body" maxlength="1200" placeholder="اكتب رأيك أو ملاحظتك (اختياري). التعليق يظهر بعد المراجعة.">' + esc(m2 ? m2.body : "") + "</textarea>" +
          '<label class="qr-consent"><input type="checkbox" name="consent"' + (m2 ? " checked" : "") + '><span>أوافق على نشر تقييمي وتعليقي وفق <a href="' + BASE + 'privacy/" target="_blank">سياسة الخصوصية</a> و<a href="' + BASE + 'comments-policy/" target="_blank">سياسة التعليقات</a>.</span></label>' +
          '<div class="qr-ts"></div><div class="qr-out"></div><div class="qr-acts"><button class="qr-btn" type="submit">' + (m2 ? "احفظ التعديل" : "أرسل التقييم") + "</button>" +
          (m2 ? '<button class="qr-link" type="button" data-act="cancel">إلغاء</button>' : '<button class="qr-link" type="button" data-act="have-code">عندك رمز تعديل من جهاز ثاني؟</button>') + '</div><div class="qr-codebox"></div></form>';
        paintPick();
        if (!m2) { var f = me.querySelector("form"); f.addEventListener("focusin", function once() { f.removeEventListener("focusin", once); ensureTS(); }); me.querySelector(".qr-pick").addEventListener("click", ensureTS, { once: true }); }
      }
      var list = el.querySelector(".qr-list");
      var items = d.items.filter(function (r) { return !(d.mine && r.id === d.mine.id); });
      list.innerHTML = items.length ? items.map(function (r) { return itemHTML(r, true); }).join("") : "";
    }
    var ts = null;
    function ensureTS() { if (ts) return ts; var box = el.querySelector(".qr-ts"); ts = box ? mountTS(box, dark) : Promise.resolve(null); return ts; }
    function paintPick() { el.querySelectorAll(".qr-pick button").forEach(function (b) { var on = +b.getAttribute("data-v") <= state.pick; b.classList.toggle("on", on); b.setAttribute("aria-checked", +b.getAttribute("data-v") === state.pick ? "true" : "false"); }); }
    function out(msg, bad) { var o = el.querySelector(".qr-out"); if (o) o.innerHTML = msg ? '<div class="qr-msg' + (bad ? " bad" : "") + '">' + esc(msg) + "</div>" : ""; }
    function refresh() { sumP = null; return load(exam, true).then(function (d) { ts = null; render(d); }); }

    el.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || !el.contains(b)) return;
      if (b.closest(".qr-pick")) { state.pick = +b.getAttribute("data-v"); paintPick(); return; }
      var act = b.getAttribute("data-act");
      if (act === "edit") { state.editing = true; load(exam).then(function (d) { ts = null; render(d); ensureTS(); }); }
      else if (act === "cancel") { state.editing = false; load(exam).then(render); }
      else if (act === "del") {
        if (!confirm("تحذف تقييمك وتعليقك نهائياً؟")) return;
        req("DELETE", "/reviews/mine?exam=" + exam).then(function () { state.pick = 0; return refresh(); }).catch(function (x) { alert(x.message); });
      }
      else if (act === "code") {
        var box = b.closest(".qr-mine").querySelector(".qr-codebox");
        box.innerHTML = '<div class="qr-msg" style="margin-top:8px">احفظ هذا الرمز إذا تبي تعدّل تقييمك من جهاز ثاني:<br><code style="direction:ltr;display:inline-block;word-break:break-all;user-select:all">' + esc(token()) + '</code> <button class="qr-ghost" type="button" data-act="copy">نسخ</button></div>';
      }
      else if (act === "copy") { try { navigator.clipboard.writeText(token()); b.textContent = "تم النسخ"; } catch (x) {} }
      else if (act === "have-code") {
        var cb = el.querySelector("form .qr-codebox");
        cb.innerHTML = '<div class="qr-msg" style="margin-top:8px;display:grid;gap:8px"><span>الصق رمز التعديل اللي حفظته:</span><input type="text" dir="ltr" class="qr-codein" placeholder="الرمز"><button class="qr-ghost" type="button" data-act="use-code">استخدم الرمز</button></div>';
      }
      else if (act === "use-code") {
        var v = (el.querySelector(".qr-codein").value || "").trim();
        if (v.length < 20) { alert("الرمز غير صحيح"); return; }
        try { localStorage.setItem(LS, v); } catch (x) {}
        Object.keys(cache).forEach(function (k) { delete cache[k]; }); refresh();
      }
      else if (act === "report") {
        var item = b.closest(".qr-item"), rep = item.querySelector(".qr-rep");
        if (rep.innerHTML) { rep.innerHTML = ""; return; }
        rep.innerHTML = '<div class="qr-msg" style="margin-top:8px;display:grid;gap:8px"><span>سبب التبليغ (اختياري):</span><input type="text" maxlength="300" class="qr-reason" placeholder="مثلاً: إساءة، معلومة خاطئة، إعلان"><div class="qr-ts2"></div><button class="qr-ghost" type="button" data-act="send-report">أرسل البلاغ</button><div class="qr-rout"></div></div>';
        rep._ts = mountTS(rep.querySelector(".qr-ts2"), dark);
      }
      else if (act === "send-report") {
        var it = b.closest(".qr-item"), rp = it.querySelector(".qr-rep"), id = it.getAttribute("data-id");
        rp._ts.then(function (h) {
          if (!h.token) { rp.querySelector(".qr-rout").textContent = "انتظر اكتمال التحقق ثم أرسل."; return; }
          b.disabled = true;
          req("POST", "/reviews/" + id + "/report", { reason: rp.querySelector(".qr-reason").value, ts: h.token })
            .then(function () { rp.innerHTML = '<div class="qr-msg" style="margin-top:8px">وصل البلاغ، شكراً لك. سيُراجع التعليق.</div>'; })
            .catch(function (x) { b.disabled = false; h.reset(); rp.querySelector(".qr-rout").textContent = x.message; });
        });
      }
    });
    el.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, editing = !!state.editing;
      if (!state.pick) { out("اختر عدد النجوم أولاً", true); return; }
      if (!f.consent.checked) { out("لازم توافق على سياسة الخصوصية والتعليقات", true); return; }
      var body = { exam: exam, stars: state.pick, name: f.name.value, body: f.body.value, consent: true };
      var btn = f.querySelector(".qr-btn");
      var go = function (h) {
        if (!editing) { if (!h || !h.token) { out("انتظر اكتمال التحقق (المربع فوق) ثم أرسل", true); return; } body.ts = h.token; }
        btn.disabled = true; out("");
        req(editing ? "PUT" : "POST", editing ? "/reviews/mine" : "/reviews", body).then(function (r) {
          state.editing = false;
          return refresh().then(function () {
            var me = el.querySelector(".qr-mine"); if (!me) return;
            var msg = document.createElement("div"); msg.className = "qr-msg"; msg.style.marginTop = "8px";
            msg.textContent = r.text_status === "pending" ? "شكراً لك! تقييمك انحسب، وتعليقك يظهر بعد المراجعة." : "شكراً لك! تم حفظ تقييمك.";
            me.appendChild(msg);
          });
        }).catch(function (x) { btn.disabled = false; if (h && h.reset) h.reset(); out(x.message, true); });
      };
      if (editing) go(null); else ensureTS().then(go).catch(function (x) { out(x.message, true); });
    });
    load(exam).then(render).catch(function () { el.querySelector(".qr-sumbox").innerHTML = '<p class="qr-empty">تعذّر تحميل التقييمات الآن.</p>'; });
    // ?rate=1 من البوابة: انزل للقسم (مع إعادة المحاولة لأن التطبيق قد يعيد رسم الصفحة)
    if (/[?&]rate=1/.test(location.search) && !window.__qrScrolled) {
      window.__qrScrolled = true;
      [350, 1000, 2000].forEach(function (ms) { setTimeout(function () { var x = document.querySelector(".qr-full"); if (x && Math.abs(x.getBoundingClientRect().top) > 120) x.scrollIntoView({ block: "start" }); }, ms); });
    }
  }

  // ---------- الملخص في البوابة ----------
  function mountSum(el) {
    var exam = el.getAttribute("data-exam"); if (!EX[exam]) return;
    var page = el.getAttribute("data-page") || (exam + "/");
    el.classList.add("qr", "qr-s"); el.setAttribute("dir", "rtl");
    el.innerHTML = '<div class="qr-sline"><small>جارٍ تحميل التقييمات…</small></div>';
    loadSummary().then(function (all) {
      var s = all[exam] || { count: 0 };
      var line = s.count ? "<b>" + fmtAvg(s.avg) + "</b>" + stars(s.avg) + "<small>" + countWord(s.count) + "</small>" : stars(0) + "<small>لا توجد تقييمات بعد</small>";
      el.innerHTML = '<div class="qr-sline">' + line + '</div><div class="qr-sbtns">' +
        (s.comments ? '<button class="qr-ghost" type="button" data-act="open">التعليقات (' + s.comments + ")</button>" : "") +
        '<a class="qr-ghost" style="text-decoration:none" href="' + page + '?rate=1">' + (s.count ? "أضف تقييمك" : "كن أول من يقيّم") + '</a></div><div class="qr-list" hidden></div>';
    }).catch(function () { el.innerHTML = ""; el.classList.remove("qr-s"); });
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act=open]"); if (!b) return;
      var list = el.querySelector(".qr-list");
      if (!list.hidden) { list.hidden = true; b.textContent = b.getAttribute("data-label"); return; }
      list.hidden = false; list.innerHTML = '<p class="qr-empty">جارٍ التحميل…</p>';
      load(exam).then(function (d) {
        list.innerHTML = d.items.length ? d.items.map(function (r) { return itemHTML(r, false); }).join("") : '<p class="qr-empty">لا توجد تعليقات بعد.</p>';
        if (!b.getAttribute("data-label")) b.setAttribute("data-label", b.textContent);
        b.textContent = "إخفاء التعليقات";
      });
    });
  }

  function scan() {
    document.querySelectorAll(".qr-full:not([data-qr])").forEach(function (el) { el.setAttribute("data-qr", "1"); css(); mountFull(el); });
    document.querySelectorAll(".qr-sum:not([data-qr])").forEach(function (el) { el.setAttribute("data-qr", "1"); css(); mountSum(el); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
  new MutationObserver(function () { scan(); }).observe(document.documentElement, { childList: true, subtree: true });
  // الرابط ?rate=1 داخل التطبيقين: افتح الرئيسية أولاً
  if (/[?&]rate=1/.test(location.search)) setTimeout(function () { var h = document.querySelector("[data-go=home]"); if (h && !document.querySelector(".qr-full")) h.click(); }, 300);
})();
