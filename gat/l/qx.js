/* طبقة الإثراء المشتركة لموقعَي التربوي والإنجليزي:
   - [[نص|مفتاح]] داخل أي نقطة → كلمة ملونة تفتح «درج الاستفاضة» من اليسار (window.DEEP[مفتاح])
   - s.intro (الفكرة ببساطة) · s.map (خريطة مفاهيمية: عجلة + بطاقات) · s.ex (أمثلة) داخل أي قسم درس
   البيانات في ملفات المحتوى؛ هذا الملف للعرض فقط. */
(function () {
  "use strict";
  var PAL = ["#1F6B4C", "#33449A", "#0B6B66", "#A8562A", "#8A3B63", "#6B5B1F", "#2F6690"];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>"); }
  // [[نص|مفتاح]] → زر يفتح الدرج (بعد التهريب)
  function links(html) {
    return String(html).replace(/\[\[([^|\]]+)\|([\w.-]+)\]\]/g, function (_, t, k) {
      return '<button type="button" class="qx-dl" data-deep="' + k + '">' + t + "</button>";
    });
  }
  function rich(s) { return links(md(s)); }
  // يحمي [[نص|مفتاح]] من دوال التنسيق في التطبيق ثم يعيدها أزراراً
  function withLinks(s, f) {
    var L = [];
    var h = f(String(s == null ? "" : s).replace(/\[\[([^|\]]+)\|([\w.-]+)\]\]/g, function (_, t, k) { L.push([t, k]); return "\u0001" + (L.length - 1) + "\u0001"; }));
    return L.length ? h.replace(/\u0001(\d+)\u0001/g, function (_, i) { return '<button type="button" class="qx-dl" data-deep="' + L[i][1] + '">' + f(L[i][0]) + "</button>"; }) : h;
  }
  var isPair = function (x) { return Array.isArray(x); };
  // نص ثنائي اللغة [en, ar] أو نص عربي
  function txt(x, cls) {
    if (isPair(x)) return '<div class="qx-en" dir="ltr">' + rich(x[0]) + "</div>" + (x[1] ? '<div class="qx-ar">' + rich(x[1]) + "</div>" : "");
    return '<p class="' + (cls || "") + '">' + rich(x) + "</p>";
  }
  // الفخ عربي دائماً: اتجاهه RTL حتى داخل خرائط الإنجليزي (كان «the وand وin» ينقلب)
  function trapHTML(t, cls) { return t ? '<div class="qx-trap' + (cls ? " " + cls : "") + '" dir="' + (/[؀-ۿ]/.test(t) ? "rtl" : "auto") + '">⚠ ' + rich(t) + "</div>" : ""; }
  function chips(items) {
    return items && items.length ? '<div class="qx-fit">' + items.map(function (it) { return it.d ? '<button type="button" class="qx-dl" data-deep="' + it.d + '">' + esc(it.n) + "</button>" : "<i>" + esc(it.n) + "</i>"; }).join("") + "</div>" : "";
  }

  // ---------- الخريطة المفاهيمية ----------
  function pol(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function words(s, n) { var w = String(s).split(/\s+/), h = Math.ceil(w.length / n), o = []; for (var i = 0; i < n; i++) o.push(w.slice(i * h, (i + 1) * h).join(" ")); return o.filter(Boolean); }
  // حجم خط يضمن بقاء النص داخل عرض محدد (تقريب لعرض الحرف)
  function fit(t, w, base, k) { var L = String(t || "").length || 1; return Math.max(7, Math.min(base, w / (L * (k || 0.56)))).toFixed(1); }
  function wheel(m, compact) {
    var G = m.groups, N = G.length, cx = compact ? 230 : 380, cy = compact ? 230 : 380, r0 = compact ? 92 : 118, r1 = compact ? 222 : 230, r2 = 312;
    var W = compact ? 460 : 760, out = '<svg class="qx-wheel ' + (compact ? "qx-c" : "qx-f") + '" viewBox="0 0 ' + W + " " + W + '" role="img" aria-label="' + esc((m.title || [""])[0]) + '">';
    G.forEach(function (g, i) {
      var col = g.c || PAL[i % PAL.length], a0 = -Math.PI / 2 + i * 2 * Math.PI / N + 0.012, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / N - 0.012;
      var p0 = pol(cx, cy, r1, a0), p1 = pol(cx, cy, r1, a1), p2 = pol(cx, cy, r0, a1), p3 = pol(cx, cy, r0, a0), big = (a1 - a0) > Math.PI ? 1 : 0;
      out += '<g class="qx-seg" style="--i:' + i + '">';
      if (g.d) out += '<g class="qx-go" data-deep="' + g.d + '" role="button" tabindex="0" aria-label="' + esc(g.n) + '">';
      out += '<path d="M' + p0 + " A" + r1 + "," + r1 + " 0 " + big + " 1 " + p1 + " L" + p2 + " A" + r0 + "," + r0 + " 0 " + big + " 0 " + p3 + 'Z" fill="' + col + '"/>';
      // الجوال: العجلة الصغيرة تُعرض بعرض 250–320 بكسل، فاسم القطاع بخط أكبر وحده (سطره الفرعي موجود في القائمة تحتها)
      var am = (a0 + a1) / 2, t = pol(cx, cy, (r0 + r1) / 2, am), nm = g.short || g.n || "", chord = 2 * (r0 + r1) / 2 * Math.sin(Math.min(Math.PI / 2, Math.PI / N)) * 0.85;
      var fs = compact ? Math.min(23, +fit(nm, chord, 23, 0.6)) : (nm.length > 12 ? 15 : 19);
      out += '<text x="' + t[0] + '" y="' + (t[1] + (compact ? 7 : -6)) + '" text-anchor="middle" fill="#fff" font-size="' + fs + '" font-weight="800" class="qx-lat">' + esc(nm) + "</text>";
      if (g.ar && !compact) out += '<text x="' + t[0] + '" y="' + (t[1] + 18) + '" text-anchor="middle" fill="#fff" font-size="15" font-weight="600">' + esc(g.ar) + "</text>";
      if (g.d) out += "</g>";
      out += "</g>";
      // تباعد العناصر حسب عرض القطاع حتى لا تتداخل دوائر المجموعات المتجاورة
      var segA = 2 * Math.PI / N, its = (g.items || []).slice(0, 3), sp = Math.min(0.48, segA / Math.max(its.length, 1)), nr = Math.max(30, Math.min(50, sp * r2 / 2 - 4));
      if (!compact) its.forEach(function (it, j, arr) {
        var a = am + (arr.length === 1 ? 0 : (j - (arr.length - 1) / 2) * sp), p = pol(cx, cy, r2, a), l = pol(cx, cy, r1 + 4, a);
        out += '<g class="qx-nd" style="--i:' + (i + j * 0.5) + '">';
        out += '<line x1="' + l[0] + '" y1="' + l[1] + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="' + col + '" stroke-width="2" stroke-dasharray="3 4"/>';
        if (it.d) out += '<g class="qx-go" data-deep="' + it.d + '" role="button" tabindex="0" aria-label="' + esc(it.n) + '">';
        out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + nr + '" class="qx-node" stroke="' + col + '" stroke-width="3"/>';
        // الموقعان (منذ 2026-10-25): الاسم الطويل واسم المنظّر الطويل ينقسمان سطرين بدل التصغير، والشرح يلتف حتى 3 أسطر بخط 12
        // العربي (التربوي) يحتاج تباعد أسطر أكبر (الحروف أعلى وأعمق)، فالاسم المقسوم بخط 14 وسطرا الشرح بالكثير
        var A = !window.QX_LTR, arL = String(it.ar || "").replace(/[⁦-⁩]/g, ""), nl = arL ? Math.min(A ? 2 : 3, Math.max(1, Math.ceil(arL.length / (A ? 13 : 11)))) : 0;
        var nm = [String(it.n || "")], nf = +fit(nm[0], nr * 1.72, 15, 0.6);
        if (nf < 12.5 && /\s/.test(nm[0])) { nm = words(nm[0], 2); nf = Math.min.apply(null, nm.map(function (x) { return +fit(x, nr * 1.62, A ? 14 : 15, 0.6); })); }
        var wl = it.who ? [String(it.who)] : [], wf = it.who ? +fit(wl[0], nr * 1.62, 12, 0.6) : 0;
        if (wf && wf < 12 && /\s/.test(wl[0])) { wl = words(wl[0], 2); wf = Math.min.apply(null, wl.map(function (x) { return +fit(x, nr * 1.5, 12, 0.6); })); }
        wf = Math.max(11.5, wf);
        var sn = A ? Math.round(nf * 1.3) : nf + 1, sl = A ? 15 : 13, bh = nm.length * sn + wl.length * sl + nl * sl, ty = p[1] - bh / 2 + nf - 2;
        nm.forEach(function (x, k) { out += '<text x="' + p[0] + '" y="' + (ty + k * sn) + '" text-anchor="middle" fill="' + col + '" font-size="' + nf + '" font-weight="700" class="qx-lat">' + esc(x) + "</text>"; });
        var y2 = ty + (nm.length - 1) * sn;
        wl.forEach(function (x, k) { out += '<text x="' + p[0] + '" y="' + (y2 + sl + k * sl) + '" text-anchor="middle" fill="' + col + '" font-size="' + wf + '" font-weight="800" class="qx-whot">' + esc(x) + "</text>"; });
        words(it.ar || "", nl).forEach(function (w, k) { out += '<text x="' + p[0] + '" y="' + (y2 + wl.length * sl + (A ? 16 : 15) + k * sl) + '" text-anchor="middle" class="qx-sub" font-size="12">' + esc(w) + "</text>"; });
        if (it.d) out += '<circle cx="' + p[0] + '" cy="' + (p[1] - nr) + '" r="9" fill="' + col + '" class="qx-pl"/><text x="' + p[0] + '" y="' + (p[1] - nr + 4.3) + '" text-anchor="middle" fill="#fff" font-size="12" font-weight="800">+</text></g>';
        out += "</g>";
      });
    });
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r0 - 12) + '" class="qx-core"/>';
    var tt = m.title || ["", ""];
    // العنوان الإنجليزي الفرعي زخرفة في التربوي، فلا يُرسم في العجلة الصغيرة على الجوال (خطه كان 7 بكسل)
    var sub = tt[1] && !(compact && !window.QX_LTR);
    var cw = (r0 - 16) * 2, ct = String(tt[1] || tt[0]), cl = ct.length > 16 ? words(ct, 2) : [ct], cf = Math.min.apply(null, cl.map(function (x) { return +fit(x, cw, compact ? 23 : 22, 0.52); }));
    var cy0 = sub ? cy - 6 : cy + (cl.length - 1) * (cf + 4) / 2 + cf * 0.35;
    cl.forEach(function (x, k) { out += '<text x="' + cx + '" y="' + (cy0 - (cl.length - 1 - k) * (cf + 4)) + '" text-anchor="middle" class="qx-ink" font-size="' + cf + '" font-weight="800">' + esc(x) + "</text>"; });
    if (sub) out += '<text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" class="qx-gold qx-lat" font-size="' + fit(tt[0], cw, compact ? 13 : 16, 0.55) + '" font-weight="700">' + esc(tt[0]) + "</text>";
    return out + "</svg>";
  }
  function cards(m) {
    return '<div class="qx-cols' + (m.cols ? ' qx-cc" style="--cc:' + m.cols : "") + '">' + m.groups.map(function (g, i) {
      var col = g.c || PAL[i % PAL.length];
      return '<div class="qx-col"><div class="qx-hd" style="background:' + col + '"><b class="qx-lat"' + (/[A-Za-z]/.test(g.n || "") ? ' dir="ltr"' : "") + ">" + esc(g.n || "") + "</b>" + (g.ar ? "<span>" + esc(g.ar) + (g.idea ? " · " + rich(g.idea) : "") + "</span>" : "") + '</div><div class="qx-bd">' +
        (g.items || []).map(function (it) {
          return '<div class="qx-th" style="--c:' + col + '"><div><b' + (/[A-Za-z]/.test(it.n || "") ? ' class="qx-lat" dir="ltr"' : "") + ">" + (it.d ? '<button type="button" class="qx-dl" data-deep="' + it.d + '">' + esc(it.n) + "</button>" : esc(it.n)) + "</b>" +
            (it.who ? '<span class="qx-who" dir="auto">' + esc(it.who) + "</span>" : "") + (it.ar ? "<small>" + rich(it.ar) + "</small>" : "") + (it.kw && it.kw.length ? '<div class="qx-kw">' + it.kw.map(function (k) { return "<i dir=\"ltr\">" + esc(k) + "</i>"; }).join("") + "</div>" : "") + "</div></div>";
        }).join("") + trapHTML(g.trap) + "</div></div>";
    }).join("") + "</div>";
  }
  // توزيع الفروع على صفوف متوازنة يربطها جذع واحد
  function rows(cells) {
    var N = cells.length, C = N <= 4 ? N : N <= 6 ? 3 : 4, out = "";
    for (var i = 0; i < N; i += C) { var r = cells.slice(i, i + C); out += '<div class="qx-row" style="--k:' + r.length + '">' + r.join("") + "</div>"; }
    return '<div class="qx-brs" style="--C:' + C + '">' + out + "</div>";
  }
  // شجرة متفرعة (خيوط): الجذر ← الفروع (المجموعات) ← الأوراق (العناصر) — للتصنيفات والتسلسلات
  function branch(g, i) {
    var col = g.c || PAL[i % PAL.length];
    return '<div class="qx-br" style="--c:' + col + ";--i:" + i + '"><div class="qx-bh' + (g.d ? ' qx-go" data-deep="' + g.d + '" role="button" tabindex="0' : "") + '"><span' + (/[A-Za-z]/.test(g.n || "") ? ' class="qx-lat" dir="ltr"' : "") + ">" + esc(g.n || "") + "</span>" + (g.ar ? "<small>" + esc(g.ar) + "</small>" : "") + "</div>" + (g.idea ? '<div class="qx-bidea">' + rich(g.idea) + "</div>" : "") + "<ul>" +
      (g.items || []).map(function (it) {
        var lt = /[A-Za-z]/.test(it.n || "") ? ' dir="ltr"' : "";
        return "<li>" + (it.d ? '<button type="button" class="qx-dl"' + lt + ' data-deep="' + it.d + '">' + esc(it.n) + "</button>" : "<b" + lt + ">" + esc(it.n) + "</b>") +
          (it.who ? '<span class="qx-who" dir="auto">' + esc(it.who) + "</span>" : "") + (it.ar ? "<small>" + rich(it.ar) + "</small>" : "") +
          (it.kw && it.kw.length ? '<div class="qx-kw qx-kwc">' + it.kw.map(function (k) { return '<i dir="ltr">' + esc(k) + "</i>"; }).join("") + "</div>" : "") + "</li>";
      }).join("") + "</ul>" + trapHTML(g.trap, "qx-btrap") + "</div>";
  }
  function tree(m) {
    var tt = m.title || ["", ""], root = '<div class="qx-root">' + esc(tt[1] || tt[0]) + (tt[1] ? '<small class="qx-lat" dir="ltr">' + esc(tt[0]) + "</small>" : "") + "</div>";
    if (!m.mid) return '<div class="qx-tree qx-tmap">' + root + rows(m.groups.map(branch)) + "</div>";
    // مستوى أوسط ظاهر (مثل المورفيمات: حرة / مقيدة ← أنواعها): mid:[{n, ar, idea, of:[فهارس المجموعات]}]
    return '<div class="qx-tree qx-tmap qx-tmid">' + root + '<div class="qx-mids" style="--M:' + m.mid.length + ";--mt:" + m.mid.map(function (md) { return "minmax(0," + md.of.length + "fr)"; }).join(" ") + '">' + m.mid.map(function (md, j) {
      return '<div class="qx-mid" style="--k:' + md.of.length + ";--i:" + j + '"><div class="qx-midh"><b class="qx-lat"' + (/[A-Za-z]/.test(md.n || "") ? ' dir="ltr"' : "") + '>' + esc(md.n || "") + "</b>" + (md.ar ? "<small>" + esc(md.ar) + "</small>" : "") + "</div>" +
        (md.idea ? '<div class="qx-bidea">' + rich(md.idea) + "</div>" : "") + '<div class="qx-midk">' + md.of.map(function (gi) { return branch(m.groups[gi], gi); }).join("") + "</div></div>";
    }).join("") + "</div></div>";
  }

  // ---------- أشكال الترتيب والتداخل والمسار والجدول (2026-10-25) ----------
  // اختيار الشكل يتبع بنية المحتوى: ترتيب/مستويات ← steps · مفهوم داخل مفهوم ← nest · مراحل ترجع لبعض ← flow · معياران متقاطعان ← grid
  var MK = 0;
  function steps(m) {
    // سلّم يصعد من الأدنى للأعلى. groups بالترتيب من الأدنى. g.tag سطر صغير تحت الدرجة (hl يبرزه)
    // swap:{a, b, label:[en, ar]} سهم تبادل بين درجتين · brackets:[{from, to, n, ar}] تجمع درجات
    var G = m.groups || [], N = G.length, col = function (g, i) { return g.c || PAL[i % PAL.length]; };
    var stair = G.map(function (g, i) {
      return '<div class="qx-stcol" style="--c:' + col(g, i) + ";--k:" + i + ";--i:" + i + '"><div class="qx-stc' + (g.d ? ' qx-go" data-deep="' + g.d + '" role="button" tabindex="0' : "") + '">' +
        '<span class="qx-stn">' + (i + 1) + '</span><b class="qx-lat">' + esc(g.n || "") + "</b>" + (g.ar ? "<small>" + esc(g.ar) + "</small>" : "") +
        (g.who ? '<span class="qx-who" dir="auto">' + esc(g.who) + "</span>" : "") + chips(g.items) + '</div><div class="qx-riser"></div></div>';
    }).join("");
    var under = G.map(function (g, i) {
      return '<div class="qx-stu" style="--c:' + col(g, i) + '">' + (g.tag ? '<span class="qx-sttag' + (g.hl ? " qx-hl" : "") + '">' + rich(g.tag) + "</span>" : "") + trapHTML(g.trap) + "</div>";
    }).join("");
    var br = (m.brackets || []).map(function (b) { return '<div class="qx-stbr" style="grid-column:' + (b.from + 1) + " / " + (b.to + 2) + '"><span>' + esc(b.n || "") + (b.ar ? " · " + esc(b.ar) : "") + "</span></div>"; }).join("");
    var sw = m.swap ? '<div class="qx-stsw" style="grid-column:' + (m.swap.a + 1) + " / " + (m.swap.b + 2) + ";--s:" + (m.swap.b - m.swap.a + 1) + '"><span>⇄ ' + esc(m.swap.label[0]) + (m.swap.label[1] ? " · " + esc(m.swap.label[1]) : "") + '</span><i aria-hidden="true"></i></div>' : "";
    // الجوال: قائمة من الأعلى للأدنى بنفس الأرقام والأقواس وسطر التبادل
    var mob = [];
    for (var i = N - 1; i >= 0; i--) {
      (m.brackets || []).forEach(function (b) { if (b.to === i) mob.push('<div class="qx-stmb">' + esc(b.n || "") + (b.ar ? " · " + esc(b.ar) : "") + "</div>"); });
      var g = G[i];
      mob.push('<div class="qx-stmi' + (g.d ? ' qx-go" data-deep="' + g.d + '" role="button" tabindex="0' : "") + '" style="--c:' + col(g, i) + '"><span class="qx-stn">' + (i + 1) + '</span><div><b class="qx-lat">' + esc(g.n || "") + "</b>" + (g.ar ? " <small>" + esc(g.ar) + "</small>" : "") + chips(g.items) +
        (g.tag ? '<span class="qx-sttag' + (g.hl ? " qx-hl" : "") + '">' + rich(g.tag) + "</span>" : "") + trapHTML(g.trap) + "</div></div>");
      if (m.swap && i === m.swap.b) mob.push('<div class="qx-stms">⇅ ' + esc(m.swap.label[0]) + (m.swap.label[1] ? " · " + esc(m.swap.label[1]) : "") + "</div>");
    }
    // head:true يُظهر عنوان السلّم (لقسم فيه أكثر من نظرية، مثل ماسلو داخل «الدافعية ونظرياتها»)
    var tt = m.title || ["", ""], hd = m.head ? '<div class="qx-gtitle"><b>' + esc(tt[1] || tt[0]) + "</b>" + (tt[1] && tt[0] ? '<small class="qx-lat">' + esc(tt[0]) + "</small>" : "") + "</div>" : "";
    var lite = !G.some(function (g) { return (g.items && g.items.length) || g.who; });
    return hd + '<div class="qx-steps' + (lite ? " qx-stlite" : "") + (N >= 7 ? " qx-stmany" : "") + '" style="--N:' + N + '">' + sw + stair + br + under + '</div><div class="qx-stm">' + mob.join("") + "</div>";
  }
  function nest(m) {
    // صناديق متداخلة: groups من الأعم (الخارجي) إلى الأخص (الداخلي)؛ g.tag وصف قصير بجانب الاسم
    var G = m.groups || [], h = "";
    for (var i = G.length - 1; i >= 0; i--) {
      var g = G[i], c = g.c || PAL[i % PAL.length];
      h = '<div class="qx-nb" style="--c:' + c + ";--i:" + i + '"><div class="qx-nbh' + (g.d ? ' qx-go" data-deep="' + g.d + '" role="button" tabindex="0' : "") + '"><b class="qx-lat">' + esc(g.n || "") + "</b>" + (g.tag ? '<span class="qx-nbt">' + esc(g.tag) + "</span>" : "") + "</div>" +
        (g.ar ? '<p class="qx-nbp">' + rich(g.ar) + "</p>" : "") + (g.who ? '<span class="qx-who" dir="auto">' + esc(g.who) + "</span>" : "") + chips(g.items) + h + trapHTML(g.trap) + "</div>";
    }
    var tt = m.title || ["", ""];
    return '<div class="qx-nest"><div class="qx-nesth"><b>' + esc(tt[1] || tt[0]) + "</b>" + (tt[1] && tt[0] ? '<small class="qx-lat">' + esc(tt[0]) + "</small>" : "") + "</div>" + h +
      (m.axis ? '<div class="qx-nax"><span>' + esc(m.axis[0]) + '</span><i aria-hidden="true"></i><span>' + esc(m.axis[1]) + "</span></div>" : "") + "</div>";
  }
  function flow(m) {
    // مسار مرتب بأسهم إلى الأمام، وأسهم رجوع منقطة تحته: back:[[من, إلى], …] (مراحل الكتابة متكررة)، loop:[en, ar] عنوان الرجوع
    // التربوي (من اليمين لليسار): المحطة الأولى يميناً والأسهم لليسار — s إشارة الاتجاه، والبطاقات تحته تنعكس وحدها مع اتجاه الصفحة
    var G = m.groups || [], N = G.length, W = 760, pw = Math.min(132, W / N - 22), ph = 58, y0 = 6, id = "qxa" + (++MK), s = window.QX_LTR ? 1 : -1;
    var cx = function (i) { return W * (s > 0 ? i + 0.5 : N - i - 0.5) / N; }, back = m.back || [], depth = 0;
    var svg = '<defs><marker id="' + id + 'f" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" class="qx-mkf"/></marker>' +
      '<marker id="' + id + 'b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" class="qx-mkb"/></marker></defs>';
    G.forEach(function (g, i) {
      var c = g.c || PAL[i % PAL.length], x = cx(i) - pw / 2;
      if (i < N - 1) svg += '<line x1="' + (cx(i) + s * (pw / 2 + 4)) + '" y1="' + (y0 + ph / 2) + '" x2="' + (cx(i + 1) - s * (pw / 2 + 6)) + '" y2="' + (y0 + ph / 2) + '" class="qx-fwd" marker-end="url(#' + id + 'f)"/>';
      svg += '<g class="qx-fst" style="--i:' + i + '"><rect x="' + x + '" y="' + y0 + '" width="' + pw + '" height="' + ph + '" rx="16" fill="' + c + '"/>' +
        '<text x="' + cx(i) + '" y="' + (y0 + (g.ar ? 24 : ph / 2 + 5)) + '" text-anchor="middle" fill="#fff" font-size="' + Math.min(15, +fit(g.short || g.n, pw - 12, 15, 0.56)) + '" font-weight="800" class="qx-lat">' + esc(g.short || g.n) + "</text>" +
        (g.ar ? '<text x="' + cx(i) + '" y="' + (y0 + 44) + '" text-anchor="middle" fill="#fff" font-size="13" font-weight="600" opacity=".92">' + esc(g.ar) + "</text>" : "") + "</g>";
    });
    back.forEach(function (b, k) {
      // بداية السهم ونهايته تُزاح قليلاً لكل سهم حتى لا تتراكب رؤوس الأسهم عند نفس المحطة
      var a = b[0], t = b[1], d = 30 + 22 * (a - t - 1) + 14 * k, yb = y0 + ph + 4, x1 = cx(a) - s * (10 + 6 * k), x2 = cx(t) + s * (8 + 12 * k);
      depth = Math.max(depth, d);
      svg += '<path d="M' + x1 + "," + yb + " C" + x1 + "," + (yb + d) + " " + x2 + "," + (yb + d) + " " + x2 + "," + (yb + 3) + '" class="qx-bk" marker-end="url(#' + id + 'b)"/>';
    });
    var H = y0 + ph + (back.length ? depth + 34 : 10);
    if (back.length && m.loop) svg += '<text x="' + W / 2 + '" y="' + (H - 8) + '" text-anchor="middle" class="qx-bkt" font-size="13" font-weight="700">↺ ' + esc(m.loop[0]) + (m.loop[1] ? " · " + esc(m.loop[1]) : "") + "</text>";
    var cards = G.map(function (g, i) {
      var c = g.c || PAL[i % PAL.length], ret = back.filter(function (b) { return b[0] === i; }).map(function (b) { return '<span class="qx-ret">↺ ' + esc(G[b[1]].short || G[b[1]].n) + "</span>"; }).join("");
      return '<div class="qx-flc" style="--c:' + c + ";--i:" + i + '"><b class="qx-lat qx-flm">' + (i + 1) + ". " + esc(g.n || "") + (g.ar ? " <small>" + esc(g.ar) + "</small>" : "") + "</b>" +
        (g.who ? '<span class="qx-who" dir="auto">' + esc(g.who) + "</span>" : "") + (g.idea ? "<p>" + rich(g.idea) + "</p>" : "") + chips(g.items) + '<div class="qx-rets">' + ret + "</div>" + trapHTML(g.trap) + "</div>";
    }).join("");
    return '<div class="qx-flow"><svg class="qx-flsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc((m.title || [""])[0]) + '">' + svg + "</svg>" +
      (back.length && m.loop ? '<div class="qx-flloop">↺ ' + esc(m.loop[0]) + (m.loop[1] ? " · " + esc(m.loop[1]) : "") + "</div>" : "") +
      '<div class="qx-flcs" style="--N:' + N + '">' + cards + "</div>" + (m.note ? '<p class="qx-gleg">' + rich(m.note) + "</p>" : "") + "</div>";
  }
  function quad(m) {
    // أربعة أنواع يبنيها معياران (أنواع الجمل): cells:[أعلى يسار، أعلى يمين، أسفل يسار، أسفل يمين]
    // كل خلية: {n, ar, f:["I","+","D"…], ex, trap} — I قطعة مستقلة ممتلئة، D قطعة تابعة منقطة، وغيرهما كلمة ربط
    // right / down: عنوان السهم الأفقي (يمين) والعمودي (لأسفل) — يشرح الآلية: أضف مستقلة ← يمين، أضف تابعة ← أسفل
    var L = m.blocks || ["independent", "dependent"];
    function formula(f, c) {
      return '<div class="qx-qf">' + (f || []).map(function (t) {
        if (t === "I") return '<span class="qx-qi" style="--c:' + c + '">' + esc(L[0]) + "</span>";
        if (t === "D") return '<span class="qx-qd" style="--c:' + c + '">' + esc(L[1]) + "</span>";
        return "<i>" + esc(t) + "</i>";
      }).join("") + "</div>";
    }
    function card(x, i) {
      var c = x.c || PAL[i % PAL.length];
      return '<div class="qx-qc' + (x.d ? ' qx-go" data-deep="' + x.d + '" role="button" tabindex="0' : "") + '" style="--c:' + c + ";--i:" + i + '"><div class="qx-qh"><b class="qx-lat">' + esc(x.n || "") + "</b>" + (x.ar ? "<small>" + esc(x.ar) + "</small>" : "") + "</div>" +
        formula(x.f, c) + (x.ex ? '<p class="qx-qex" dir="' + (window.QX_LTR ? "ltr" : "rtl") + '">' + md(x.ex) + "</p>" : "") + trapHTML(x.trap) + "</div>";
    }
    var C = m.cells || [], r = m.right || ["", ""], dn = m.down || ["", ""];
    var ha = '<div class="qx-qa qx-qah" aria-hidden="true"><span>' + esc(r[0]) + "</span><i></i>" + (r[1] ? "<small>" + esc(r[1]) + "</small>" : "") + "</div>";
    var va = '<div class="qx-qa qx-qav" aria-hidden="true"><span>' + esc(dn[0]) + "</span><i></i>" + (dn[1] ? "<small>" + esc(dn[1]) + "</small>" : "") + "</div>";
    var tt = m.title || ["", ""];
    return '<div class="qx-quad"><div class="qx-gtitle"><b>' + esc(tt[1] || tt[0]) + "</b>" + (tt[1] && tt[0] ? '<small class="qx-lat">' + esc(tt[0]) + "</small>" : "") + "</div>" +
      '<div class="qx-qg">' + card(C[0], 0) + ha + card(C[1], 1) + va + "<span></span>" + va + card(C[2], 2) + ha + card(C[3], 3) + "</div>" +
      '<div class="qx-qleg"><span><span class="qx-qi" style="--c:#1F6B4C">' + esc(L[0]) + "</span> = " + esc(m.legend ? m.legend[0] : "") + '</span><span><span class="qx-qd" style="--c:#1F6B4C">' + esc(L[1]) + "</span> = " + esc(m.legend ? m.legend[1] : "") + "</span></div></div>";
  }
  function grid(m) {
    // جدول بمعيارين: cols:[{n, ar}] · rows:[{n, ar, cells:[…]}] · colsTitle / rowsTitle:[en, ar]
    // خلية بطاقة {n, ar, ex, hl, d} أو خلية رموز نطق {vl, vd, kvl, kvd} (يسار مهموس، يمين مجهور) · flip:true يقلب الجدول على الجوال
    function table(C, R, ct, rt, small) {
      var ar = window.QX_LTR ? "→ " : "← ", ax = (rt ? "↓ " + esc(rt[0]) + (rt[1] ? " " + esc(rt[1]) : "") : "") + (rt && ct ? " · " : "") + (ct ? ar + esc(ct[0]) + (ct[1] ? " " + esc(ct[1]) : "") : "");
      var h = (ax ? '<p class="qx-gax">' + ax + "</p>" : "") + '<div class="qx-gd' + (m.ipa ? " qx-ipa" : "") + '" style="--nc:' + C.length + '"><div class="qx-gc qx-gcorner">' + (rt ? '<span>↓ ' + esc(rt[0]) + (rt[1] ? " <small>" + esc(rt[1]) + "</small>" : "") + "</span>" : "") + (ct ? '<span>' + ar + esc(ct[0]) + (ct[1] ? " <small>" + esc(ct[1]) + "</small>" : "") + "</span>" : "") + "</div>";
      C.forEach(function (c, j) { h += '<div class="qx-gc qx-gch" style="--c:' + (c.c || PAL[j % PAL.length]) + '"><b class="qx-lat">' + esc(small && c.s ? c.s : c.n) + "</b>" + (c.ar ? "<small>" + esc(c.ar) + "</small>" : "") + "</div>"; });
      R.forEach(function (r, i) {
        h += '<div class="qx-gc qx-grh"><b class="qx-lat">' + esc(small && r.s ? r.s : r.n) + "</b>" + (r.ar ? "<small>" + esc(r.ar) + "</small>" : "") + "</div>";
        r.cells.forEach(function (x, j) {
          if (!x) { h += '<div class="qx-gc qx-gx"></div>'; return; }
          if (m.ipa) { h += '<div class="qx-gc qx-gs">' + (x.vl ? '<span class="qx-vl"><b>' + esc(x.vl) + "</b>" + (x.kvl && !small ? "<small>" + esc(x.kvl) + "</small>" : "") + "</span>" : "<span></span>") +
            (x.vd ? '<span class="qx-vd"><b>' + esc(x.vd) + "</b>" + (x.kvd && !small ? "<small>" + esc(x.kvd) + "</small>" : "") + "</span>" : "<span></span>") + "</div>"; return; }
          var c = x.c || PAL[(i * C.length + j) % PAL.length];
          h += '<div class="qx-gc qx-gcard' + (x.d ? ' qx-go" data-deep="' + x.d + '" role="button" tabindex="0' : "") + '" style="--c:' + c + ";--i:" + (i * C.length + j) + '"><b class="qx-lat' + (m.ipaNames ? " qx-ipaf" : "") + '">' + esc(x.n || "") + "</b>" + (x.ar ? "<small>" + esc(x.ar) + "</small>" : "") +
            (x.ex ? '<p class="qx-gex" dir="' + (window.QX_LTR ? "ltr" : "rtl") + '">' + md(x.ex) + "</p>" : "") + trapHTML(x.trap) + "</div>";
        });
      });
      return h + "</div>";
    }
    var tt = m.title || ["", ""], head = '<div class="qx-gtitle"><b>' + esc(tt[1] || tt[0]) + "</b>" + (tt[1] && tt[0] ? '<small class="qx-lat">' + esc(tt[0]) + "</small>" : "") + "</div>";
    var main = table(m.cols, m.rows, m.colsTitle, m.rowsTitle, false);
    var alt = "";
    if (m.flip && m.ipa) {
      // الجوال: جدول الأصوات لا يتسع لست أعمدة؛ قائمة بالمخارج بالترتيب نفسه وتحت كل مخرج أصواته وطريقتها
      alt = '<div class="qx-gm qx-gml">' + m.cols.map(function (c, j) {
        var lines = m.rows.map(function (r) { var x = r.cells[j]; return x ? '<div class="qx-gml-r"><span class="qx-gs"><span class="qx-vl"><b>' + esc(x.vl || "") + '</b></span><span class="qx-vd"><b>' + esc(x.vd || "") + "</b></span></span><small><b class=\"qx-lat\">" + esc(r.n) + "</b>" + (r.ar ? " · " + esc(r.ar) : "") + "</small></div>" : ""; }).join("");
        return '<div class="qx-gml-c" style="--c:' + (c.c || PAL[j % PAL.length]) + '"><div class="qx-gml-h"><b class="qx-lat">' + (j + 1) + ". " + esc(c.n) + "</b>" + (c.ar ? " <small>" + esc(c.ar) + "</small>" : "") + "</div>" + lines + "</div>";
      }).join("") + "</div>";
    } else if (m.mlist) {
      // الجوال: جدول بأسماء صفوف طويلة لا يتسع ← بطاقة لكل صف، وتحتها قيمة كل عمود (mlist:true)
      alt = '<div class="qx-gm qx-gml">' + m.rows.map(function (r, i) {
        var c0 = (r.cells.filter(Boolean)[0] || {}).c || PAL[i % PAL.length], d0 = (r.cells.filter(function (x) { return x && x.d; })[0] || {}).d;
        return '<div class="qx-gml-c' + (d0 ? ' qx-go" data-deep="' + d0 + '" role="button" tabindex="0' : "") + '" style="--c:' + c0 + '"><div class="qx-gml-h"><b>' + esc(r.n) + "</b>" + (r.ar ? " <small>" + esc(r.ar) + "</small>" : "") + "</div>" + m.cols.map(function (c, j) {
          var x = r.cells[j]; return x ? '<div class="qx-gml-r"><small><b>' + esc(c.n) + '</b></small><span class="qx-gmv"><b>' + esc(x.n || "") + "</b>" + (x.ar ? "<small>" + esc(x.ar) + "</small>" : "") + "</span></div>" : "";
        }).join("") + "</div>";
      }).join("") + "</div>";
    } else if (m.flip) {
      var C2 = m.rows.map(function (r) { return { n: r.n, s: r.s, ar: r.ar }; }), R2 = m.cols.map(function (c, j) { return { n: c.n, s: c.s, ar: c.ar, cells: m.rows.map(function (r) { return r.cells[j]; }) }; });
      alt = '<div class="qx-gm">' + table(C2, R2, m.rowsTitle, m.colsTitle, true) + "</div>";
    }
    return '<div class="qx-grid' + (m.rh ? " qx-grhs" : "") + '">' + head + '<div class="' + (m.flip || m.mlist ? "qx-gw" : "") + '">' + main + "</div>" + alt +
      (m.keys ? '<div class="qx-fit qx-gkeys">' + m.keys.map(function (k) { return '<i><b class="qx-ipaf">' + esc(k[0]) + "</b> " + esc(k[1]) + "</i>"; }).join("") + "</div>" : "") +
      (m.legend ? '<p class="qx-gleg">' + rich(m.legend[0]) + (m.legend[1] ? '<span class="qx-glar" dir="rtl">' + rich(m.legend[1]) + "</span>" : "") + "</p>" : "") + trapHTML(m.trap) + "</div>";
  }

  // ---------- الهرم والمنحنيات والرسم البياني (2026-10-26، خرائط التربوي المرحلة 2) ----------
  function ghead(m) { var tt = m.title || ["", ""]; return '<div class="qx-gtitle"><b>' + esc(tt[1] || tt[0]) + "</b>" + (tt[1] && tt[0] ? '<small class="qx-lat">' + esc(tt[0]) + "</small>" : "") + "</div>"; }
  function pyramid(m) {
    // هرم: groups من القاعدة (الأعرض) إلى القمة · g.tag سطر بجانب الطبقة · brackets:[{from, to, n}] تجمع طبقات (مخروط ديل: العمل، الملاحظة، الرموز)
    var G = m.groups || [], N = G.length, h = "";
    G.forEach(function (g, i) {
      var r = N - i, c = g.c || PAL[i % PAL.length], w = Math.round(100 - 66 * i / Math.max(1, N - 1));
      var note = (g.tag ? '<span class="qx-pytag' + (g.hl ? " qx-hl" : "") + '">' + rich(g.tag) + "</span>" : "") + trapHTML(g.trap);
      h += '<div class="qx-pyb" style="grid-row:' + r + '"><div class="qx-pyt' + (g.d ? ' qx-go" data-deep="' + g.d + '" role="button" tabindex="0' : "") + '" style="--c:' + c + ";--w:" + w + "%;--i:" + (N - i) + '"><b>' + esc(g.n || "") + "</b></div>" +
        (note ? '<div class="qx-pynm">' + note + "</div>" : "") + "</div>" + '<div class="qx-pyn" style="grid-row:' + r + '">' + note + "</div>";
    });
    (m.brackets || []).forEach(function (b) { h += '<div class="qx-pybr" style="grid-row:' + (N - b.to) + " / " + (N - b.from + 1) + '"><span>' + esc(b.n || "") + "</span></div>"; });
    return ghead(m) + '<div class="qx-pyr">' + h + "</div>" + trapHTML(m.trap) + (m.note ? '<p class="qx-gleg">' + rich(m.note) + "</p>" : "");
  }
  function curves(m) {
    // ثلاثة منحنيات: curves:[{n, skew:1|0|-1, order, ar, trap}] · المحور من اليسار (منخفضة) إلى اليمين (مرتفعة) كما في كل رسم إحصائي
    var P = { "1": "M10,100 C30,100 45,18 75,18 C110,18 140,80 230,98", "0": "M10,100 C60,100 80,22 120,22 C160,22 180,100 230,100", "-1": "M10,98 C100,80 130,18 165,18 C195,18 210,100 230,100" };
    var K = { "1": [72, 128], "0": [120, 120], "-1": [168, 112] }, ax = m.axis || ["", ""], id = "qxc" + (++MK);
    var cards = (m.curves || []).map(function (c, i) {
      var k = String(c.skew || 0), mo = K[k][0], me = K[k][1], col = c.c || PAL[i % PAL.length];
      var svg = '<svg class="qx-cvsvg" viewBox="0 0 240 132" direction="ltr" role="img" aria-label="' + esc(c.n || "") + '"><defs><marker id="' + id + i + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" class="qx-mkf"/></marker></defs>' +
        '<path d="' + P[k] + ' L230,100 L10,100 Z" fill="' + col + '" opacity=".14"/><path d="' + P[k] + '" fill="none" stroke="' + col + '" stroke-width="3"/>' +
        '<line x1="' + mo + '" y1="22" x2="' + mo + '" y2="100" stroke="' + col + '" stroke-width="2"/>' +
        (k === "0" ? '<text x="120" y="13" text-anchor="middle" class="qx-ink" font-size="12" font-weight="700">' + esc(m.allSame || "") + "</text>"
          : '<line x1="' + me + '" y1="18" x2="' + me + '" y2="100" stroke="#A8562A" stroke-width="2" stroke-dasharray="4 3"/>' +
            '<text x="' + mo + '" y="13" text-anchor="middle" class="qx-ink" font-size="12" font-weight="700">' + esc(m.mode || "") + "</text>" +
            '<text x="' + me + '" y="13" text-anchor="middle" fill="#A8562A" font-size="12" font-weight="700">' + esc(m.mean || "") + "</text>") +
        '<line x1="12" y1="112" x2="226" y2="112" class="qx-fwd" marker-end="url(#' + id + i + ')"/>' +
        '<text x="10" y="128" text-anchor="start" class="qx-sub" font-size="12">' + esc(ax[0]) + '</text><text x="230" y="128" text-anchor="end" class="qx-sub" font-size="12">' + esc(ax[1]) + "</text></svg>";
      return '<div class="qx-cv" style="--c:' + col + '"><b>' + esc(c.n || "") + "</b>" + svg + (c.order ? '<span class="qx-cvo">' + esc(c.order) + "</span>" : "") + (c.ar ? "<p>" + rich(c.ar) + "</p>" : "") + trapHTML(c.trap) + "</div>";
    }).join("");
    return ghead(m) + '<div class="qx-cvs">' + cards + "</div>" + trapHTML(m.trap);
  }
  function chart(m) {
    // نفس البيانات بالأعمدة (للمقارنة) وبالقطاعات (للنسب من الكل): data:[{n, v (نسبة)}] · total يحوّل النسبة لعدد · qa:[[سؤال، حل]]
    var D = m.data || [], N = D.length, T = m.total || 0, rtl = !window.QX_LTR, mx = Math.max.apply(null, D.map(function (d) { return d.v; }));
    var col = function (d, i) { return d.c || PAL[i % PAL.length]; }, cnt = function (d) { return T ? Math.round(T * d.v / 100) : d.v; };
    var W = 300, sw = (W - 40) / N, bw = Math.min(46, sw - 16), bars = "";
    D.forEach(function (d, i) {
      var x = rtl ? W - 20 - (i + 0.5) * sw : 20 + (i + 0.5) * sw, hh = Math.round(110 * d.v / mx);
      bars += '<rect x="' + (x - bw / 2) + '" y="' + (150 - hh) + '" width="' + bw + '" height="' + hh + '" rx="4" fill="' + col(d, i) + '"/>' +
        '<text x="' + x + '" y="' + (144 - hh) + '" text-anchor="middle" class="qx-ink" font-size="13" font-weight="800">' + cnt(d) + "</text>" +
        '<text x="' + x + '" y="170" text-anchor="middle" class="qx-sub" font-size="12">' + esc(d.n) + "</text>";
    });
    bars = '<svg class="qx-chsvg" viewBox="0 0 ' + W + ' 182" role="img" aria-label="' + esc(m.barsLabel || "") + '"><line x1="14" y1="150" x2="' + (W - 14) + '" y2="150" class="qx-fwd"/>' + bars + "</svg>";
    var a0 = -Math.PI / 2, pie = "", leg = "";
    D.forEach(function (d, i) {
      var a1 = a0 + 2 * Math.PI * d.v / 100, big = a1 - a0 > Math.PI ? 1 : 0, p0 = pol(95, 95, 82, a0), p1 = pol(95, 95, 82, a1), am = (a0 + a1) / 2, t = pol(95, 95, 54, am);
      pie += '<path d="M95,95 L' + p0 + " A82,82 0 " + big + " 1 " + p1 + 'Z" fill="' + col(d, i) + '" stroke="var(--sheet,#fff)" stroke-width="2"/>' + (d.v >= 10 ? '<text x="' + t[0] + '" y="' + (t[1] + 5) + '" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">' + d.v + "%</text>" : "");
      leg += '<li style="--c:' + col(d, i) + '"><i></i><b>' + esc(d.n) + "</b> " + d.v + "%" + (T ? " · " + cnt(d) : "") + ' · <span dir="ltr">' + Math.round(d.v * 3.6) + "°</span></li>";
      a0 = a1;
    });
    pie = '<svg class="qx-pisvg" viewBox="0 0 190 190" role="img" aria-label="' + esc(m.pieLabel || "") + '">' + pie + "</svg>";
    var qa = (m.qa || []).map(function (q) { return "<li><b>" + rich(q[0]) + "</b> " + rich(q[1]) + "</li>"; }).join("");
    return ghead(m) + '<div class="qx-chs"><div class="qx-chp"><div class="qx-chh">' + esc(m.barsLabel || "") + "</div>" + bars + '</div><div class="qx-chp"><div class="qx-chh">' + esc(m.pieLabel || "") + '</div><div class="qx-pirow">' + pie + '<ul class="qx-pileg">' + leg + "</ul></div></div></div>" +
      (qa ? '<ul class="qx-chqa">' + qa + "</ul>" : "") + trapHTML(m.trap);
  }
  // خريطة خطوط أفقية: جذر واحد تتفرع منه خطوط إلى بطاقات (للتقسيمات القصيرة: عناصر، أنواع، مكونات)
  function fan(m) {
    var tt = m.title || ["", ""], G = m.groups || [];
    return '<div class="qx-fan"><div class="qx-froot"><b>' + esc(tt[1] || tt[0]) + "</b>" + (tt[1] && tt[0] ? '<small class="qx-lat" dir="ltr">' + esc(tt[0]) + "</small>" : "") + "</div>" +
      '<ul class="qx-fkids' + (G.length === 1 ? " qx-one" : "") + '">' + G.map(function (g, i) {
        var col = g.c || PAL[i % PAL.length];
        return '<li style="--c:' + col + ";--i:" + i + '"><div class="qx-fk' + (g.d ? ' qx-go" data-deep="' + g.d + '" role="button" tabindex="0' : "") + '">' +
          '<div class="qx-fkh"><b>' + esc(g.n || "") + "</b>" + (g.d ? '<span class="qx-fplus">＋</span>' : "") + "</div>" +
          (g.who ? '<span class="qx-who" dir="auto">' + esc(g.who) + "</span>" : "") + (g.ar ? "<p>" + rich(g.ar) + "</p>" : "") +
          (g.items && g.items.length ? '<div class="qx-fit">' + g.items.map(function (it) { return it.d ? '<button type="button" class="qx-dl" data-deep="' + it.d + '">' + esc(it.n) + "</button>" : "<i>" + esc(it.n) + "</i>"; }).join("") + "</div>" : "") +
          trapHTML(g.trap) + "</div></li>";
      }).join("") + "</ul></div>";
  }
  // دليل مختصر تحت العجلة على الجوال فقط (العجلة الصغيرة لا تتسع للعناصر)
  function legend(m) {
    return '<div class="qx-leg">' + m.groups.map(function (g, i) {
      var col = g.c || PAL[i % PAL.length], nm = esc(g.n || "");
      return '<div class="qx-lg" style="--c:' + col + '"><b>' + (g.d ? '<button type="button" class="qx-dl" data-deep="' + g.d + '">' + nm + "</button>" : nm) + (g.ar && g.ar !== g.n ? " <small>" + esc(g.ar) + "</small>" : "") + '</b><span class="qx-lgi">' +
        (g.items || []).map(function (it) { var t = esc(it.n) + (it.who ? ' <em>· ' + esc(it.who) + "</em>" : ""); return it.d ? '<button type="button" class="qx-dl" data-deep="' + it.d + '">' + t + "</button>" : "<i>" + t + "</i>"; }).join("") + "</span></div>";
    }).join("") + "</div>";
  }
  // كل خريطة بشكل واحد فقط: عجلة، أو خطوط، أو شجرة، أو بطاقات (طلب يوسف: لا تتكرر الخريطة بشكلين)
  function map(m) {
    if (!m || (!m.groups && !m.rows && !m.cells && !m.curves && !m.data)) return "";
    var open = '<figure class="qx-map"' + (window.QX_LTR ? ' dir="ltr"' : "") + ">";
    if (m.type === "tree") return open + tree(m) + "</figure>";
    if (m.type === "fan") return open + fan(m) + "</figure>";
    if (m.type === "cards") return open + cards(m) + "</figure>";
    if (m.type === "steps") return open + steps(m) + "</figure>";
    if (m.type === "nest") return open + nest(m) + "</figure>";
    if (m.type === "flow") return open + flow(m) + "</figure>";
    if (m.type === "grid") return open + grid(m) + "</figure>";
    if (m.type === "quad") return open + quad(m) + "</figure>";
    if (m.type === "pyramid") return open + pyramid(m) + "</figure>";
    if (m.type === "curves") return open + curves(m) + "</figure>";
    if (m.type === "chart") return open + chart(m) + "</figure>";
    return open + '<div class="qx-wheelbox">' + wheel(m, false) + wheel(m, true) + "</div>" + legend(m) + "</figure>";
  }

  // ---------- أجزاء القسم ----------
  function sec(s) {
    var h = "";
    // s.intro: مصفوفة فقرات، كل فقرة نص عربي أو زوج [English, عربي]
    if (s.intro && s.intro.length) h += '<div class="qx-intro"><div class="qx-lbl">الفكرة ببساطة</div>' + s.intro.map(function (x) { return txt(x); }).join("") + "</div>";
    if (s.cmp) h += cmp(s.cmp);
    if (s.map) h += map(s.map);
    return h;
  }
  // مقارنة قبل/بعد: {title, cols:[a,b], rows:[{k, a, b, tag}]}
  var TAGC = { "أُضيف": "add", "جديد": "add", "أُلغي": "del", "حُذف": "del", "تغيّر": "chg", "بقي": "same" };
  function cmp(c) {
    var C = c.cols || ["قبل", "بعد"];
    return '<div class="qx-cmp"><div class="qx-lbl">' + esc(c.title || "مقارنة") + '</div><div class="qx-cmph"><span></span><b>' + esc(C[0]) + "</b><b>" + esc(C[1]) + "</b></div>" +
      (c.rows || []).map(function (r, i) {
        return '<div class="qx-cmpr" style="--i:' + i + '"><div class="qx-k">' + rich(r.k || "") + (r.tag ? ' <i class="qx-tag qx-' + (TAGC[r.tag] || "same") + '">' + esc(r.tag) + "</i>" : "") + "</div>" +
          '<div class="qx-a"><small>' + esc(C[0]) + "</small>" + (r.a ? rich(r.a) : '<span class="qx-none">—</span>') + "</div>" +
          '<div class="qx-b"><small>' + esc(C[1]) + "</small>" + (r.b ? rich(r.b) : '<span class="qx-none">—</span>') + "</div></div>";
      }).join("") +
      // على الجوال: كل بند سطر واحد ينفتح بالضغط حتى لا يطول الجدول
      '<div class="qx-cmpm"><p class="qx-cmphint">اضغط أي بند لترى «' + esc(C[0]) + '» و«' + esc(C[1]) + '»</p>' + (c.rows || []).map(function (r) {
        return '<details><summary><b>' + rich(r.k || "") + "</b>" + (r.tag ? ' <i class="qx-tag qx-' + (TAGC[r.tag] || "same") + '">' + esc(r.tag) + "</i>" : "") + "</summary>" +
          '<div class="qx-cmpd"><div><small>' + esc(C[0]) + "</small>" + (r.a ? rich(r.a) : '<span class="qx-none">—</span>') + '</div><div><small>' + esc(C[1]) + "</small>" + (r.b ? rich(r.b) : '<span class="qx-none">—</span>') + "</div></div></details>";
      }).join("") + "</div></div>";
  }
  function after(s) {
    if (!s.ex || !s.ex.length) return "";
    return '<div class="qx-ex"><div class="qx-lbl">مثال من الفصل</div>' + s.ex.map(function (x) { return '<div class="qx-exi">' + txt(x) + "</div>"; }).join("") + "</div>";
  }

  // ---------- درج الاستفاضة ----------
  var stack = [];
  function drawer() {
    var d = document.getElementById("qx-drawer");
    if (d) return d;
    d = document.createElement("div"); d.id = "qx-drawer"; d.setAttribute("aria-hidden", "true");
    d.innerHTML = '<div class="qx-dim" data-qx="close"></div><aside class="qx-pane" role="dialog" aria-modal="true" aria-labelledby="qx-dt" dir="rtl"><div class="qx-top"><button type="button" class="qx-back" data-qx="back" hidden>→ رجوع</button><span class="qx-sp"></span><button type="button" class="qx-x" data-qx="close" aria-label="إغلاق">✕</button></div><div class="qx-body"></div></aside>';
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { var b = e.target.closest("[data-qx]"); if (!b) return; if (b.dataset.qx === "close") close(); else back(); });
    return d;
  }
  function render(key) {
    var D = (window.DEEP || {})[key], d = drawer(), body = d.querySelector(".qx-body");
    if (!window.DEEP && window.__loadDeep) { body.innerHTML = '<p class="qx-muted">لحظة…</p>'; window.__loadDeep().then(function () { render(key); }); return; }
    if (!D) { body.innerHTML = '<p class="qx-muted">الشرح الموسع لهذا المفهوم قيد الإعداد.</p>'; return; }
    var h = '<div class="qx-kicker">' + esc(D.k || "شرح موسّع") + '</div><h2 id="qx-dt">' + esc(isPair(D.t) ? D.t[1] || D.t[0] : D.t) + "</h2>" + (isPair(D.t) && D.t[1] ? '<div class="qx-lat qx-sub2" dir="ltr">' + esc(D.t[0]) + "</div>" : "");
    (D.body || []).forEach(function (x) { h += txt(x); });
    if (D.map) h += map(D.map);
    if (D.pts && D.pts.length) h += '<ul class="qx-pts">' + D.pts.map(function (x) { return "<li>" + (isPair(x) ? txt(x) : rich(x)) + "</li>"; }).join("") + "</ul>";
    if (D.ex && D.ex.length) h += '<div class="qx-ex"><div class="qx-lbl">أمثلة</div>' + D.ex.map(function (x) { return '<div class="qx-exi">' + txt(x) + "</div>"; }).join("") + "</div>";
    if (D.traps && D.traps.length) h += '<div class="qx-tr"><div class="qx-lbl">فخاخ الأسئلة</div><ul>' + D.traps.map(function (x) { return "<li>" + (isPair(x) ? txt(x) : rich(x)) + "</li>"; }).join("") + "</ul></div>";
    if (D.src) h += '<div class="qx-src">المرجع: ' + rich(D.src) + "</div>";
    body.innerHTML = h; body.scrollTop = 0;
  }
  function open(key) {
    var d = drawer(); stack.push(key); render(key);
    d.querySelector(".qx-back").hidden = stack.length < 2;
    if (!d.classList.contains("on")) { d.classList.add("on"); d.setAttribute("aria-hidden", "false"); document.documentElement.classList.add("qx-lock"); setTimeout(function () { var x = d.querySelector(".qx-x"); x && x.focus(); }, 60); }
  }
  function back() { var d = drawer(); stack.pop(); if (!stack.length) return close(); render(stack[stack.length - 1]); d.querySelector(".qx-back").hidden = stack.length < 2; }
  function close() { var d = drawer(); stack = []; d.classList.remove("on"); d.setAttribute("aria-hidden", "true"); document.documentElement.classList.remove("qx-lock"); }
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".qx-dl,.qx-go"); if (b) { e.preventDefault(); open(b.getAttribute("data-deep")); } });
  document.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("qx-go")) { e.preventDefault(); open(e.target.getAttribute("data-deep")); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.querySelector("#qx-drawer.on")) close(); });

  // ---------- الأنماط ----------
  var css = [
    ".qx-dl{font:inherit;color:var(--accent,#1F6B4C);background:color-mix(in srgb,var(--accent,#1F6B4C) 10%,transparent);border:0;border-bottom:1.5px dashed currentColor;border-radius:4px;padding:0 3px;cursor:pointer;font-weight:700;line-height:inherit}",
    "@media (hover:hover){.qx-dl:hover{background:color-mix(in srgb,var(--accent,#1F6B4C) 18%,transparent)}}",
    ".qx-lbl{font-size:.78rem;font-weight:800;color:var(--accent,#1F6B4C);margin-bottom:4px}",
    ".qx-intro{margin:6px 0 14px;padding:12px 14px;border-radius:14px;background:color-mix(in srgb,var(--accent,#1F6B4C) 7%,transparent)}",
    ".qx-intro p,.qx-ex p,.qx-pane p{margin:0 0 8px}",".qx-intro p:last-child{margin:0}",
    ".qx-en{font-size:1rem;line-height:1.75;text-align:left}.qx-ar{font-size:.92rem;color:var(--muted,#4A5953);margin:2px 0 8px}",
    ".qx-ex{margin:10px 0 4px;padding:10px 14px;border-radius:14px;border:1px dashed var(--rule-strong,#C9D3CE)}.qx-exi+.qx-exi{border-top:1px solid var(--rule,#E1E7E4);padding-top:8px;margin-top:8px}",
    ".qx-map{margin:10px 0 16px;padding:0}.qx-mt{margin-bottom:6px}.qx-badge{display:inline-block;font-size:.72rem;font-weight:800;color:#fff;background:var(--accent,#1F6B4C);border-radius:999px;padding:1px 10px}",
    ".qx-wheelbox{max-width:760px;margin:0 auto 10px}.qx-wheel{width:100%;height:auto;display:block}.qx-wheel text{font-family:inherit}.qx-c{display:none}",
    "@media (max-width:560px){.qx-f{display:none}.qx-c{display:block;max-width:320px;margin:0 auto}}",
    ".qx-node{fill:var(--sheet,#fff)}.qx-core{fill:var(--sheet,#fff);stroke:var(--rule,#D9E1DD);stroke-width:2}.qx-ink{fill:var(--ink,#172420)}.qx-sub{fill:var(--muted,#4A5953)}.qx-gold{fill:#B8892E}",
    ".qx-lat{font-family:inherit}",
    ".qx-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.qx-cc{grid-template-columns:repeat(var(--cc),minmax(0,1fr))}@media (max-width:560px){.qx-cc{grid-template-columns:1fr}}",
    ".qx-col{border-radius:16px;overflow:hidden;border:1px solid var(--rule,#D9E1DD);background:var(--sheet,#fff);min-width:0}",
    ".qx-hd{padding:10px 12px;color:#fff}.qx-hd b{display:block;font-size:1.02rem;text-align:right}.qx-hd span{display:block;font-size:.8rem;opacity:.92;line-height:1.55}",
    ".qx-hd .qx-dl{color:#fff;background:rgba(255,255,255,.18)}",
    ".qx-bd{padding:10px 12px;display:grid;gap:10px}",
    ".qx-th{border-inline-start:3px solid var(--c);padding-inline-start:10px}.qx-th>div{min-width:0}",
    ".qx-th b{display:block;font-size:.95rem;text-align:right}.qx-th small{display:block;color:var(--muted,#4A5953);font-size:.82rem;line-height:1.55}",
    ".qx-kw{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.qx-kw i{font-style:normal;font-size:.72rem;border-radius:999px;padding:0 8px;background:var(--paper,#EEF3F0);max-width:100%;overflow-wrap:anywhere}",
    ".qx-trap{font-size:.8rem;background:var(--hl,#FFF4D6);color:var(--hl-ink,#7A5200);border-radius:10px;padding:6px 9px;overflow-wrap:anywhere}",
    /* الدرج */
    "#qx-drawer{position:fixed;inset:0;z-index:200;pointer-events:none}",
    "#qx-drawer .qx-dim{position:absolute;inset:0;background:rgba(10,16,13,.42);opacity:0;transition:opacity .25s}",
    "#qx-drawer .qx-pane{position:absolute;top:0;bottom:0;left:0;width:min(560px,100%);background:var(--sheet,#fff);color:var(--ink,#172420);box-shadow:8px 0 40px rgba(0,0,0,.18);transform:translateX(-104%);transition:transform .32s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column}",
    "#qx-drawer.on{pointer-events:auto}#qx-drawer.on .qx-dim{opacity:1}#qx-drawer.on .qx-pane{transform:none}",
    ".qx-top{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;border-bottom:1px solid var(--rule,#D9E1DD)}.qx-sp{flex:1}",
    ".qx-x,.qx-back{font:inherit;border:1px solid var(--rule,#D9E1DD);background:none;color:var(--ink,#172420);border-radius:999px;padding:4px 12px;cursor:pointer}.qx-x{width:36px;height:36px;padding:0}",
    ".qx-body{overflow:auto;padding:16px 18px calc(28px + env(safe-area-inset-bottom,0px));-webkit-overflow-scrolling:touch}",
    ".qx-kicker{font-size:.78rem;font-weight:800;color:var(--accent,#1F6B4C)}.qx-body h2{margin:2px 0 2px;font-size:1.35rem;line-height:1.4}.qx-sub2{color:var(--muted,#4A5953);margin-bottom:12px}",
    ".qx-pts,.qx-tr ul{list-style:none;margin:8px 0;padding:0}.qx-pts li,.qx-tr li{position:relative;margin-bottom:8px;padding-inline-start:18px}.qx-pts li::before,.qx-tr li::before{content:'';position:absolute;inset-inline-start:2px;top:.72em;width:6px;height:6px;border-radius:50%;background:var(--accent,#1F6B4C)}.qx-tr li::before{background:var(--hl-ink,#7A5200)}.qx-pts li>.qx-en,.qx-tr li>.qx-en{text-align:start}",
    ".qx-tr{margin-top:12px;background:var(--hl,#FFF4D6);border-radius:14px;padding:10px 14px}.qx-tr ul{margin:0}",
    ".qx-src{margin-top:14px;font-size:.82rem;color:var(--muted,#4A5953);border-top:1px solid var(--rule,#D9E1DD);padding-top:8px}",
    ".qx-go{cursor:pointer}@media (hover:hover){.qx-go:hover circle,.qx-go:hover path{filter:brightness(1.06)}}.qx-go:focus-visible{outline:none}.qx-go:focus-visible circle{stroke-width:5}",
    ".qx-rev{margin:14px 0;border:1px solid var(--rule,#D9E1DD);border-radius:18px;background:var(--sheet,#fff);overflow:hidden}",
    ".qx-rev>summary{cursor:pointer;list-style:none;padding:12px 16px;font-weight:700;display:flex;gap:10px;align-items:center}.qx-rev>summary::-webkit-details-marker{display:none}.qx-rev>summary::after{content:'＋';margin-inline-start:auto;color:var(--muted,#4A5953)}.qx-rev[open]>summary::after{content:'－'}",
    ".qx-tree{padding:4px 16px 18px;display:flex;flex-direction:column;align-items:center}",
    ".qx-root{background:var(--ink,#172420);color:var(--sheet,#fff);border-radius:999px;padding:10px 26px;text-align:center;font-weight:800;position:relative}.qx-root small{display:block;font-weight:600;opacity:.8;font-size:.8rem}",
    ".qx-brs{margin-top:26px;width:100%;display:grid;gap:28px;--g:12px}",
    ".qx-root::after{content:'';position:absolute;top:100%;left:50%;height:12px;border-left:2px solid var(--rule-strong,#C9D3CE)}",
    ".qx-row{position:relative;display:flex;justify-content:center;align-items:flex-start;gap:var(--g)}.qx-row>.qx-br{flex:0 0 calc((100% - (var(--C) - 1) * var(--g)) / var(--C));min-width:0;z-index:1}",
    ".qx-row::before{content:'';position:absolute;top:-14px;border-top:2px solid var(--rule-strong,#C9D3CE);left:calc(50% - (var(--k) - 1) / 2 * ((100% - (var(--C) - 1) * var(--g)) / var(--C) + var(--g)));right:calc(50% - (var(--k) - 1) / 2 * ((100% - (var(--C) - 1) * var(--g)) / var(--C) + var(--g)))}",
    ".qx-row:not(:last-child)::after{content:'';position:absolute;left:50%;top:-14px;bottom:-42px;border-left:2px solid var(--rule-strong,#C9D3CE);z-index:0}",
    ".qx-br{position:relative;border:2px solid var(--c);border-radius:16px;padding:0 0 8px;background:var(--sheet,#fff)}",
    ".qx-br::before{content:'';position:absolute;top:-16px;left:50%;height:14px;border-left:2px solid var(--c)}",
    ".qx-bh{background:var(--c);color:#fff;font-weight:800;padding:8px 10px;border-radius:12px 12px 0 0;text-align:center;font-size:.92rem;line-height:1.4;overflow-wrap:anywhere}.qx-bh small{display:block;font-weight:600;opacity:.88;font-size:.76rem}",
    ".qx-br ul{list-style:none;margin:0;padding:6px 10px 0;display:grid;gap:4px}.qx-br li{font-size:.84rem;line-height:1.45;padding:3px 0;border-bottom:1px dashed var(--rule,#E1E7E4);text-align:center;overflow-wrap:anywhere}.qx-br li:last-child{border-bottom:0}",
    "@media (max-width:560px){.qx-brs{gap:12px;padding-inline-start:16px;border-inline-start:2px solid var(--rule-strong,#C9D3CE);margin-top:14px}.qx-row{display:grid;gap:12px;justify-content:stretch}.qx-row>.qx-br{flex:none}.qx-row::before,.qx-row::after,.qx-root::after{display:none}.qx-br::before{top:50%;left:auto;right:-18px;height:0;width:16px;border-left:0;border-top:2px solid var(--c)}}",
    ".qx-who{display:inline-block;font-size:.76rem;font-weight:800;color:var(--accent,#1F6B4C);background:color-mix(in srgb,var(--accent,#1F6B4C) 10%,transparent);border-radius:999px;padding:0 8px;margin:2px 0;max-width:100%;overflow-wrap:anywhere}",
    ".qx-th .qx-who{display:table}.qx-br li .qx-who{display:table;margin:2px auto}.qx-br li small{display:block;color:var(--muted,#4A5953);font-size:.78rem}.qx-br li b{display:block}",
    ".qx-btrap{margin:8px 10px 0;font-size:.76rem}.qx-bidea{font-size:.78rem;color:var(--muted,#4A5953);text-align:center;padding:6px 10px 0;line-height:1.5}.qx-kwc{justify-content:center}",
    ".qx-cmp{margin:10px 0 14px;border:1px solid var(--rule,#D9E1DD);border-radius:16px;overflow:hidden;background:var(--sheet,#fff)}.qx-cmp>.qx-lbl{padding:10px 14px 0}",
    ".qx-cmph,.qx-cmpr{display:grid;grid-template-columns:1fr 1.25fr 1.25fr;gap:10px;padding:8px 14px;align-items:start}.qx-cmph{font-size:.82rem;border-bottom:2px solid var(--rule-strong,#C9D3CE)}",
    ".qx-cmpr{border-bottom:1px solid var(--rule,#E1E7E4);font-size:.9rem;line-height:1.6}.qx-cmpr:last-child{border-bottom:0}.qx-cmpr>div{min-width:0;overflow-wrap:anywhere}.qx-k{font-weight:800}.qx-cmpr small{display:none}",
    ".qx-tag{font-style:normal;font-size:.72rem;font-weight:800;border-radius:999px;padding:0 7px;white-space:nowrap}.qx-add{background:#DDF3E6;color:#14532D}.qx-del{background:#FDE2E0;color:#8A1C12}.qx-chg{background:#FFF0CC;color:#7A5200}.qx-same{background:var(--paper,#EEF3F0);color:var(--muted,#4A5953)}.qx-none{color:var(--muted,#4A5953)}",
    ".qx-cmpm{display:none}",
    "@media (max-width:560px){.qx-cmph,.qx-cmpr{display:none}.qx-cmpm{display:block;padding:0 12px 8px}.qx-cmphint{margin:2px 2px 6px;font-size:.76rem;color:var(--muted,#4A5953)}",
    ".qx-cmpm details{border-bottom:1px solid var(--rule,#E1E7E4)}.qx-cmpm details:last-child{border-bottom:0}.qx-cmpm summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;padding:10px 2px;font-size:.92rem}.qx-cmpm summary::-webkit-details-marker{display:none}.qx-cmpm summary::after{content:'＋';margin-inline-start:auto;color:var(--muted,#4A5953)}.qx-cmpm details[open] summary::after{content:'－'}",
    ".qx-cmpd{display:grid;gap:8px;padding:0 2px 12px;font-size:.88rem;line-height:1.65}.qx-cmpd small{display:block;font-size:.76rem;font-weight:800;color:var(--muted,#4A5953)}.qx-cmpd>div:last-child{background:color-mix(in srgb,var(--accent,#1F6B4C) 7%,transparent);border-radius:10px;padding:6px 9px}}",
    /* حركة خفيفة عند ظهور الخرائط */
    "@keyframes qxPop{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:none}}@keyframes qxRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes qxFade{from{opacity:0}to{opacity:1}}",
    ".qx-seg{transform-box:view-box;transform-origin:50% 50%;animation:qxPop .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0) * 80ms)}",
    ".qx-nd{animation:qxFade .5s ease both;animation-delay:calc(300ms + var(--i,0) * 80ms)}",
    ".qx-tmap .qx-root{animation:qxFade .4s ease both}.qx-tmap .qx-br,.qx-rev[open] .qx-br{animation:qxRise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(120ms + var(--i,0) * 70ms)}",
    ".qx-cmpr{animation:qxRise .4s ease both;animation-delay:calc(var(--i,0) * 50ms)}",
    "@media (prefers-reduced-motion:reduce){.qx-seg,.qx-nd,.qx-tmap .qx-root,.qx-tmap .qx-br,.qx-rev[open] .qx-br,.qx-cmpr{animation:none}}",
    /* خريطة الخطوط الأفقية */
    ".qx-fan{--sp:30px;--g:14px;display:grid;grid-template-columns:minmax(130px,185px) 1fr;align-items:center;padding:8px 2px 12px}",
    ".qx-froot{position:relative;z-index:1;background:linear-gradient(140deg,var(--ink,#172420),var(--accent,#1F6B4C));color:var(--sheet,#fff);border-radius:20px;padding:20px 16px;text-align:center;box-shadow:0 14px 30px -16px rgba(0,0,0,.55);animation:qxFade .45s ease both}",
    ".qx-froot b{display:block;font-size:1.06rem;line-height:1.5}.qx-froot small{display:block;margin-top:4px;font-size:.78rem;opacity:.8}",
    ".qx-froot::after{content:'';position:absolute;top:50%;inset-inline-end:calc(-1 * var(--sp));width:var(--sp);border-top:2px solid var(--rule-strong,#C9D3CE)}",
    ".qx-fkids{list-style:none;margin:0;padding:0;padding-inline-start:calc(2 * var(--sp));display:grid;gap:var(--g)}",
    ".qx-fkids>li{position:relative;animation:qxRise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(150ms + var(--i,0) * 90ms)}",
    ".qx-fkids>li::before{content:'';position:absolute;top:50%;inset-inline-start:calc(-1 * var(--sp));width:var(--sp);border-top:2px solid var(--c)}",
    ".qx-fkids>li::after{content:'';position:absolute;inset-inline-start:calc(-1 * var(--sp));top:calc(-1 * var(--g) / 2 - 1px);bottom:calc(-1 * var(--g) / 2 - 1px);border-inline-start:2px solid var(--rule-strong,#C9D3CE)}",
    ".qx-fkids>li:first-child::after{top:50%}.qx-fkids>li:last-child::after{bottom:50%}.qx-fkids.qx-one>li::after{display:none}",
    ".qx-fk{position:relative;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-inline-start:5px solid var(--c);border-radius:16px;padding:10px 14px 11px;box-shadow:0 8px 22px -18px rgba(0,0,0,.5);transition:transform .18s ease,box-shadow .18s ease}",
    ".qx-fk::before{content:'';position:absolute;top:50%;inset-inline-start:-10px;width:10px;height:10px;margin-top:-5px;border-radius:50%;background:var(--c);box-shadow:0 0 0 3px var(--sheet,#fff)}",
    "@media (hover:hover){.qx-fk.qx-go:hover{transform:translateX(-2px);box-shadow:0 12px 26px -16px rgba(0,0,0,.5)}}",
    ".qx-fkh{display:flex;align-items:center;gap:8px}.qx-fkh b{color:var(--c);font-size:1rem}.qx-fplus{margin-inline-start:auto;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--c);color:#fff;font-size:.72rem;font-weight:800}",
    ".qx-fk p{margin:3px 0 0;font-size:.88rem;line-height:1.6;color:var(--muted,#4A5953)}.qx-fk .qx-who{margin-top:3px}",
    ".qx-fit{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.qx-fit i{font-style:normal;font-size:.78rem;background:var(--paper,#EEF3F0);border-radius:999px;padding:1px 9px}.qx-fit .qx-dl{font-size:.8rem}",
    ".qx-fk .qx-trap{margin-top:6px}",
    "@media (max-width:560px){.qx-fan{grid-template-columns:1fr;--sp:16px}.qx-froot{margin-bottom:var(--g)}.qx-froot::after{display:none}.qx-fkids{padding-inline-start:calc(2 * var(--sp))}.qx-fkids>li:first-child::after{top:calc(-1 * var(--g) - 1px)}}",
    "@media (prefers-reduced-motion:reduce){.qx-froot,.qx-fkids>li{animation:none}}",
    ".qx-leg{display:none}",
    "@media (max-width:560px){.qx-leg{display:grid;gap:8px;margin-top:4px}.qx-lg{border-inline-start:4px solid var(--c);padding:3px 10px}.qx-lg>b{display:block;color:var(--c);font-size:.92rem}.qx-lg>b small{color:var(--muted,#4A5953);font-weight:600;font-size:.76rem}.qx-lg .qx-dl{color:var(--c)}.qx-lgi{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}.qx-lgi i,.qx-lgi .qx-dl{font-style:normal;font-size:.8rem;background:var(--paper,#EEF3F0);border-radius:999px;padding:1px 9px}.qx-lgi em{font-style:normal;font-weight:600;color:var(--muted,#4A5953)}}",
    /* المستوى الأوسط في الشجرة */
    ".qx-mids{position:relative;margin-top:26px;width:100%;display:grid;grid-template-columns:var(--mt,repeat(var(--M),minmax(0,1fr)))}",
    ".qx-mids::before{content:'';position:absolute;top:-14px;left:calc(50% / var(--M));right:calc(50% / var(--M));border-top:2px solid var(--rule-strong,#C9D3CE)}",
    ".qx-mid{position:relative;display:flex;flex-direction:column;align-items:center;padding:0 6px;min-width:0}.qx-mid::before{content:'';position:absolute;top:-14px;left:50%;height:14px;border-left:2px solid var(--rule-strong,#C9D3CE)}",
    ".qx-midh{position:relative;z-index:1;background:var(--sheet,#fff);border:2px solid var(--ink,#172420);border-radius:999px;padding:6px 22px;text-align:center;animation:qxFade .4s ease both}.qx-midh b{display:block;font-size:.98rem}.qx-midh small{display:block;font-size:.8rem;color:var(--muted,#4A5953)}",
    ".qx-midk{position:relative;margin-top:28px;width:100%;display:grid;grid-template-columns:repeat(var(--k),minmax(0,1fr))}.qx-midk>.qx-br{margin:0 5px}",
    ".qx-midk::before{content:'';position:absolute;top:-14px;left:calc(50% / var(--k));right:calc(50% / var(--k));border-top:2px solid var(--rule-strong,#C9D3CE)}.qx-midk::after{content:'';position:absolute;top:-28px;left:50%;height:14px;border-left:2px solid var(--rule-strong,#C9D3CE)}",
    "@media (max-width:560px){.qx-mids{grid-template-columns:1fr;gap:16px;margin-top:14px}.qx-mids::before,.qx-mid::before,.qx-midk::before,.qx-midk::after{display:none}.qx-mid{align-items:stretch;padding:0}.qx-midk{grid-template-columns:1fr;gap:12px;margin-top:10px;padding-inline-start:14px;border-inline-start:2px solid var(--rule-strong,#C9D3CE)}.qx-midk>.qx-br{margin:0}}",
    /* السلّم */
    ".qx-steps{--rise:24px;display:grid;grid-template-columns:repeat(var(--N),minmax(0,1fr));column-gap:8px;align-items:end;padding:18px 2px 4px}",
    ".qx-stsw{grid-row:1;text-align:center;margin-bottom:16px}.qx-stsw span{display:inline-block;font-size:.8rem;font-weight:800;color:var(--hl-ink,#7A5200);background:var(--hl,#FFF4D6);border-radius:999px;padding:2px 12px}",
    ".qx-stsw i{position:relative;display:block;height:16px;margin:4px calc(50% / var(--s)) 0;border:2px dashed var(--hl-ink,#7A5200);border-bottom:0;border-radius:14px 14px 0 0}.qx-stsw i::before,.qx-stsw i::after{content:'';position:absolute;bottom:-9px;border:6px solid transparent;border-top-color:var(--hl-ink,#7A5200)}.qx-stsw i::before{left:-7px}.qx-stsw i::after{right:-7px}",
    ".qx-stcol{grid-row:2;display:flex;flex-direction:column;justify-content:flex-end;min-width:0;animation:qxRise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0) * 70ms)}",
    ".qx-stc{position:relative;background:var(--sheet,#fff);border:2px solid var(--c);border-bottom:0;border-radius:14px 14px 0 0;padding:20px 8px 10px;text-align:center;min-height:118px}.qx-stc>b{display:block;color:var(--c);font-size:1rem;line-height:1.3;overflow-wrap:anywhere}.qx-stc>small{display:block;font-size:.84rem;color:var(--muted,#4A5953)}.qx-stc .qx-fit{justify-content:center}",
    ".qx-stn{position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;background:var(--c);color:#fff;font-size:.82rem;font-weight:800;display:grid;place-items:center;box-shadow:0 0 0 3px var(--sheet,#fff)}",
    ".qx-riser{height:calc(var(--k) * var(--rise) + 10px);background:var(--c);border-radius:0 0 6px 6px}",
    ".qx-stbr{grid-row:3;position:relative;margin-top:10px;border-top:2px solid var(--rule-strong,#C9D3CE);text-align:center;padding-top:4px}.qx-stbr::before,.qx-stbr::after{content:'';position:absolute;top:-9px;height:8px;border-left:2px solid var(--rule-strong,#C9D3CE)}.qx-stbr::before{left:0}.qx-stbr::after{right:0}.qx-stbr span{font-size:.8rem;font-weight:800;color:var(--muted,#4A5953)}",
    ".qx-stu{grid-row:4;align-self:start;min-width:0;display:grid;gap:6px;align-content:start;padding-top:8px}.qx-sttag{display:block;font-size:.78rem;color:var(--muted,#4A5953);text-align:center;line-height:1.45}.qx-sttag.qx-hl{background:var(--hl,#FFF4D6);color:var(--hl-ink,#7A5200);border-radius:8px;padding:3px 6px;font-weight:800}.qx-stu .qx-trap{font-size:.78rem}",
    ".qx-stm{display:none}.qx-map:not([dir=ltr]) .qx-stlite .qx-stc{min-height:78px}.qx-map:not([dir=ltr]) .qx-stmany .qx-stc>b{font-size:.86rem}.qx-map:not([dir=ltr]) .qx-stmany .qx-stc{padding-inline:5px}",
    "@media (max-width:560px){.qx-steps{display:none}.qx-stm{display:grid;gap:8px}.qx-stmi{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:start;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-inline-start:5px solid var(--c);border-radius:14px;padding:10px 12px}.qx-stmi .qx-stn{position:static;transform:none;box-shadow:none}.qx-stmi b{color:var(--c)}.qx-stmi small{color:var(--muted,#4A5953);font-size:.84rem}.qx-stmi .qx-sttag{text-align:start;margin-top:6px}.qx-stmi .qx-trap{margin-top:6px}.qx-stmb{font-size:.8rem;font-weight:800;color:var(--muted,#4A5953);margin-top:6px}.qx-stms{justify-self:center;font-size:.8rem;font-weight:800;color:var(--hl-ink,#7A5200);background:var(--hl,#FFF4D6);border-radius:999px;padding:3px 12px}}",
    /* التداخل */
    ".qx-nest{display:grid;gap:10px;padding:4px 2px}.qx-nesth b{display:block;font-size:1.02rem}.qx-nesth small{color:var(--muted,#4A5953);font-size:.84rem}",
    ".qx-nb{position:relative;border:2px solid var(--c);border-radius:20px;padding:12px 14px 14px;background:color-mix(in srgb,var(--c) 6%,var(--sheet,#fff));animation:qxRise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0) * 110ms)}.qx-nb .qx-nb{margin-top:12px}",
    ".qx-nbh{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.qx-nbh b{color:var(--c);font-size:1.06rem}.qx-nbt{font-size:.78rem;font-weight:800;color:#fff;background:var(--c);border-radius:999px;padding:1px 10px}.qx-nbp{margin:4px 0 0;font-size:.9rem;color:var(--muted,#4A5953);line-height:1.6}.qx-nb .qx-trap{margin-top:8px}",
    ".qx-nax{display:flex;align-items:center;gap:8px;font-size:.8rem;font-weight:700;color:var(--muted,#4A5953)}.qx-nax i{flex:1;height:2px;background:var(--rule-strong,#C9D3CE);position:relative}.qx-nax i::after{content:'';position:absolute;right:-2px;top:-5px;border:6px solid transparent;border-left-color:var(--rule-strong,#C9D3CE)}",
    /* المسار وأسهم الرجوع */
    ".qx-flow{padding:4px 2px}.qx-flsvg{width:100%;max-width:760px;height:auto;display:block;margin:0 auto}.qx-flsvg text{font-family:inherit}",
    ".qx-fwd{stroke:var(--muted,#4A5953);stroke-width:2}.qx-mkf{fill:var(--muted,#4A5953)}.qx-bk{fill:none;stroke:var(--hl-ink,#7A5200);stroke-width:2;stroke-dasharray:6 5}.qx-mkb{fill:var(--hl-ink,#7A5200)}.qx-bkt{fill:var(--hl-ink,#7A5200)}",
    ".qx-fst{animation:qxFade .45s ease both;animation-delay:calc(var(--i,0) * 90ms)}.qx-flloop{display:none}",
    ".qx-flcs{max-width:760px;margin:8px auto 0;display:grid;grid-template-columns:repeat(var(--N),minmax(0,1fr));gap:8px}",
    ".qx-flc{min-width:0;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-top:4px solid var(--c);border-radius:14px;padding:8px 10px 10px}.qx-flm{display:block;color:var(--c);font-size:.95rem}.qx-flc p{margin:2px 0 0;font-size:.86rem;color:var(--muted,#4A5953);line-height:1.55}",
    ".qx-ret{display:inline-block;font-size:.78rem;font-weight:800;color:var(--hl-ink,#7A5200);background:var(--hl,#FFF4D6);border-radius:999px;padding:1px 9px;margin:6px 4px 0 0}",
    "@media (min-width:561px){.qx-flm,.qx-rets{display:none}}",
    "@media (max-width:560px){.qx-flsvg{display:none}.qx-flloop{display:block;font-size:.86rem;font-weight:800;color:var(--hl-ink,#7A5200);background:var(--hl,#FFF4D6);border-radius:12px;padding:6px 10px;margin-bottom:10px}.qx-flcs{grid-template-columns:1fr;gap:20px}.qx-flc{position:relative;border-top-width:1px;border-inline-start:5px solid var(--c)}.qx-flc:not(:last-child)::after{content:'↓';position:absolute;left:50%;bottom:-20px;transform:translateX(-50%);color:var(--muted,#4A5953);line-height:20px}.qx-flm small{color:var(--muted,#4A5953);font-weight:600;font-size:.84rem}}",
    /* الجدول بمعيارين */
    ".qx-grid{padding:4px 2px}.qx-gtitle{margin-bottom:8px}.qx-gtitle b{display:block;font-size:1.02rem}.qx-gtitle small{color:var(--muted,#4A5953);font-size:.84rem}",
    ".qx-gd{display:grid;grid-template-columns:minmax(92px,132px) repeat(var(--nc),minmax(0,1fr));gap:6px}.qx-gc{min-width:0;border-radius:12px;padding:8px 10px}",
    ".qx-gcorner{display:grid;gap:3px;align-content:end;font-size:.8rem;font-weight:700;color:var(--muted,#4A5953);padding:6px 4px}.qx-gcorner small{font-weight:600;font-size:inherit}.qx-gcorner span{overflow-wrap:anywhere}",
    ".qx-gch{background:color-mix(in srgb,var(--c) 12%,var(--sheet,#fff));border-bottom:3px solid var(--c);text-align:center}.qx-gch b{display:block;color:var(--c);font-size:.92rem;line-height:1.3}.qx-gch small,.qx-grh small{display:block;font-size:.78rem;color:var(--muted,#4A5953)}",
    ".qx-grh{background:var(--paper,#EEF3F0);display:flex;flex-direction:column;justify-content:center}.qx-grh b{font-size:.9rem;line-height:1.3}",
    ".qx-gcard{background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-top:4px solid var(--c);animation:qxRise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0) * 80ms)}.qx-gcard>b{display:block;color:var(--c);font-size:1rem}.qx-gcard>b.qx-ipaf{font-size:1.25rem;letter-spacing:.02em}.qx-gcard>small{display:block;color:var(--muted,#4A5953);font-size:.84rem}.qx-gcard .qx-trap{margin-top:6px}",
    ".qx-gex{margin:6px 0 0;font-size:.86rem;line-height:1.6;background:var(--paper,#EEF3F0);border-radius:10px;padding:6px 8px;text-align:start}.qx-gex strong{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}.qx-gex em{font-style:normal;color:var(--c);font-weight:700}",
    ".qx-gx{border:1px dashed var(--rule,#D9E1DD)}",
    ".qx-ipa .qx-gs{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);text-align:center;padding:6px 3px}.qx-gs>span{display:flex;flex-direction:column;align-items:center;min-width:0}",
    ".qx-gs b,.qx-ipaf{font-size:1.18rem;line-height:1.25;font-family:'Gentium Plus','Charis SIL','Doulos SIL','Lucida Grande','Segoe UI',system-ui,sans-serif}.qx-ipaf{font-size:1.05rem;color:var(--accent,#1F6B4C)}.qx-gkeys{margin-top:8px}.qx-gkeys i{font-size:.84rem}.qx-vl b{color:var(--ink,#172420);font-weight:600}.qx-vd b{color:var(--accent,#1F6B4C);font-weight:800}.qx-gs small{font-size:.78rem;color:var(--muted,#4A5953)}",
    ".qx-gleg{margin:8px 0 0;font-size:.84rem;color:var(--muted,#4A5953)}.qx-gleg strong{color:var(--accent,#1F6B4C)}.qx-glar{display:block}.qx-grid>.qx-trap{margin-top:8px}.qx-gm{display:none}",
    "@media (max-width:560px){.qx-gw{display:none}.qx-gm{display:block}.qx-gd{grid-template-columns:minmax(64px,92px) repeat(var(--nc),minmax(0,1fr));gap:4px}.qx-gch b,.qx-grh b{overflow-wrap:anywhere}.qx-ipa .qx-gs b{font-size:1rem}.qx-gc{padding:6px 5px;border-radius:9px}.qx-gch b{font-size:.8rem}.qx-grh b{font-size:.82rem}.qx-gs b{font-size:1.08rem}.qx-gcorner{font-size:.76rem}}",
    /* الوضع الليلي: النص الملوّن بلون الفرع يُفتَّح حتى يُقرأ على الخلفية الداكنة (الزيتي والأزرق الغامق كانا يختفيان) */
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) :is(.qx-stc>b,.qx-stmi b,.qx-nbh b,.qx-flm,.qx-gch b,.qx-gcard>b,.qx-gml-h b,.qx-fkh b,.qx-lg>b,.qx-gcard .qx-gex em){color:color-mix(in srgb,var(--c) 55%,#fff)}}",
    ":root[data-theme=dark] :is(.qx-stc>b,.qx-stmi b,.qx-nbh b,.qx-flm,.qx-gch b,.qx-gcard>b,.qx-gml-h b,.qx-fkh b,.qx-lg>b,.qx-gcard .qx-gex em){color:color-mix(in srgb,var(--c) 55%,#fff)}",
    /* أنواع الجمل: قطع الجملة + أسهم البناء */
    ".qx-quad{padding:4px 2px}.qx-qg{display:grid;grid-template-columns:minmax(0,1fr) 100px minmax(0,1fr);grid-template-rows:auto 64px auto;align-items:stretch}",
    ".qx-qc{min-width:0;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-inline-start:5px solid var(--c);border-radius:16px;padding:12px 14px;box-shadow:0 8px 22px -20px rgba(0,0,0,.5);animation:qxRise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0) * 110ms)}",
    ".qx-qh{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.qx-qh b{color:var(--c);font-size:1.08rem}.qx-qh small{color:var(--muted,#4A5953);font-size:.86rem}",
    ".qx-qf{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin:10px 0 8px}.qx-qf>i{font-style:normal;font-size:.84rem;font-weight:700;color:var(--muted,#4A5953)}",
    ".qx-qi,.qx-qd{display:inline-block;font-size:.76rem;font-weight:800;border-radius:8px;padding:3px 8px;line-height:1.2;white-space:nowrap}.qx-qi{background:var(--c);color:#fff;border:2px solid var(--c)}.qx-qd{color:var(--c);border:2px dashed var(--c);background:color-mix(in srgb,var(--c) 6%,transparent)}",
    ".qx-qex{margin:0;font-size:.9rem;line-height:1.75;color:var(--ink,#172420)}.qx-qex strong{font-weight:600;background:color-mix(in srgb,var(--c) 16%,transparent);box-shadow:inset 0 -2px 0 var(--c);border-radius:5px;padding:1px 3px}.qx-qex em{font-style:normal;color:var(--c);font-weight:600;border-bottom:2px dashed var(--c);padding-bottom:1px}.qx-qc .qx-trap{margin-top:8px}",
    ".qx-qa{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;color:var(--muted,#4A5953);text-align:center}.qx-qa span{font-size:.78rem;font-weight:800;line-height:1.25}.qx-qa small{font-size:.78rem}",
    ".qx-qah i{position:relative;display:block;width:76%;height:2px;background:var(--rule-strong,#C9D3CE);margin:4px 0}.qx-qah i::after{content:'';position:absolute;right:-2px;top:-5px;border:6px solid transparent;border-left-color:var(--rule-strong,#C9D3CE)}",
    ".qx-qav{flex-direction:row;gap:10px}.qx-qav i{position:relative;display:block;width:2px;height:44px;background:var(--rule-strong,#C9D3CE)}.qx-qav i::after{content:'';position:absolute;bottom:-2px;left:-5px;border:6px solid transparent;border-top-color:var(--rule-strong,#C9D3CE)}",
    ".qx-qleg{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:12px;font-size:.84rem;color:var(--muted,#4A5953)}.qx-qleg .qx-qi,.qx-qleg .qx-qd{font-size:.76rem;padding:2px 8px}",
    "@media (max-width:560px){.qx-qg{grid-template-columns:1fr;grid-template-rows:none;gap:12px}.qx-qa,.qx-qg>span{display:none}.qx-qc{padding:12px 10px}.qx-qf{gap:4px}.qx-qf .qx-qi,.qx-qf .qx-qd{font-size:.75rem;padding:2px 5px;border-width:1.5px}.qx-qf>i{font-size:.8rem}}",
    "@media (prefers-reduced-motion:reduce){.qx-qc{animation:none}}",
    /* الهرم (مخروط ديل) */
    ".qx-pyr{display:grid;grid-template-columns:62px minmax(0,1.1fr) minmax(0,1fr);column-gap:12px;row-gap:5px;align-items:center;margin-top:6px}",
    ".qx-pyb{grid-column:2;display:flex;flex-direction:column;align-items:center;min-width:0}.qx-pyn{grid-column:3;display:grid;gap:4px;align-content:center;min-width:0}.qx-pynm{display:none}",
    ".qx-pyt{width:max(var(--w),112px);min-height:42px;display:flex;align-items:center;justify-content:center;text-align:center;padding:5px 12px;background:var(--c);clip-path:polygon(5% 0,95% 0,100% 100%,0 100%);animation:qxFade .4s ease both;animation-delay:calc(var(--i,0) * 70ms)}.qx-pyt b{color:#fff;font-size:.9rem;line-height:1.3}",
    ".qx-pytag{font-size:.82rem;color:var(--muted,#4A5953);line-height:1.5}.qx-pytag.qx-hl{background:var(--hl,#FFF4D6);color:var(--hl-ink,#7A5200);border-radius:8px;padding:2px 8px;font-weight:800;justify-self:start}.qx-pyn .qx-trap,.qx-pynm .qx-trap{font-size:.78rem}",
    ".qx-pybr{grid-column:1;align-self:stretch;display:flex;align-items:center;justify-content:center;border-inline-end:2px solid var(--rule-strong,#C9D3CE);padding-inline-end:6px}.qx-pybr span{font-size:.8rem;font-weight:800;color:var(--muted,#4A5953);text-align:center}",
    "@media (max-width:560px){.qx-pyr{grid-template-columns:52px minmax(0,1fr)}.qx-pyn{display:none}.qx-pynm{display:grid;gap:4px;justify-items:center;text-align:center;margin-top:4px}}",
    /* منحنيات الالتواء */
    ".qx-cvs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.qx-cv{min-width:0;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-top:4px solid var(--c);border-radius:14px;padding:10px 10px 12px}.qx-cv>b{display:block;color:var(--c);font-size:1rem;margin-bottom:4px}",
    ".qx-cvsvg{width:100%;height:auto;display:block}.qx-cvsvg text{font-family:inherit}.qx-cvo{display:inline-block;margin-top:6px;font-size:.82rem;font-weight:800;background:var(--hl,#FFF4D6);color:var(--hl-ink,#7A5200);border-radius:8px;padding:2px 8px}.qx-cv p{margin:6px 0 0;font-size:.86rem;line-height:1.6;color:var(--muted,#4A5953)}.qx-cv .qx-trap{margin-top:6px}",
    "@media (max-width:560px){.qx-cvs{grid-template-columns:1fr}}",
    /* رسم الأعمدة والقطاعات */
    ".qx-chs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.qx-chp{min-width:0;background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-radius:14px;padding:10px}.qx-chh{font-size:.9rem;font-weight:800;margin-bottom:6px}",
    ".qx-chsvg{width:100%;height:auto;display:block}.qx-chsvg text,.qx-pisvg text{font-family:inherit}.qx-pirow{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.qx-pisvg{width:170px;max-width:48%;height:auto;flex:none}",
    ".qx-pileg{list-style:none;margin:0;padding:0;display:grid;gap:6px;font-size:.84rem;min-width:0;flex:1}.qx-pileg li{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.qx-pileg i{width:12px;height:12px;border-radius:3px;background:var(--c);flex:none}",
    ".qx-chqa{margin:10px 0 0;padding-inline-start:18px;display:grid;gap:4px;font-size:.88rem;line-height:1.6}.qx-chqa b{color:var(--accent,#1F6B4C)}",
    "@media (max-width:560px){.qx-chs{grid-template-columns:1fr}.qx-pisvg{max-width:56%}}",
    /* الجدول: rh يبرز رؤوس الصفوف */
    ".qx-grhs .qx-grh{background:var(--accent,#1F6B4C)}.qx-grhs .qx-grh b{color:var(--sheet,#fff);font-size:.95rem}.qx-grhs .qx-grh small{color:var(--sheet,#fff);opacity:.85}",
    "@media (prefers-reduced-motion:reduce){.qx-pyt{animation:none}}",
    /* التربوي (من اليمين لليسار): رأس السهم الأفقي على اليسار */
    ".qx-map:not([dir=ltr]) :is(.qx-nax,.qx-qah) i::after{right:auto;left:-2px;border-left-color:transparent;border-right-color:var(--rule-strong,#C9D3CE)}",
    /* التربوي: بطاقات المسار بطول نصها (لا صناديق فارغة طويلة تحت المحطات) */
    ".qx-map:not([dir=ltr]) .qx-flcs{align-items:start}",
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) :is(.qx-qh b,.qx-qd,.qx-qex em){color:color-mix(in srgb,var(--c) 55%,#fff);border-color:color-mix(in srgb,var(--c) 55%,#fff)}}",
    ":root[data-theme=dark] :is(.qx-qh b,.qx-qd,.qx-qex em){color:color-mix(in srgb,var(--c) 55%,#fff);border-color:color-mix(in srgb,var(--c) 55%,#fff)}",
    ".qx-gml{display:none}.qx-gax{display:none}",
    "@media (max-width:560px){.qx-gax{display:block;margin:0 0 6px;font-size:.84rem;font-weight:700;color:var(--muted,#4A5953)}.qx-gcorner>span{display:none}.qx-gd:not(.qx-ipa){grid-template-columns:minmax(44px,58px) repeat(var(--nc),minmax(0,1fr))}}",
    /* خرائط الإنجليزي (LTR) على الجوال: خط الوصل يتجه لخط الشجرة على اليسار لا لليمين */
    "@media (max-width:560px){.qx-map[dir=ltr] .qx-br::before{right:auto;left:-18px}}",
    "@media (max-width:560px){.qx-gml{display:grid;gap:8px}.qx-gml-c{background:var(--sheet,#fff);border:1px solid var(--rule,#D9E1DD);border-inline-start:5px solid var(--c);border-radius:14px;padding:8px 12px}.qx-gml-h b{color:var(--c);font-size:.95rem}.qx-gml-h small{color:var(--muted,#4A5953);font-size:.84rem}.qx-gml-r{display:grid;grid-template-columns:64px 1fr;gap:8px;align-items:center;padding:4px 0;border-top:1px dashed var(--rule,#E1E7E4)}.qx-gml-r .qx-gs{display:grid;grid-template-columns:1fr 1fr;text-align:center;border:0;padding:0;background:none}.qx-gml-r small{font-size:.84rem;color:var(--muted,#4A5953)}.qx-gml-r small b{color:var(--ink,#172420);font-weight:700}}",
    "@media (prefers-reduced-motion:reduce){.qx-stcol,.qx-nb,.qx-fst,.qx-gcard,.qx-midh{animation:none}}",
    ".qx-gmv b{display:block;color:var(--c);font-size:.95rem;line-height:1.4}.qx-gmv small{display:block;margin-top:2px}",
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .qx-gmv b{color:color-mix(in srgb,var(--c) 55%,#fff)}}:root[data-theme=dark] .qx-gmv b{color:color-mix(in srgb,var(--c) 55%,#fff)}",
    ".qx-map[dir=ltr] .qx-hd b,.qx-map[dir=ltr] .qx-th b{text-align:left}",
    ".qx-muted{color:var(--muted,#4A5953)}html.qx-lock,html.qx-lock body{overflow:hidden}",
    "@media (prefers-reduced-motion:reduce){#qx-drawer .qx-pane,#qx-drawer .qx-dim{transition:none}}"
  ].join("\n");
  function addCss() { if (document.getElementById("qx-css")) return; var st = document.createElement("style"); st.id = "qx-css"; st.textContent = css; (document.head || document.documentElement).appendChild(st); }
  addCss();
  // إلحاق إثراء بقسم موجود: QX.enrich("L15", "Behaviorism", {intro, map, ex}) — يطابق بداية عنوان القسم (أو رقمه)
  function enrich(id, h, add) {
    var l = (window.LESSONS || []).filter(function (x) { return x.id === id; })[0]; if (!l) return;
    if (h === null) { Object.assign(l, add); return; }
    var s = typeof h === "number" ? (l.sec || [])[h] : (l.sec || []).filter(function (x) { return String(isPair(x.h) ? x.h[0] : x.h).indexOf(h) === 0; })[0];
    if (s) Object.assign(s, add);
  }
  function deepIndex() {
    var idx = {}, D = window.DEEP || {};
    var nk = function (x) { return String(x).toLowerCase().split(/[—:(]/)[0].replace(/[^a-z\u0600-\u06ff]/g, ""); };
    Object.keys(D).forEach(function (k) { var t = D[k].t; [].concat(t).forEach(function (x) { if (x) idx[nk(x)] = k; }); (D[k].aka || []).forEach(function (x) { idx[nk(x)] = k; }); });
    idx.__nk = nk;
    return idx;
  }
  function review(l) {
    if (!l || !l.sec || l.sec.length < 2) return "";
    var idx = deepIndex(), PALN = PAL.length;
    var br = l.sec.map(function (s, i) {
      var h = isPair(s.h) ? s.h : [s.h, ""], seen = {}, items = [];
      if (window.QX_LTR) (s.t || []).forEach(function (t) { var w = String(t[0]).replace(/[\u2066-\u2069]/g, ""); if (items.length < 4 && w.length < 40) items.push(w); });
      else (s.pts || []).forEach(function (p) {
        var str = String(isPair(p) ? p[0] : p).replace(/\[\[([^|\]]+)\|[\w.-]+\]\]/g, "$1"); str.replace(/\*\*(.+?)\*\*/g, function (_, w) { var k = w.toLowerCase(); if (!seen[k] && items.length < 4 && w.length < 48) { seen[k] = 1; items.push(w); } return _; });
      });
      if (!items.length && s.t) s.t.slice(0, 3).forEach(function (t) { items.push(t[0]); });
      return { h: h, items: items, c: PAL[i % PALN] };
    }).filter(function (b) { return b.items.length; });
    if (br.length < 2) return "";
    var lat = /[A-Za-z]/.test(br[0].h[0]);
    var title = isPair(l.goal) || l.en ? (l.en || "") : "";
    return '<details class="qx-rev"><summary><span class="qx-badge">خريطة المراجعة</span> مراجعة الدرس كاملاً في نظرة واحدة</summary><div class="qx-tree"' + (window.QX_LTR ? ' dir="ltr"' : "") + ">" +
      '<div class="qx-root">' + esc(l.ar || "") + (l.en ? '<small class="qx-lat" dir="ltr">' + esc(l.en) + "</small>" : "") + "</div>" +
      rows(br.map(function (b, i) {
        return '<div class="qx-br" style="--c:' + b.c + ";--i:" + i + '"><div class="qx-bh"' + (lat ? ' dir="ltr"' : "") + ">" + esc(b.h[0]) + (b.h[1] ? "<small>" + esc(b.h[1]) + "</small>" : "") + '</div><ul>' +
          b.items.map(function (w) { var k = idx[idx.__nk(w)]; return "<li" + (lat ? ' dir="ltr"' : "") + ">" + (k ? '<button type="button" class="qx-dl" data-deep="' + k + '">' + esc(w) + "</button>" : esc(w)) + "</li>"; }).join("") + "</ul></div>";
      })) + "</div></details>";
  }
  // ---------- فقاعة الدروس (2026-10-28، طلب يوسف) ----------
  // الجهة: في الإنجليزي يساراً، وفي التربوي (o.rtl) يميناً. كبيرة عند فتح الدرس إذا اتسعت الشاشة، وتصغر مع أول تمرير
  // أو لمسة على الدرس لفقاعة «الدرس 3 من 16»، وتنفتح بضغطة. التطبيق يستدعي QX.dock({...}) في كل عرض للدرس، وQX.undock() خارجه
  // (فقاعة «فخاخ الاختبار» الحمراء حُذفت في اليوم نفسه بطلب يوسف: مشتتة، والفخاخ موجودة في صفحة الدرس)
  var DK = null;
  var IC_LIST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>';
  var IC_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
  var dockCss = [
    ".qx-dk{position:fixed;z-index:35;top:118px}.qx-dk[hidden]{display:none}.qx-dkL{left:16px}.qx-dkR{right:16px}",
    ".qx-dkp{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--rule,#d8e0db);background:var(--sheet,#fff);color:var(--ink,#14201b);font:inherit;font-weight:700;font-size:.92rem;box-shadow:0 8px 24px rgba(0,0,0,.13);cursor:pointer;transition:opacity .18s ease,transform .22s ease;-webkit-tap-highlight-color:transparent}",
    ".qx-dkp:active{transform:scale(.96)}.qx-dkp svg{width:18px;height:18px;flex:none}",
    ".qx-dkw{position:absolute;top:0;width:var(--dkw,300px);max-height:calc(100vh - 150px);display:flex;flex-direction:column;background:var(--sheet,#fff);color:var(--ink,#14201b);border:1px solid var(--rule,#d8e0db);border-radius:20px;box-shadow:0 22px 60px rgba(0,0,0,.2);overflow:hidden;opacity:0;visibility:hidden;transform:scale(.3);transition:transform .36s cubic-bezier(.2,.9,.25,1.05),opacity .2s ease,visibility 0s linear .36s}",
    ".qx-dkL .qx-dkw{left:0;transform-origin:top left}.qx-dkR .qx-dkw{right:0;transform-origin:top right}",
    ".qx-dk[data-state=open] .qx-dkw{opacity:1;visibility:visible;transform:none;transition:transform .36s cubic-bezier(.2,.9,.25,1.05),opacity .2s ease,visibility 0s}",
    ".qx-dk[data-state=open] .qx-dkp{opacity:0;transform:scale(.85);pointer-events:none}",
    ".qx-dkh{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 10px 16px;border-bottom:1px solid var(--rule,#d8e0db)}.qx-dkh b{font-size:1rem}",
    ".qx-dkx{flex:none;width:32px;height:32px;border-radius:50%;border:0;background:var(--paper,#f3f6f2);color:var(--ink,#14201b);font:inherit;font-size:1.25rem;line-height:1;cursor:pointer}",
    ".qx-dkb{overflow:auto;overscroll-behavior:contain;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;padding:8px}",
    ".qx-dkl button{display:flex;gap:10px;align-items:center;width:100%;text-align:start;border:0;background:none;padding:8px 10px;border-radius:12px;color:inherit;font:inherit;cursor:pointer;transition:background .15s}",
    "@media (hover:hover){.qx-dkl button:hover{background:var(--paper,#f3f6f2)}}.qx-dkl button.on{background:color-mix(in srgb,var(--c) 15%,transparent)}",
    ".qx-dki{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:.8rem;font-weight:800;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c)}.qx-dkl button.on .qx-dki{background:var(--c);color:#fff}",
    ".qx-dkt{display:flex;flex-direction:column;min-width:0;flex:1}.qx-dkt b{font-size:.88rem;font-weight:700;line-height:1.35}.qx-dkt small{font-size:.74rem;color:var(--muted,#4c5a54);line-height:1.35}",
    ".qx-dklk{flex:none;width:16px;height:16px;color:var(--muted,#4c5a54)}.qx-dklk svg{width:16px;height:16px}",
    // بجانب الدرس إذا اتسع الهامش للفقاعة، وإلا في الزاوية السفلية (الآيباد والجوال)
    ".qx-dkbot .qx-dk{top:auto;bottom:calc(20px + env(safe-area-inset-bottom,0px))}.qx-dkbot .qx-dkw{top:auto;bottom:0;width:min(88vw,360px)!important;max-height:62vh}.qx-dkbot .qx-dkL .qx-dkw{transform-origin:bottom left}.qx-dkbot .qx-dkR .qx-dkw{transform-origin:bottom right}",
    "@media (max-width:759px){.qx-dk,.qx-dkbot .qx-dk{bottom:calc(78px + env(safe-area-inset-bottom,0px))}.qx-dkL{left:12px}.qx-dkR{right:12px}.qx-dkp{height:42px;padding:0 13px;font-size:.86rem}}",
    "@media (max-width:379px){.qx-hasdock .backq{bottom:calc(132px + env(safe-area-inset-bottom,0px))}}",
    // مسافة أسفل الصفحة حتى يرتفع آخر الدرس (الدرس التالي وزر الاختبار) فوق الفقاعة وزر العودة للاختبار
    // على #view لا #app: الصفحات العامة تلغي مسافة #app لأجل تذييل الموقع
    ".qx-hasdock.qx-dkbot #view{padding-bottom:72px}",
    "@media (max-width:759px){.qx-hasdock #view,.qx-hasdock.qx-dkbot #view{padding-bottom:112px}}",
    "@media (prefers-reduced-motion:reduce){.qx-dkw,.qx-dkp{transition:none!important}}",
    // فقاعة «الأسئلة»: شبكة أرقام، الحالي بلون النص، والمجاب صح أخضر وخطأ أحمر (في الاختبار المحاكي «مجاب» فقط بلا تصحيح)
    ".qx-dkh small{display:block;font-size:.74rem;font-weight:500;color:var(--muted,#4c5a54);margin-top:2px}",
    ".qx-dkg{display:grid;grid-template-columns:repeat(auto-fill,minmax(42px,1fr));gap:6px;padding:4px}",
    ".qx-dkg button{position:relative;height:40px;border-radius:10px;border:1px solid var(--rule,#d8e0db);background:var(--sheet,#fff);color:inherit;font:inherit;font-size:.84rem;font-weight:700;font-variant-numeric:tabular-nums;cursor:pointer;padding:0}",
    "@media (hover:hover){.qx-dkg button:hover{border-color:var(--ink,#14201b)}}",
    ".qx-dkg button.ok{border-color:var(--good,#1f7a4d);background:var(--good-soft,#e3f2ea)}.qx-dkg button.no{border-color:var(--bad,#b42318);background:var(--bad-soft,#fbe7e5)}.qx-dkg button.an{background:var(--paper,#f3f6f2);border-color:var(--muted,#4c5a54)}",
    ".qx-dkg button.on{background:var(--ink,#14201b);border-color:var(--ink,#14201b);color:var(--sheet,#fff)}",
    ".qx-dkg button.fl::after{content:'';position:absolute;top:4px;inset-inline-end:4px;width:6px;height:6px;border-radius:50%;background:#d97706}",
    // صف المعايير فوق الأرقام (يوسف 2026-10-28): «الكل» أو رقم معيار، فتظهر أسئلته فقط بأرقامها في الجلسة
    ".qx-dkf{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--rule,#d8e0db)}.qx-dkf[hidden]{display:none}",
    ".qx-dkf>span{font-size:.78rem;font-weight:700;color:var(--muted,#4c5a54);margin-inline-end:2px}",
    ".qx-dkf button{min-width:34px;height:32px;padding:0 10px;border-radius:999px;border:1px solid var(--rule,#d8e0db);background:var(--sheet,#fff);color:inherit;font:inherit;font-size:.82rem;font-weight:700;font-variant-numeric:tabular-nums;cursor:pointer}",
    ".qx-dkf button[aria-pressed=true]{background:var(--ink,#14201b);border-color:var(--ink,#14201b);color:var(--sheet,#fff)}"
  ].join("\n");
  var room = function () { return (window.innerWidth - 880) / 2; };
  // ---------- السحب والإخفاء كسهم (2026-10-31، طلب يوسف: «حتى لا تشتت القارئ») ----------
  // فقاعة الدروس وفقاعة الأسئلة وزر «العودة للاختبار»: تُسحب بالإصبع أو الفأرة لأي مكان، وإذا سُحبت خارج طرف الشاشة صارت سهماً صغيراً
  // ملتصقاً بالطرف، وضغطة السهم ترجعها. المكان يُحفظ في جهاز الزائر لكل صفحة (localStorage)، ولا يتغير شيء لمن لم يسحب
  var IC_TAB_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  var IC_TAB_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var flCss = [
    ".qx-fl{touch-action:none;-webkit-user-select:none;user-select:none}",
    ".qx-moved{right:auto!important;bottom:auto!important;transform:none!important;animation:none!important}",
    ".qx-dragging,.qx-dragging .qx-dkp{transition:none!important;cursor:grabbing}.qx-dragging .qx-dkp,.backq.qx-dragging{box-shadow:0 14px 34px rgba(0,0,0,.24)!important}",
    ".qx-willtuck{opacity:.4}",
    ".qx-tucked{display:none!important}",
    ".qx-tab{position:fixed;z-index:36;width:24px;height:56px;padding:0;display:grid;place-items:center;border:1px solid var(--rule,#d8e0db);background:var(--sheet,#fff);color:var(--ink,#14201b);box-shadow:0 6px 18px rgba(0,0,0,.14);cursor:pointer;-webkit-tap-highlight-color:transparent}",
    ".qx-tab[hidden]{display:none}.qx-tabL{left:0;border-left:0;border-radius:0 14px 14px 0}.qx-tabR{right:0;border-right:0;border-radius:14px 0 0 14px}",
    ".qx-tab svg{width:16px;height:16px}.qx-tab::before{content:'';position:absolute;inset:-10px -16px}"
  ].join("\n");
  function floater(el, handle, key, label) {
    if (!document.getElementById("qx-fl-css")) { var st = document.createElement("style"); st.id = "qx-fl-css"; st.textContent = flCss; (document.head || document.documentElement).appendChild(st); }
    var SK = "qx.fl." + location.pathname + "." + key, S = null, P = null;
    try { S = JSON.parse(localStorage.getItem(SK) || "null"); } catch (e) {}
    var tab = document.createElement("button"); tab.type = "button"; tab.className = "qx-tab"; tab.hidden = true;
    tab.setAttribute("aria-label", "إظهار " + label); tab.title = "إظهار " + label; document.body.appendChild(tab);
    handle.classList.add("qx-fl");
    var F = { el: el, tab: tab };
    function save() { try { if (S) localStorage.setItem(SK, JSON.stringify(S)); else localStorage.removeItem(SK); } catch (e) {} }
    function cy(y, h) { return Math.max(8, Math.min(window.innerHeight - h - 8, y)); }
    F.tucked = function () { return !!(S && S.t); };
    F.apply = function () {
      var tu = F.tucked(); el.classList.toggle("qx-tucked", tu); tab.hidden = el.hidden || !tu;
      if (tu) { tab.className = "qx-tab qx-tab" + S.s; tab.innerHTML = S.s === "L" ? IC_TAB_R : IC_TAB_L; tab.style.top = Math.max(8, Math.min(window.innerHeight - 64, S.y)) + "px"; }
      else if (S && !el.hidden && el.offsetWidth) { var w = el.offsetWidth, x = S.s === "L" ? S.x : window.innerWidth - S.x - w;
        el.classList.add("qx-moved"); el.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, x)) + "px"; el.style.top = cy(S.y, el.offsetHeight) + "px"; }
      if (F.after) F.after();
    };
    handle.addEventListener("pointerdown", function (e) { if (e.button > 0) return; var r = el.getBoundingClientRect();
      P = { id: e.pointerId, x: e.clientX, y: e.clientY, l: r.left, t: r.top, w: r.width, h: r.height, cl: r.left, ct: r.top, on: false }; });
    window.addEventListener("pointermove", function (e) {
      if (!P || e.pointerId !== P.id) return; var dx = e.clientX - P.x, dy = e.clientY - P.y;
      if (!P.on) { if (Math.abs(dx) + Math.abs(dy) < 8) return; P.on = true; el.classList.add("qx-dragging", "qx-moved"); try { handle.setPointerCapture(P.id); } catch (er) {} if (F.drag) F.drag(); }
      P.cl = Math.max(-P.w * 0.7, Math.min(window.innerWidth - P.w * 0.3, P.l + dx)); P.ct = cy(P.t + dy, P.h);
      el.style.left = P.cl + "px"; el.style.top = P.ct + "px";
      el.classList.toggle("qx-willtuck", P.cl < -P.w * 0.25 || P.cl + P.w > window.innerWidth + P.w * 0.25); e.preventDefault();
    }, { passive: false });
    function end(e) {
      if (!P || e.pointerId !== P.id) return; var p = P; P = null; if (!p.on) return;
      el.classList.remove("qx-dragging", "qx-willtuck");
      // الضغطة التي تنهي السحب لا تُحسب ضغطاً على الزر
      var stop = function (ev) { ev.stopPropagation(); ev.preventDefault(); window.removeEventListener("click", stop, true); };
      window.addEventListener("click", stop, true); setTimeout(function () { window.removeEventListener("click", stop, true); }, 400);
      var W = window.innerWidth;
      if (p.cl < -p.w * 0.25 || p.cl + p.w > W + p.w * 0.25) S = { t: 1, s: p.cl < 0 ? "L" : "R", y: p.ct + p.h / 2 - 28 };
      else { var l = Math.max(8, Math.min(W - p.w - 8, p.cl)), sd = l + p.w / 2 < W / 2 ? "L" : "R"; S = { s: sd, x: sd === "L" ? l : W - l - p.w, y: p.ct }; }
      save(); F.apply();
    }
    window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
    tab.addEventListener("click", function () { S = { s: S ? S.s : "R", x: 12, y: S ? S.y : 120 }; save(); F.apply(); });
    new MutationObserver(F.apply).observe(el, { attributes: true, attributeFilter: ["hidden"] });
    window.addEventListener("resize", F.apply, { passive: true });
    F.apply();
    return F;
  }
  // الفقاعة بعد سحبها: جهة اللوحة وارتفاعها حسب مكانها، حتى تنفتح كاملة داخل الشاشة
  function orient(D, rtl) {
    var a = D.L, w = a.querySelector(".qx-dkw");
    if (!a.classList.contains("qx-moved")) { a.classList.toggle("qx-dkL", !rtl); a.classList.toggle("qx-dkR", !!rtl); w.style.left = w.style.right = w.style.top = w.style.bottom = w.style.maxHeight = ""; return; }
    var r = a.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight, L = r.left + r.width / 2 < W / 2, up = r.top + r.height / 2 > H / 2;
    a.classList.toggle("qx-dkL", L); a.classList.toggle("qx-dkR", !L);
    w.style.left = w.style.right = ""; w.style.top = up ? "auto" : "0"; w.style.bottom = up ? "0" : "auto";
    w.style.maxHeight = Math.max(200, Math.min(H * 0.8, up ? r.bottom - 12 : H - r.top - 12)) + "px";
    var pw = w.offsetWidth;
    if (L && r.left + pw > W - 8) w.style.left = (W - 8 - pw - r.left) + "px";
    if (!L && r.right - pw < 8) w.style.right = (r.right - pw - 8) + "px";
  }
  var QK = null;
  // ينشئ فقاعة واحدة (aside) بشكل وسلوك فقاعة الدروس؛ cls يميّز فقاعة الأسئلة (qx-dkq) حتى يجدها التطبيق
  function mkDock(rtl, label, cls) {
    if (!document.getElementById("qx-dock-css")) { var st = document.createElement("style"); st.id = "qx-dock-css"; st.textContent = dockCss; (document.head || document.documentElement).appendChild(st); }
    var a = document.createElement("aside"); a.className = "qx-dk qx-dk" + (rtl ? "R" : "L") + (cls ? " " + cls : ""); a.dataset.state = "mini"; a.hidden = true;
    a.innerHTML = '<button type="button" class="qx-dkp" aria-expanded="false">' + IC_LIST + '<span class="qx-dkpt">' + label + '</span></button><div class="qx-dkw" role="dialog" aria-label="' + label + '"><div class="qx-dkh"><b class="qx-dkpt">' + label + '</b><button type="button" class="qx-dkx" aria-label="تصغير">×</button></div><div class="qx-dkb"></div></div>';
    document.body.appendChild(a);
    var D = { L: a, id: null, key: "", y0: 0, t: 0 };
    D.cur = function () { var b = a.querySelector(".qx-dkb"), c = b.querySelector(".on"); if (c) { b.style.scrollBehavior = "auto"; b.scrollTop = c.offsetTop - b.clientHeight / 3; b.style.scrollBehavior = ""; } };
    D.set = function (s) { if (s === "open" && D.F) { if (D.F.tucked()) return; orient(D, rtl); } a.dataset.state = s; a.querySelector(".qx-dkp").setAttribute("aria-expanded", String(s === "open")); D.t = Date.now();
      requestAnimationFrame(function () { D.y0 = window.scrollY; if (s === "open") D.cur(); }); };
    a.querySelector(".qx-dkp").addEventListener("click", function () { D.set("open"); });
    a.querySelector(".qx-dkx").addEventListener("click", function () { D.set("mini"); });
    // تمرير الصفحة أو لمس الدرس يصغّر الفقاعة؛ وEsc يغلقها
    window.addEventListener("scroll", function () { if (Date.now() - D.t < 450 || Math.abs(window.scrollY - D.y0) < 60) return; if (a.dataset.state === "open") D.set("mini"); }, { passive: true });
    document.addEventListener("pointerdown", function (e) { if (a.dataset.state === "open" && !a.contains(e.target)) D.set("mini"); }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && a.dataset.state === "open") D.set("mini"); });
    window.addEventListener("resize", function () { document.documentElement.classList.toggle("qx-dkbot", room() < 190); a.style.setProperty("--dkw", Math.max(240, Math.min(320, room() - 28)) + "px"); }, { passive: true });
    window.dispatchEvent(new Event("resize"));
    D.F = floater(a, a.querySelector(".qx-dkp"), cls ? "qdock" : "dock", cls ? "فقاعة الأسئلة" : "فقاعة الدروس");
    D.F.after = function () { orient(D, rtl); }; D.F.drag = function () { if (a.dataset.state === "open") D.set("mini"); };
    return D;
  }
  function dockEl(rtl) { return DK || (DK = mkDock(rtl, "الدرس")); }
  // مسافة أسفل الصفحة ما دامت أي فقاعة ظاهرة
  function hasDock() { document.documentElement.classList.toggle("qx-hasdock", !!((DK && !DK.L.hidden) || (QK && !QK.L.hidden))); }
  // o = { id, ltr, rtl, lessons: [{ id, n, t, s, c, done, lock }] }
  function dock(o) {
    var d = dockEl(!!o.rtl), cur = o.lessons.filter(function (x) { return x.id === o.id; })[0];
    var key = o.id + "|" + o.lessons.map(function (x) { return (x.done ? 1 : 0) + (x.lock ? 2 : 0); }).join("");
    d.L.hidden = false; hasDock();
    if (d.key === key) return; d.key = key;
    d.L.querySelector(".qx-dkb").innerHTML = '<nav class="qx-dkl">' + o.lessons.map(function (x) {
      return '<button type="button" data-lesson="' + x.id + '"' + (x.id === o.id ? ' class="on" aria-current="page"' : "") + ' style="--c:' + x.c + '"><span class="qx-dki">' + (x.done ? "✓" : esc(x.n)) + '</span><span class="qx-dkt"><b' + (o.ltr ? ' dir="ltr" style="text-align:right"' : "") + ">" + esc(x.t) + "</b>" + (x.s ? "<small>" + esc(x.s) + "</small>" : "") + "</span>" + (x.lock ? '<span class="qx-dklk" aria-label="مقفل">' + IC_LOCK + "</span>" : "") + "</button>"; }).join("") + "</nav>";
    // «الدرس 3 من 16» (يوسف 2026-10-28) بدل «الدروس 3/16»
    [].forEach.call(d.L.querySelectorAll(".qx-dkpt"), function (e) { e.textContent = "الدرس " + (cur ? cur.n + " " : "") + "من " + o.lessons.length; });
    if (d.id !== o.id) { d.id = o.id; d.set(room() >= 260 ? "open" : "mini"); }
  }
  function undock() { if (!DK || DK.L.hidden) return; DK.set("mini"); DK.L.hidden = true; DK.id = null; DK.key = ""; hasDock(); }
  // ---------- فقاعة «الأسئلة» (2026-10-28، طلب يوسف) ----------
  // في كل جلسة أسئلة: شبكة أرقام تنقلك لأي سؤال (data-jump يعالجه التطبيق)، بجهة فقاعة الدروس نفسها، وبنفس الفتح والتصغير.
  // o = { sid, rtl, i, exam, items: [{ g, s: "" | "ok" | "no" | "an", f }], groups: [{ k, t, a }] } — s: بلا إجابة · صح · خطأ · مجاب (المحاكي بلا تصحيح)،
  // f: معلَّم للمراجعة، g: مفتاح معيار السؤال؛ groups: معايير الجلسة مرتبة (k المفتاح، t رقمه على الزر، a «المعيار 1 · 59 سؤالاً»)
  function qdock(o) {
    var d = QK, n = o.items.length;
    if (!d) { d = QK = mkDock(!!o.rtl, "الأسئلة", "qx-dkq"); d.g = "";
      d.Row = document.createElement("div"); d.Row.className = "qx-dkf"; d.Row.setAttribute("role", "group"); d.Row.setAttribute("aria-label", "اختر المعيار");
      d.L.querySelector(".qx-dkh").insertAdjacentElement("afterend", d.Row);
      d.Row.addEventListener("click", function (e) { var b = e.target.closest("[data-qg]"); if (!b || b.dataset.qg === d.g) return; d.g = b.dataset.qg; d.key = ""; qdock(d.o);
        var c = d.L.querySelector(".qx-dkg .on"); if (c) d.cur(); else d.L.querySelector(".qx-dkb").scrollTop = 0; }); }
    if (d.id !== o.sid) d.g = "";
    var gs = o.groups || [], G = gs.filter(function (x) { return x.k === d.g; })[0]; if (!G) d.g = "";
    var key = o.sid + "|" + o.i + "|" + d.g + "|" + o.items.map(function (x) { return (x.s || "-") + (x.f ? "f" : ""); }).join(",");
    d.o = o; d.L.hidden = false; hasDock();
    if (d.key === key) return; d.key = key;
    var sel = o.items.map(function (x, i) { return [x, i]; }).filter(function (p) { return !d.g || p[0].g === d.g; });
    var done = sel.filter(function (p) { return p[0].s; }).length, ok = sel.filter(function (p) { return p[0].s === "ok"; }).length;
    d.L.querySelector(".qx-dkh b").innerHTML = "الأسئلة<small>" + (G ? esc(G.a.split(" · ")[0]) + ": " : "") + "أجبت " + done + " من " + sel.length + (o.exam ? "" : " · صح " + ok) + "</small>";
    d.Row.hidden = gs.length < 2;
    d.Row.innerHTML = "<span>المعيار</span>" + [{ k: "", t: "الكل", a: "كل المعايير" }].concat(gs).map(function (x) {
      return '<button type="button" data-qg="' + esc(x.k) + '" aria-pressed="' + (x.k === d.g) + '" aria-label="' + esc(x.a) + '">' + esc(x.t) + "</button>"; }).join("");
    d.L.querySelector(".qx-dkb").innerHTML = '<nav class="qx-dkg">' + sel.map(function (p) { var x = p[0], i = p[1];
      return '<button type="button" data-jump="' + i + '" class="' + (x.s || "") + (x.f ? " fl" : "") + (i === o.i ? " on" : "") + '"' + (i === o.i ? ' aria-current="step"' : "") + ' aria-label="سؤال ' + (i + 1) + '">' + (i + 1) + "</button>"; }).join("") + "</nav>";
    // جلسة جديدة: مفتوحة بجانب السؤال إذا اتسعت الشاشة · سؤال آخر: تصغر في الشاشة الضيقة، وتبقى مفتوحة على السؤال الحالي في الواسعة
    if (d.id !== o.sid) { d.id = o.sid; d.i = o.i; d.set(room() >= 260 ? "open" : "mini"); return; }
    // (الصعود لأعلى السؤال بعد الانتقال لا يُحسب تمريراً يصغّرها)
    if (d.i !== o.i) { d.i = o.i; if (room() < 260) d.set("mini"); else if (d.L.dataset.state === "open") { d.t = Date.now(); requestAnimationFrame(function () { d.y0 = window.scrollY; d.cur(); }); } }
  }
  function unqdock() { if (!QK || QK.L.hidden) return; QK.set("mini"); QK.L.hidden = true; QK.id = null; QK.key = ""; hasDock(); }
  function backqInit() { var b = document.getElementById("backq"); if (b && !b.dataset.fl) { b.dataset.fl = "1"; floater(b, b, "backq", "زر العودة للاختبار"); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", backqInit); else backqInit();
  function lessonMap(l) { return l && l.map ? '<div class="sheet qx-lmap">' + map(l.map) + "</div>" : ""; }
  window.QX = { review: review, enrich: enrich, lessonMap: lessonMap, withLinks: withLinks, links: links, sec: sec, after: after, map: map, open: open, close: close, dock: dock, undock: undock, qdock: qdock, unqdock: unqdock, floater: floater };
})();

