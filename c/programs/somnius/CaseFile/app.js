"use strict";
/* Case File — a native Windows 94 program. Case switcher, progress, the
   page-cost ledger, the hint clock, and the two-step reset. The Case 1
   intro lives here too, on first launch (see Somnius.maybeShowIntro). */
Somnius.PROGRAM = "somnius-casefile";
const S = Somnius;

function renderCaseFile() {
  const el = $("#casefile-body"); if (!el) return;
  const state = S.state, saveData = S.saveData, PAGES = S.PAGES, EVIDENCE = S.EVIDENCE;
  const meta = S.CASE_META[saveData.active];
  const visited = state.order.length, evCount = Object.keys(state.ev).length, ppl = Object.keys(state.enc).length;
  const totals = { stub: 0, standard: 0, hub: 0 };
  PAGES.forEach(p => totals[p.type]++);
  const totalMin = PAGES.reduce((a, p) => a + p.costMin, 0);
  const mins = Math.max(1, Math.round((Date.now() - state.started) / 60000));
  const zone = S.ZONE_NAMES[saveData.active];
  el.innerHTML = `<div class="case-switch">
    ${Object.keys(S.CASE_META).map(n => `<button class="${saveData.active === +n ? "active" : ""}" data-case="${n}">${S.esc(S.CASE_META[n].title)}</button>`).join("")}
  </div>
  <p style="color:#666">In the full game, Case 2 unlocks by closing Case 1, and Case 3 by closing Case 2. In this slice all cases are open for playtesting — progress saves per case. Search and the directory scope per case here; unlocked zones accumulate in search in the full game.</p>
  <h2>${S.esc(meta.title)} ${state.resolved ? '<span class="stamp">CASE CLOSED</span>' : ""}</h2>
  <p><b>Client:</b> ${S.esc(meta.client)}. <b>Subject:</b> ${meta.objective}</p>
  <p><b>Pages visited:</b> ${visited}/20</p><div class="meter"><div style="width:${visited / 20 * 100}%"></div></div>
  <p><b>Identity evidence found:</b> ${evCount}/${Object.keys(EVIDENCE).length} &nbsp;·&nbsp; <b>People met:</b> ${ppl}/${Object.keys(S.PEOPLE).length} &nbsp;·&nbsp; <b>Hints used:</b> ${state.hints}/3 &nbsp;·&nbsp; <b>Report attempts:</b> ${state.attempts} &nbsp;·&nbsp; <b>Time on case:</b> ~${mins} min</p>
  <p><b>Hint clock:</b> <span id="hint-clock">No new pages for 0:00</span> <span style="color:#666">(Tier 1 at 1:00, Tier 2 at 2:30, Tier 3 at 4:00 of no new pages — slice thresholds)</span></p>
  ${state.hintLog.length ? `<p><b>Hints delivered:</b><br>${state.hintLog.map(S.esc).join("<br>")}</p>` : ""}
  <p><button id="btn-goto-report">🔍 File Report</button> <button id="btn-goto-browser">🌐 Back to the browser</button> <button id="btn-reset">↺ Reset case (clear save)</button></p>
  <h3>What this slice has to prove</h3>
  <ol>${meta.proves.map(p => `<li>${S.esc(p)}</li>`).join("")}</ol>
  <h3>Page-cost ledger (estimates from the design doc)</h3>
  <table class="ledger"><tr><th>Page</th><th>Type</th><th>Est.</th></tr>
  ${PAGES.map(p => `<tr><td>${S.esc(p.title)}</td><td>${p.type}</td><td>${p.costMin} min</td></tr>`).join("")}
  <tr><td><b>Total — 20 pages</b></td><td><b>${totals.stub} stubs · ${totals.standard} standard · ${totals.hub} hubs</b></td><td><b>${totalMin} min (${(totalMin / 60).toFixed(1)} hrs)</b></td></tr></table>
  <p><b>Gate check:</b> the doc says if a case costs 25+ hours, the target drops from 300 pages to 200. This case estimates at <b>${(totalMin / 60).toFixed(1)} hours — the gate trips on estimate alone</b>. The number that matters is the measured one: how long the 20 pages actually took to write. At the estimated rate, 300 pages is ~${Math.round(totalMin / 20 * 300 / 60)} writing hours; 200 pages is ~${Math.round(totalMin / 20 * 200 / 60)}.</p>
  <p style="color:#666">How to play: read the case email, search and browse ${S.esc(zone)}, follow links and webrings. Unlisted pages never appear in search or the directory — somebody has to link you to them. When you know the truth, File Report.</p>`;
  el.querySelectorAll("[data-case]").forEach(b => b.onclick = () => S.setCase(+b.dataset.case));
  $("#btn-goto-report").onclick = () => S.openProgram("somnius-report");
  $("#btn-goto-browser").onclick = () => S.openProgram("somnius-browser");
  $("#btn-reset").onclick = () => S.doReset();
  $("#zone-name").textContent = zone;
}

Somnius.onSync = renderCaseFile;
Somnius.onCaseChange = renderCaseFile;

renderCaseFile();
S.initSync();
S.maybeShowIntro();
S.startHintClock();
