"use strict";
/* Somnius Browser — a native Windows 94 program. Renders the Somnius web:
   the 60 case pages, search (public pages only), directory, history,
   bookmarks, pins, webrings, zoom-to-reveal, and the music-box tune uploads. */
Somnius.PROGRAM = "somnius-browser";
const S = Somnius;

let hist = [], histIdx = -1, currentId = null;

function nav(id, push = true) {
  const p = S.byId(id); if (!p) return;
  const state = S.state;
  const isNew = !state.visited[id];
  if (isNew) { state.visited[id] = Date.now(); state.order.push(id); state.idle = 0; S.encounterPage(p); S.save(); }
  if (push) { hist = hist.slice(0, histIdx + 1); hist.push(id); histIdx = hist.length - 1; }
  currentId = id;
  $("#assist-panel").style.display = "none";
  $("#addr").textContent = "somnius://" + id;
  $("#browser-view").innerHTML = p.body;
  $("#page-meta").textContent = p.title + " · by " + p.author + " · " + p.zone + " · tags: " + p.tags.join(", ");
  $("#btn-bookmark").textContent = state.bookmarks[id] ? "★ Bookmarked" : "☆ Bookmark";
}
function navSynthetic(title, html) {
  currentId = null;
  $("#addr").textContent = "somnius://search";
  $("#browser-view").innerHTML = html;
  $("#page-meta").textContent = title;
}
function bootHome() { navSynthetic("Somnius Home", S.HOMES[S.saveData.active]); hist = []; histIdx = -1; }
function resumeOrHome() {
  const state = S.state;
  if (state.order.length) { const last = state.order[state.order.length - 1]; hist = state.order.slice(); histIdx = hist.length - 1; nav(last, false); }
  else bootHome();
}
function showAssist(pageId) {
  const p = S.byId(pageId); if (!p) return;
  const panel = $("#assist-panel");
  panel.style.display = "block";
  panel.innerHTML = `<b>Somnius Search Assist — related results:</b> you haven't visited this yet, and it matches this case — <a href="#" data-page="${p.id}">${S.esc(p.title)}</a> <span style="color:#666">by ${S.esc(p.author)}</span>`;
  panel.querySelector("a").onclick = e => { e.preventDefault(); nav(p.id); };
}
function handleNav() {
  const navReq = S.consumeNav();
  if (!navReq) return;
  if (navReq.assist) { if (!currentId) resumeOrHome(); showAssist(navReq.assist); }
  else if (navReq.page) nav(navReq.page);
}

