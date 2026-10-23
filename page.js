"use client";

import { useEffect } from "react";
import { SITE } from "./content";

export default function PortfolioPage() {
  useEffect(() => {
    const S = SITE;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const navEl = document.getElementById("nav");
    const pageEl = document.getElementById("page");
    if (!navEl || !pageEl) return;

    // Yeniden render durumunda içeriği temizle
    navEl.innerHTML = "";
    pageEl.innerHTML = "";
    const oldSkip = document.querySelector(".skip");
    if (oldSkip) oldSkip.remove();

    /* ---------- Dil ---------- */
    const codes = S.languages.map((l) => l.code);
    let lang = S.defaultLanguage || codes[0];
    try {
      const saved = localStorage.getItem("lang");
      if (saved && codes.indexOf(saved) > -1) lang = saved;
      else if (!saved) {
        const nav = (navigator.language || "").slice(0, 2).toLowerCase();
        if (codes.indexOf(nav) > -1) lang = nav;
      }
    } catch (e) {}

    function pick(v) {
      if (v == null) return "";
      if (typeof v !== "object") return String(v);
      if (v[lang] != null && v[lang] !== "") return v[lang];
      if (v.en != null) return v.en;
      if (v.tr != null) return v.tr;
      for (const k in v) return v[k];
      return "";
    }

    /* ---------- Küçük DOM yardımcıları ---------- */
    const binds = [];
    function tx(v) {
      const n = document.createTextNode(pick(v));
      if (v && typeof v === "object") {
        n._v = v;
        binds.push(() => {
          n.nodeValue = pick(v);
        });
      }
      return n;
    }
    function at(el, name, v) {
      el.setAttribute(name, pick(v));
      if (v && typeof v === "object") {
        binds.push(() => {
          el.setAttribute(name, pick(v));
        });
      }
    }
    function add(el, kids) {
      (kids || []).forEach((c) => {
        if (c == null || c === false) return;
        if (Array.isArray(c)) return add(el, c);
        if (c.nodeType) return el.appendChild(c);
        el.appendChild(tx(c));
      });
      return el;
    }
    function h(tag, cls, kids, attrs) {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      for (const k in attrs || {}) el.setAttribute(k, attrs[k]);
      return add(el, kids);
    }
    function norm(s) {
      return String(s)
        .toLocaleLowerCase()
        .replace(/ı/g, "i")
        .replace(/İ/g, "i")
        .normalize("NFD")
        .replace(/[\u0300-\u036f\u064b-\u065f\u0640]/g, "");
    }
    function tags(list) {
      return (list || []).map((t) => h("span", "tag", [t]));
    }

    let projGrid = null;

    /* ---------- Bölüm oluşturucular ---------- */
    const builders = {
      about: function () {
        const communityCount = S.communities.reduce(
          (n, c) => n + (c.count || 1),
          0
        );
        const stats = S.about.stats.map((s) => {
          const v =
            s.value != null
              ? s.value
              : s.auto === "projects"
              ? S.projects.length
              : communityCount;
          const b = h("b", "", ["0"], { "data-n": v });
          return h("div", "", [b, h("span", "", [s.label])]);
        });
        return [
          h("p", "rv", [S.about.text], { style: "max-width:70ch" }),
          h("div", "stats stag", stats),
        ];
      },
      skills: function () {
        return [
          h(
            "div",
            "grid stag",
            S.skills.map((k) =>
              h("div", "card sr", [
                h("h3", "", [k.title]),
                h("p", "", [k.text]),
                tags(k.tags),
              ])
            )
          ),
        ];
      },
      projects: function () {
        const cards = S.projects.map((p) => {
          const kids = [
            h("h3", "", [p.title]),
            h("p", "", [p.text]),
            tags(p.tags),
          ];
          if (p.link)
            kids.push(
              h("a", "lk", ["GitHub"], {
                href: p.link,
                target: "_blank",
                rel: "noopener",
              })
            );
          return h("div", "card sr", kids);
        });
        projGrid = h("div", "grid stag", cards);
        const out = [projGrid];
        if (S.github)
          out.push(
            h("p", "more rv", [
              h("a", "", ["GitHub"], {
                href: S.github,
                target: "_blank",
                rel: "noopener",
              }),
            ])
          );
        return out;
      },
      experience: function () {
        return [
          h(
            "div",
            "tl stag",
            S.experience.map((e) =>
              h("div", "sr", [
                h("small", "", [h("bdi", "", [e.date], { dir: "ltr" })]),
                h("h3", "", [e.title]),
                e.text ? h("p", "", [e.text]) : null,
              ])
            )
          ),
        ];
      },
      community: function () {
        return [
          h(
            "div",
            "grid stag",
            S.communities.map((c) =>
              h("div", "card sr", [
                h("h3", "", [c.title]),
                c.text ? h("p", "", [c.text]) : null,
                tags(c.tags),
              ])
            )
          ),
        ];
      },
      sports: function () {
        return [
          h(
            "div",
            "grid stag",
            S.sports.map((s) =>
              h("div", "card sr", [
                h("span", "ic", [s.icon], { "aria-hidden": "true" }),
                h("h3", "", [s.title]),
                h("p", "", [s.text]),
              ])
            )
          ),
        ];
      },
      references: function () {
        const R = S.references;
        const cards = R.people.map((p) => {
          const kids = [
            h("div", "av", [p.initials], { "aria-hidden": "true" }),
            h("h3", "", [p.name]),
            h("p", "", [p.role]),
            h("p", "", [R.org]),
          ];
          (p.links || []).forEach((l) => {
            kids.push(
              h("a", "lk", [l.label], {
                href: l.href,
                target: "_blank",
                rel: "noopener",
              })
            );
          });
          return h("div", "card sr", kids);
        });
        return [h("div", "grid stag", cards), h("p", "note rv", [R.note])];
      },
      contact: function () {
        return [
          h(
            "div",
            "ct stag",
            S.contact.map((c) => {
              const a = h(
                "a",
                "sr",
                [h("small", "", [c.label]), h("bdi", "", [c.value], { dir: "ltr" })],
                { href: c.href }
              );
              if (c.external) {
                a.target = "_blank";
                a.rel = "noopener";
              }
              return a;
            })
          ),
        ];
      },
    };

    /* ---------- Sayfa iskeleti ---------- */
    const order = S.sections.filter((id) => builders[id]);

    const skip = h("a", "skip", [S.ui.skip], { href: "#main" });
    document.body.insertBefore(skip, document.body.firstChild);

    const navWrap = h("div", "wrap", [h("b", "", [S.brand])]);
    const navLinks = {};
    order.forEach((id) => {
      const a = h("a", "nl", [S.ui.nav[id]], { href: "#" + id });
      navLinks[id] = a;
      navWrap.appendChild(a);
    });
    const lg = h(
      "div",
      "lg",
      S.languages.map((l) =>
        h("button", "", [l.label], {
          type: "button",
          "data-code": l.code,
          title: l.name,
          lang: l.code,
        })
      ),
      { role: "group" }
    );
    at(lg, "aria-label", S.ui.languageLabel);
    navWrap.appendChild(lg);
    const tb = h("button", "tb", ["◐"], { type: "button" });
    at(tb, "aria-label", S.ui.themeToggle);
    at(tb, "title", S.ui.themeToggle);
    navWrap.appendChild(tb);
    navEl.appendChild(navWrap);
    const prog = h("div", "", [], { id: "prog", "aria-hidden": "true" });
    navEl.appendChild(prog);

    // Hero
    const ph = S.photo;
    let photo = null;
    if (ph && ph.src) {
      const img = h("img", "", [], {
        src: ph.src,
        width: 840,
        height: 1141,
        decoding: "async",
        fetchpriority: "high",
      });
      at(img, "alt", ph.alt);
      photo = h(
        "div",
        "photo rise",
        [
          h("div", "frame", [
            img,
            h("div", "fb", [ph.initials || ""], { "aria-hidden": "true" }),
          ]),
        ],
        { style: "--d:250" }
      );
      const okImg = () => photo.classList.add("ok");
      img.addEventListener("load", okImg);
      img.addEventListener("error", () => photo.classList.add("no"));
      if (img.complete && img.naturalWidth) okImg();
    }
    const ty = h("em", "", [""], { id: "ty" });

    function buildViz() {
      const W = 440,
        H = 190,
        pl = 12,
        pr = 12,
        pt = 16,
        pb = 22,
        base = H - pb;
      const hist = [
          0.18, 0.24, 0.27, 0.42, 0.36, 0.48, 0.58, 0.65, 0.2, 0.3, 0.62, 0.78,
          0.86, 0.92,
        ],
        fc = [0.92, 0.96, 1.0, 1.05];
      const n = hist.length + fc.length - 1,
        step = (W - pl - pr) / (n - 1),
        top = base - pt;
      const X = (i) => (pl + i * step).toFixed(1);
      const Y = (v) => (base - (v / 1.12) * top).toFixed(1);
      let o = "";
      for (let g = 0; g < 4; g++) {
        const gy = (pt + (g * top) / 3).toFixed(1);
        o += `<line class="gr" x1="${pl}" x2="${W - pr}" y1="${gy}" y2="${gy}"/>`;
      }
      o += `<line class="gr" x1="${pl}" x2="${W - pr}" y1="${base}" y2="${base}" style="stroke-opacity:.5"/>`;
      hist.forEach((v, i) => {
        const bh = (v * 0.42 * top).toFixed(1),
          bw = (step * 0.5).toFixed(1);
        o += `<rect class="vb" style="--i:${i}" x="${(
          pl +
          i * step -
          step * 0.25
        ).toFixed(1)}" y="${(base - bh).toFixed(
          1
        )}" width="${bw}" height="${bh}" rx="3"/>`;
      });
      const d = hist
        .map((v, i) => (i ? "L" : "M") + X(i) + " " + Y(v))
        .join("");
      let up = "",
        lo = "",
        fd = "";
      const k0 = hist.length - 1;
      fc.forEach((v, j) => {
        const sp = j * 0.035,
          x = X(k0 + j);
        up += (j ? "L" : "M") + x + " " + Y(v + sp);
        fd += (j ? "L" : "M") + x + " " + Y(v);
      });
      for (let j = fc.length - 1; j >= 0; j--)
        lo += "L" + X(k0 + j) + " " + Y(fc[j] - j * 0.035);
      o += `<path class="fb" d="${up + lo}Z"/>`;
      o += `<path class="hl" pathLength="1" d="${d}"/>`;
      o += `<path class="fl" d="${fd}"/>`;
      hist.forEach((v, i) => {
        if (i % 2 === 0 || i === k0)
          o += `<circle class="pt" style="--i:${i}" cx="${X(i)}" cy="${Y(
            v
          )}" r="3.2"/>`;
      });
      o += `<circle class="ed" cx="${X(n - 1)}" cy="${Y(
        fc[fc.length - 1]
      )}" r="4.5"/>`;
      const box = h("div", "viz rise", [], {
        "aria-hidden": "true",
        style: "--d:520",
      });
      box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" focusable="false">${o}</svg>`;
      box.appendChild(
        h("div", "viz-leg", [
          h("span", "", [S.ui.vizActual]),
          h("span", "f", [S.ui.vizForecast]),
        ])
      );
      return box;
    }

    const chipRow = h(
      "div",
      "chips rise",
      (S.hero.chips || []).map((c) => h("a", "chip", [c], { href: "#skills" })),
      { style: "--d:340" }
    );

    const hero = h("header", "hero", [
      h("div", "wrap hero-grid", [
        h("div", "hero-text", [
          h(
            "h1",
            "rise",
            [
              h(
                "span",
                "",
                S.name
                  .map((n, k) => (k ? [document.createElement("br"), n] : [n]))
                  .reduce((a, b) => a.concat(b), [])
              ),
            ],
            { style: "--d:60" }
          ),
          h("p", "role rise", [ty], { style: "--d:260" }),
          chipRow,
          h("p", "sub rise", [S.hero.subtitle], { style: "--d:430" }),
          buildViz(),
          h(
            "div",
            "btns rise",
            [
              order.indexOf("projects") > -1
                ? h("a", "btn", [S.ui.projectsBtn], { href: "#projects" })
                : null,
              order.indexOf("contact") > -1
                ? h("a", "btn m", [S.ui.contactBtn], { href: "#contact" })
                : null,
            ],
            { style: "--d:680" }
          ),
        ]),
        photo,
      ]),
    ]);

    const q = h("input", "", [], {
      id: "q",
      type: "search",
      autocomplete: "off",
      enterkeyhint: "search",
    });
    at(q, "placeholder", S.ui.searchPlaceholder);
    at(q, "aria-label", S.ui.searchPlaceholder);
    const cnt = h("span", "", [], { id: "cnt", "aria-live": "polite" });
    const sb = h("div", "sb", [h("div", "wrap", [q, cnt])]);

    const main = h("main", "", [hero, sb], { id: "main" });
    order.forEach((id) => {
      const sec = h(
        "section",
        "",
        [
          h(
            "div",
            "wrap",
            [h("h2", "rv", [S.ui.nav[id]])].concat(builders[id]())
          ),
        ],
        { id: id }
      );
      main.appendChild(sec);
    });
    const footer = h("footer", "", [
      h("div", "wrap", [
        "© " + S.year + " " + S.name.join(" ") + " · " + S.location,
      ]),
    ]);
    pageEl.appendChild(main);
    pageEl.appendChild(footer);

    /* ---------- GitHub depolarını otomatik ekle ---------- */
    const GH = S.githubProjects;
    function repoCards(repos) {
      const manual = S.projects
        .map((p) => String(p.repo || "").toLowerCase())
        .filter(Boolean);
      const skipList = (GH.exclude || []).map((n) => n.toLowerCase());
      const list = repos
        .filter((r) => {
          const n = r.name.toLowerCase();
          return (
            !(GH.hideForks && r.fork) &&
            !r.archived &&
            skipList.indexOf(n) < 0 &&
            manual.indexOf(n) < 0
          );
        })
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, GH.max || 12);
      if (!list.length) return;
      const head = h("h3", "gh-title rv", [GH.title]);
      const cards = list.map((r) => {
        const t = [];
        if (r.language) t.push(r.language);
        (r.topics || []).slice(0, 3).forEach((x) => t.push(x));
        const kids = [h("h3", "", [r.name.replace(/[-_]+/g, " ")])];
        if (r.description) kids.push(h("p", "", [r.description]));
        kids.push(tags(t));
        kids.push(
          h(
            "a",
            "lk",
            ["GitHub" + (r.stargazers_count ? " ★ " + r.stargazers_count : "")],
            { href: r.html_url, target: "_blank", rel: "noopener" }
          )
        );
        return h("div", "card sr rv", kids);
      });
      const grid = h("div", "grid", cards);
      cards.forEach((c, k) => {
        c.style.transitionDelay = Math.min(k * 80, 480) + "ms";
      });
      const anchor = projGrid.parentNode.querySelector(".more");
      projGrid.parentNode.insertBefore(head, anchor);
      projGrid.parentNode.insertBefore(grid, anchor);
      [head].concat(cards).forEach((e) => io.observe(e));
      search();
    }
    function loadRepos() {
      if (!GH || !GH.enabled || !GH.username || !projGrid || !window.fetch)
        return;
      const key = "gh-repos-" + GH.username,
        now = Date.now();
      try {
        const c = JSON.parse(localStorage.getItem(key) || "null");
        if (c && now - c.t < 3600000) return repoCards(c.d);
      } catch (e) {}
      fetch(
        "https://api.github.com/users/" +
          encodeURIComponent(GH.username) +
          "/repos?per_page=100&sort=pushed"
      )
        .then((r) => {
          if (!r.ok) throw 0;
          return r.json();
        })
        .then((d) => {
          try {
            localStorage.setItem(key, JSON.stringify({ t: now, d: d }));
          } catch (e) {}
          repoCards(d);
        })
        .catch(() => {
          try {
            const c = JSON.parse(localStorage.getItem(key) || "null");
            if (c) repoCards(c.d);
          } catch (e) {}
        });
    }

    /* ---------- Dil uygulama ---------- */
    const tw = { i: 0, c: 0, del: false, t: null };
    function applyLang(code) {
      lang = code;
      const meta = S.languages.filter((l) => l.code === code)[0];
      document.documentElement.lang = code;
      document.documentElement.dir = meta.dir || "ltr";
      binds.forEach((f) => f());
      Array.from(lg.children).forEach((b) =>
        b.setAttribute("aria-pressed", b.getAttribute("data-code") === code)
      );
      document.title = S.name.join(" ") + " | " + pick(S.hero.roles[0]);
      clearTimeout(tw.t);
      tw.i = 0;
      tw.c = pick(S.hero.roles[0]).length;
      tw.del = false;
      typeTick();
      search();
    }
    function setLang(code) {
      if (code === lang) return;
      try {
        localStorage.setItem("lang", code);
      } catch (e) {}
      if (reduce) return applyLang(code);
      pageEl.classList.add("swap");
      setTimeout(() => {
        applyLang(code);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            pageEl.classList.remove("swap");
          });
        });
      }, 240);
    }
    lg.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-code]");
      if (b) setLang(b.getAttribute("data-code"));
    });

    /* ---------- Yazı makinesi ---------- */
    function typeTick() {
      const roles = S.hero.roles,
        t = pick(roles[tw.i]);
      if (reduce) {
        ty.textContent = t;
        return;
      }
      ty.textContent = t.slice(0, tw.c);
      let wait = 55;
      if (!tw.del && tw.c < t.length) tw.c++;
      else if (!tw.del) {
        tw.del = true;
        wait = 1500;
      } else if (tw.c > 0) {
        tw.c--;
        wait = 28;
      } else {
        tw.del = false;
        tw.i = (tw.i + 1) % roles.length;
        wait = 320;
      }
      tw.t = setTimeout(typeTick, wait);
    }

    /* ---------- Arama ---------- */
    let hits = [],
      hi = -1,
      stimer = null;
    function hay(el) {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null),
        out = [];
      let n;
      while ((n = w.nextNode()))
        out.push(
          n._v
            ? Object.keys(n._v)
                .map((k) => n._v[k])
                .join(" ")
            : n.nodeValue
        );
      return norm(out.join(" "));
    }
    function updCount() {
      const has = q.value.trim();
      cnt.textContent = !has
        ? ""
        : (hits.length ? (hi >= 0 ? hi + 1 + "/" : "") + hits.length : "0") +
          " " +
          pick(S.ui.results);
    }
    function search() {
      const words = norm(q.value.trim())
        .split(/\s+/)
        .filter(Boolean);
      hits = [];
      hi = -1;
      Array.from(document.querySelectorAll(".sr")).forEach((e) => {
        e.classList.remove("dim", "hit", "cur");
        if (!words.length) return;
        e.classList.add("in");
        const t = hay(e);
        if (words.every((w) => t.indexOf(w) > -1)) {
          e.classList.add("hit");
          hits.push(e);
        } else e.classList.add("dim");
      });
      updCount();
    }
    function go(i) {
      if (!hits.length) return;
      if (hi >= 0) hits[hi].classList.remove("cur");
      hi = (i + hits.length) % hits.length;
      hits[hi].classList.add("cur");
      hits[hi].scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
      updCount();
    }
    q.addEventListener("input", () => {
      search();
      clearTimeout(stimer);
      stimer = setTimeout(() => {
        if (hits.length) go(0);
      }, 350);
    });
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        clearTimeout(stimer);
        go(hi + (e.shiftKey ? -1 : 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        go(hi - 1);
      } else if (e.key === "Escape") {
        q.value = "";
        search();
        q.blur();
      }
    });

    /* ---------- Görününce belirme ---------- */
    Array.from(document.querySelectorAll(".stag")).forEach((g) => {
      Array.from(g.children).forEach((c, k) => {
        c.classList.add("rv");
        c.style.transitionDelay = Math.min(k * 80, 480) + "ms";
      });
    });
    function countUp(el) {
      const n = +el.getAttribute("data-n");
      if (reduce || !n) {
        el.textContent = n;
        return;
      }
      const t0 = performance.now(),
        dur = 1300;
      (function step(t) {
        const p = Math.min((t - t0) / dur, 1),
          e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(n * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((x) => {
          if (!x.isIntersecting) return;
          const t = x.target;
          t.classList.add("in");
          Array.from(t.querySelectorAll("[data-n]")).forEach(countUp);
          if (t.hasAttribute("data-n")) countUp(t);
          setTimeout(() => {
            t.style.transitionDelay = "";
          }, 1500);
          io.unobserve(t);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    Array.from(document.querySelectorAll(".rv")).forEach((e) => io.observe(e));

    /* ---------- Aktif bölüm + ilerleme çubuğu ---------- */
    let current = null;
    const so = new IntersectionObserver(
      (es) => {
        es.forEach((x) => {
          if (x.isIntersecting) {
            current = x.target.id;
            for (const id in navLinks)
              navLinks[id].classList.toggle("on", id === current);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    order.forEach((id) => {
      const el = document.getElementById(id);
      if (el) so.observe(el);
    });

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.transform =
          "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
        if (window.scrollY < window.innerHeight * 0.4)
          for (const id in navLinks) navLinks[id].classList.remove("on");
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function onDocClick(e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }
    }
    document.addEventListener("click", onDocClick);

    /* ---------- Tema ---------- */
    const root = document.documentElement,
      colors = { c: "#00f0ff", m: "#ff2bd6" };
    function readColors() {
      const cs = getComputedStyle(root);
      colors.c = cs.getPropertyValue("--c").trim();
      colors.m = cs.getPropertyValue("--m").trim();
    }
    function isLight() {
      return root.getAttribute("data-theme") === "light";
    }
    function paintTheme() {
      tb.textContent = isLight() ? "☾" : "☀";
      readColors();
      const mt = document.querySelector('meta[name="theme-color"]');
      if (mt) mt.setAttribute("content", isLight() ? "#f3f6fb" : "#070a14");
      if (reduce) draw();
    }
    if (!root.getAttribute("data-theme")) {
      root.setAttribute(
        "data-theme",
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme:light)").matches
          ? "light"
          : "dark"
      );
    }
    tb.addEventListener("click", () => {
      const next = isLight() ? "dark" : "light";
      root.classList.add("theming");
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      setTimeout(() => {
        readColors();
        paintTheme();
      }, 30);
      setTimeout(() => {
        root.classList.remove("theming");
      }, 650);
    });

    /* ---------- Arka plan parçacıkları ---------- */
    const cv = document.getElementById("cv"),
      x = cv.getContext("2d");
    let P = [],
      W = 0,
      H = 0,
      dpr = 1,
      animId = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = window.innerWidth,
        nh = window.innerHeight,
        wide = Math.abs(nw - W) > 40;
      W = nw;
      H = nh;
      cv.width = W * dpr;
      cv.height = H * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (wide || !P.length) {
        P = [];
        const n = Math.min(70, Math.floor((W * H) / 22000));
        for (let i = 0; i < n; i++)
          P.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
          });
      }
      if (reduce) draw();
    }
    function draw() {
      x.clearRect(0, 0, W, H);
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        x.fillStyle = i % 3 ? colors.c : colors.m;
        x.shadowColor = x.fillStyle;
        x.shadowBlur = 10;
        x.beginPath();
        x.arc(p.x, p.y, 2, 0, 7);
        x.fill();
        x.shadowBlur = 0;
        for (let j = i + 1; j < P.length; j++) {
          const d = Math.hypot(p.x - P[j].x, p.y - P[j].y);
          if (d < 130) {
            x.strokeStyle = colors.c;
            x.globalAlpha = (1 - d / 130) * 0.35;
            x.beginPath();
            x.moveTo(p.x, p.y);
            x.lineTo(P[j].x, P[j].y);
            x.stroke();
            x.globalAlpha = 1;
          }
        }
      }
      if (!reduce) animId = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);

    /* ---------- Başlat ---------- */
    applyLang(lang);
    loadRepos();
    paintTheme();
    resize();
    if (!reduce) draw();

    /* ---------- Temizleme (Cleanup) ---------- */
    return () => {
      clearTimeout(tw.t);
      clearTimeout(stimer);
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onDocClick);
      io.disconnect();
      so.disconnect();
    };
  }, []);

  return (
    <>
      <canvas id="cv" aria-hidden="true"></canvas>
      <nav id="nav"></nav>
      <div id="page"></div>
      <noscript>
        <p
          style={{
            position: "relative",
            zIndex: 2,
            padding: "120px 24px",
            textAlign: "center",
            color: "#8ea0c0",
          }}
        >
          Bu sayfanın görüntülenmesi için JavaScript gerekir. / This page
          requires JavaScript.
        </p>
      </noscript>
    </>
  );
}