/* حركة ناعمة خفيفة لموقعي التربوي والإنجليزي (2026-11-08، طلب يوسف «أنميشن خفيف لا يثقل الموقع ويجعله أنعم»).
   من بحث ops/reports/أنميشن-بحث-2026-11-07.md، البنود 1 و2 و5 و6. القواعد: transform وopacity فقط، حركة مستمرة واحدة (الموجة) وتتوقف خارج الشاشة،
   «تقليل الحركة» في الجهاز يوقف كل شيء، ولا شيء يُخفى إلا داخل @supports، ولا إزاحة تخطيط. يُلحق بآخر enrich.js فيصل للمجاني والمدفوع معاً. */
(function () {
  "use strict";
  // أدوات البناء تشغّل هذا الملف في بيئة بلا متصفح حقيقي: لا حركة إلا في متصفح فعلي
  if (typeof document === "undefined" || typeof document.querySelector !== "function" || typeof document.createElement !== "function" || typeof window.matchMedia !== "function" || typeof window.getComputedStyle !== "function" || window.__qxMotion) return; window.__qxMotion = 1;
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var ease = "cubic-bezier(.2,.8,.2,1)";
  var css = [
    /* 1) موجة خلفية هادئة خلف أعلى الصفحة: طبقتان تنجرفان أفقياً ببطء (34 و52 ثانية) بشفافية خفيفة */
    ".qx-wave{position:absolute;top:0;left:0;right:0;height:230px;overflow:hidden;z-index:-1;pointer-events:none;contain:strict}",
    ".qx-wave i{position:absolute;bottom:0;left:0;width:200%;height:100%;background-repeat:repeat-x;background-position:bottom left;background-size:50% 100%;will-change:transform;animation:qxWave 34s linear infinite}",
    ".qx-wave i+i{opacity:.65;animation-duration:52s;animation-direction:reverse;height:80%}",
    ".qx-wave.off i{animation-play-state:paused}",
    "@keyframes qxWave{to{transform:translateX(-50%)}}",
    /* 2) ظهور متتابع ناعم عند التمرير، فقط حيث يدعمه المتصفح (وإلا يظهر المحتوى كما هو) */
    "@supports (animation-timeline: view()){.sheet,.tile,.stat,.lsec{animation:qxRise linear both;animation-timeline:view();animation-range:entry 0% entry 38%}}",
    "@keyframes qxRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}",
    /* 2ب) البديل لمتصفح بلا animation-timeline (سفاري آيفون قبل iOS 26، قرار المدير 2026-11-08): مراقب تقاطع يضيف .qx-in.
       يُخفى بالشفافية فقط (الحركة transform فلا إزاحة تخطيط)، وما يظهر في الشاشة لحظة رسمه يبقى ظاهراً بلا حركة. */
    ".qx-io .sheet:not(.qx-in),.qx-io .tile:not(.qx-in),.qx-io .stat:not(.qx-in),.qx-io .lsec:not(.qx-in){opacity:0}",
    ".qx-io .qx-in.qx-go{animation:qxRise .45s " + ease + " both}",
    /* 5) تموّج دائري عند لمس خيار الإجابة */
    "button.opt{position:relative;overflow:hidden;isolation:isolate}",
    ".qx-rip{position:absolute;border-radius:50%;pointer-events:none;background:currentColor;opacity:.14;transform:scale(0);z-index:-1;animation:qxRip .52s " + ease + " forwards}",
    "@keyframes qxRip{to{transform:scale(1);opacity:0}}",
    /* لا حركة لمن طلب تقليلها */
    "@media (prefers-reduced-motion:reduce){.qx-wave i,.sheet,.tile,.stat,.lsec,.qx-rip{animation:none!important}.qx-rip{display:none}.qx-io .sheet,.qx-io .tile,.qx-io .stat,.qx-io .lsec{opacity:1!important}}"
  ].join("");
  var st = document.createElement("style"); st.id = "qx-motion"; st.textContent = css; (document.head || document.documentElement).appendChild(st);
  // 2ب) بديل الظهور عند التمرير: فقط إذا المتصفح لا يدعم animation-timeline، وبلا «تقليل الحركة»
  (function () {
    var sup = false; try { sup = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()")); } catch (e) {}
    if (sup || reduce || typeof IntersectionObserver !== "function" || typeof MutationObserver !== "function") return;
    var SEL = ".sheet,.tile,.stat,.lsec", seen = typeof WeakSet === "function" ? new WeakSet() : null;
    // يدخل حين تتجاوز حافته العليا 85% من ارتفاع الشاشة (أي دخل 15% منها)، بلا اعتماد على طول العنصر
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("qx-in", "qx-go"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -15% 0px", threshold: 0 });
    var scan = function (root) {
      var list = []; if (root.matches && root.matches(SEL)) list.push(root); if (root.querySelectorAll) list = list.concat([].slice.call(root.querySelectorAll(SEL)));
      var h = window.innerHeight || document.documentElement.clientHeight;
      list.forEach(function (el) { if (seen) { if (seen.has(el)) return; seen.add(el); } if (el.classList.contains("qx-in")) return;
        var r = el.getBoundingClientRect(); if (r.top < h * 0.85) el.classList.add("qx-in"); else io.observe(el); });   // الظاهر الآن: بلا إخفاء ولا حركة
    };
    var start = function () { if (!document.body) return; scan(document.body); document.documentElement.classList.add("qx-io");
      new MutationObserver(function (ms) { ms.forEach(function (m) { for (var i = 0; i < m.addedNodes.length; i++) if (m.addedNodes[i].nodeType === 1) scan(m.addedNodes[i]); }); }).observe(document.body, { childList: true, subtree: true });
      addEventListener("beforeprint", function () { [].forEach.call(document.querySelectorAll(SEL), function (el) { el.classList.add("qx-in"); }); }); };
    if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
  })();
  // لون الموجة من لون الموقع (يتبع النهاري والليلي)
  var wave = function () {
    if (reduce || document.querySelector(".qx-wave") || !document.body) return;
    var w = document.createElement("div"); w.className = "qx-wave"; w.setAttribute("aria-hidden", "true"); w.setAttribute("data-qx-anim", "");
    var svg = function (a, d) { return "url(\"data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" preserveAspectRatio="none"><path d="' + d + '" fill="' + a + '"/></svg>') + "\")"; };
    var col = (getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#1F6B4C").trim();
    var i1 = document.createElement("i"), i2 = document.createElement("i");
    i1.style.backgroundImage = svg(col, "M0 70 C150 30 300 110 450 70 S600 30 600 70 V120 H0Z"); i1.style.opacity = ".07";
    i2.style.backgroundImage = svg(col, "M0 80 C150 110 300 40 450 80 S600 110 600 80 V120 H0Z"); i2.style.opacity = ".05";
    w.appendChild(i1); w.appendChild(i2); document.body.insertBefore(w, document.body.firstChild);
    try { new IntersectionObserver(function (es) { es.forEach(function (e) { w.classList.toggle("off", !e.isIntersecting); }); }).observe(w); } catch (e) {}
    // الوضع الليلي يغيّر --accent: نعيد التلوين
    try { new MutationObserver(function () { var c = (getComputedStyle(document.documentElement).getPropertyValue("--accent") || "").trim(); if (c && c !== col) { col = c; w.remove(); wave(); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] }); } catch (e) {}
  };
  // 5) التموّج من نقطة اللمس
  document.addEventListener("pointerdown", function (e) {
    if (reduce) return; var b = e.target && e.target.closest && e.target.closest("button.opt"); if (!b || b.disabled) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, x = document.createElement("span");
    x.className = "qx-rip"; x.style.width = x.style.height = s + "px"; x.style.left = (e.clientX - r.left - s / 2) + "px"; x.style.top = (e.clientY - r.top - s / 2) + "px";
    b.appendChild(x); setTimeout(function () { x.remove(); }, 600);
  }, { passive: true, capture: true });
  // 6) شريط التقدم يتعبّى من مكانه السابق بدل ما يقفز (التطبيق يعيد رسم الشاشة كاملة بعد كل إجابة)
  var lastW = null;
  var grow = function (el) {
    var to = el.style.width; if (!to) return;
    if (reduce || lastW === null || lastW === to) { lastW = to; return; }
    el.style.transition = "none"; el.style.width = lastW; void el.offsetWidth;
    el.style.transition = "width .34s " + ease; el.style.width = to; lastW = to;
  };
  try {
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) { var n = ms[i].addedNodes[j]; if (n.nodeType !== 1) continue;
        var p = n.matches && n.matches(".progress i") ? n : n.querySelector && n.querySelector(".progress i"); if (p) grow(p); }
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
  if (document.body) wave(); else document.addEventListener("DOMContentLoaded", wave);
})();