$("#browser-view").addEventListener("click", e => {
  const dl = e.target.closest("a[data-download]");
  if (dl) { e.preventDefault(); S.downloadFile(dl.dataset.download); return; }
  const a = e.target.closest("a[data-page]");
  if (a) { e.preventDefault(); nav(a.dataset.page); return; }
  const t = e.target.closest(".tune-btn");
  if (t) { e.preventDefault(); S.playTune(t.dataset.tune); return; }
  const z = e.target.closest(".zoom-btn");
  if (z) {
    e.preventDefault();
    const r = document.querySelector(".zoom-reveal");
    if (r) { const open = r.style.display === "block"; r.style.display = open ? "none" : "block"; z.textContent = open ? "🔍 MAGNIFY THIS PANEL" : "🔍 HIDE THE MAGNIFICATION"; }
  }
});
$("#btn-back").onclick = () => { if (histIdx > 0) { histIdx--; nav(hist[histIdx], false); } };
$("#btn-fwd").onclick = () => { if (histIdx < hist.length - 1) { histIdx++; nav(hist[histIdx], false); } };
$("#btn-bookmark").onclick = () => {
  if (!currentId) return;
  const state = S.state;
  state.bookmarks[currentId] = !state.bookmarks[currentId]; S.save(); nav(currentId, false);
};
$("#btn-pin").onclick = () => {
  if (!currentId) return;
  const state = S.state;
  const p = S.byId(currentId);
  if (!state.pins.find(x => x.id === currentId)) { state.pins.push({ id: currentId, title: p.title }); S.save(); S.toast("📌 Pinned <b>" + S.esc(p.title) + "</b> to your Notepad."); }
  else S.toast("Already pinned.");
};
function doSearch() {
  const q = $("#search-input").value.trim().toLowerCase();
  if (!q) return;
  const PAGES = S.PAGES;
  const hits = PAGES.filter(p => !p.hidden && (p.title + " " + p.author + " " + p.tags.join(" ") + " " + S.stripHtml(p.body)).toLowerCase().includes(q));
  let html = `<div class="pg plain"><h1>Somnius Search — “${S.esc(q)}”</h1>`;
  if (!hits.length) html += `<p>No pages match. The directory only lists public pages — try the <b>Directory</b>, or follow links and webrings. Unlisted pages never show up in search.</p>`;
  else hits.forEach(p => {
    const txt = S.stripHtml(p.body).replace(/\s+/g, " ").slice(0, 160);
    html += `<p><a href="#" data-page="${p.id}"><b>${S.esc(p.title)}</b></a> <span class="tiny">by ${S.esc(p.author)} · ${S.esc(p.zone)}</span><br><span class="tiny">${S.esc(txt)}…</span></p>`;
  });
  html += `<p class="tiny">Search covers public pages only. ${PAGES.filter(p => p.hidden).length} unlisted pages exist on Somnius and will never appear here — somebody has to link you to them.</p></div>`;
  navSynthetic("Search results", html);
}
$("#btn-search").onclick = doSearch;
$("#search-input").addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
$("#btn-dir").onclick = () => {
  const PAGES = S.PAGES;
  const cats = {};
  PAGES.filter(p => !p.hidden).forEach(p => { (cats[p.dir] = cats[p.dir] || []).push(p); });
  let html = `<div class="pg plain"><h1>📁 ${S.ZONE_NAMES[S.saveData.active]} Directory</h1><p class="tiny">Public pages only. Unlisted pages are not in the directory — that's the point of a webring.</p>`;
  Object.keys(cats).sort().forEach(c => {
    html += `<h2>${S.esc(c)}</h2><ul>` + cats[c].map(p => `<li><a href="#" data-page="${p.id}">${S.esc(p.title)}</a> <span class="tiny">by ${S.esc(p.author)}</span></li>`).join("") + `</ul>`;
  });
  html += `</div>`;
  navSynthetic("Directory", html);
};
$("#btn-hist").onclick = () => {
  const state = S.state;
  let html = `<div class="pg plain"><h1>🕘 History</h1>`;
  if (!state.order.length) html += `<p>You haven't visited any pages yet. The case email is a good place to start.</p>`;
  else html += `<ol>` + state.order.map(id => { const p = S.byId(id); return `<li><a href="#" data-page="${id}">${S.esc(p.title)}</a> <span class="tiny">by ${S.esc(p.author)}</span></li>`; }).join("") + `</ol>`;
  html += `<p class="tiny">Bookmarks: ` + (Object.keys(state.bookmarks).filter(k => state.bookmarks[k]).map(id => `<a href="#" data-page="${id}">${S.esc(S.byId(id).title)}</a>`).join(", ") || "none yet") + `</p></div>`;
  navSynthetic("History", html);
};

/* Cross-program sync: another program changed the save (or the case). */
Somnius.onCaseChange = function () {
  $("#zone-name").textContent = S.ZONE_NAMES[S.saveData.active];
  hist = []; histIdx = -1; currentId = null;
  resumeOrHome();
};
Somnius.onSync = function () {
  /* Re-render the current page's bookmark state if a page is showing. */
  if (currentId) $("#btn-bookmark").textContent = S.state.bookmarks[currentId] ? "★ Bookmarked" : "☆ Bookmark";
  $("#zone-name").textContent = S.ZONE_NAMES[S.saveData.active];
};
Somnius.onNav = handleNav;

$("#zone-name").textContent = S.ZONE_NAMES[S.saveData.active];
resumeOrHome();
handleNav();
S.initSync();
S.maybeShowIntro();
S.startHintClock();
