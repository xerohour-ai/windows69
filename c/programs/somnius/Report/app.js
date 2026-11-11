"use strict";
/* File Report — a native Windows 94 program. The structured report slots
   with partial credit (no free text) and the epilogues, including Case 3's
   ethical-choice slots. Only lists people and evidence actually encountered. */
Somnius.PROGRAM = "somnius-report";
const S = Somnius;

/* Signature of everything the slot lists depend on — re-render on sync only
   when the available options or the resolved state actually changed, so a
   half-filled report is never wiped by another program's save. */
function optionsSignature() {
  const state = S.state;
  return [
    state.resolved ? "R" : "U",
    S.encounteredPeople().join(","),
    S.unlockedEvidenceOptions().map(o => o.key).join(","),
    S.REPORTS[S.saveData.active].s3kind === "entities" ? S.entityOptions().map(o => o.key).join(",") : ""
  ].join("|");
}
let lastSig = null;

function renderReport() {
  const body = $("#report-body");
  const state = S.state;
  const cfg = S.REPORTS[S.saveData.active];
  if (state.resolved) {
    const mins = Math.max(1, Math.round((Date.now() - state.started) / 60000));
    const epi = cfg.epilogues ? cfg.epilogues[state.choice] : cfg.epilogue;
    body.innerHTML = `<h2>Report filed — <span class="stamp">CASE CLOSED</span></h2>
    ${epi}
    <p><b>Stats:</b> ${state.order.length}/20 pages visited · ${Object.keys(state.ev).length}/${Object.keys(S.EVIDENCE).length} identity evidence found · ${state.hints}/3 hints used · ${state.attempts} report attempt(s) · ~${mins} min on the case.</p>
    <p><button id="btn-again">↺ Play it again (reset case)</button></p>
    <div id="epilogue" style="display:block"></div>`;
    $("#btn-again").onclick = () => S.doReset();
    return;
  }
  const people = S.encounteredPeople();
  const evOpts = S.unlockedEvidenceOptions();
  const s3opts = cfg.s3kind === "entities" ? S.entityOptions() : cfg.s3kind === "choice" ? cfg.s3choices : people.map(p => ({ key: p, label: p }));
  body.innerHTML = `<h2>${S.esc(cfg.title)}</h2>
  <p>Report your findings to ${S.esc(cfg.client)}. Pick from people and pages you have <b>actually encountered</b> — the report only lists what you've seen. You can retry as many times as you like; partial credit tells you which slot is wrong, never the answer.</p>
  <div class="slot"><b>1. ${S.esc(cfg.s1label)}</b>
    ${people.length ? people.map(p => `<label><input type="radio" name="s1" value="${p}"> ${S.esc(S.PEOPLE[p] || p)}</label>`).join("") : `<i>You haven't met anyone yet. Visit some pages first.</i>`}
    <div class="verdict" id="v1"></div></div>
  <div class="slot"><b>2. ${S.esc(cfg.s2label)}</b>
    ${evOpts.length ? evOpts.map(o => `<label><input type="radio" name="s2" value="${o.key}"> ${S.esc(o.label)}</label>`).join("") : `<i>No identity evidence found yet. Keep looking — something has to link the two sides.</i>`}
    <div class="verdict" id="v2"></div></div>
  <div class="slot"><b>3. ${S.esc(cfg.s3label)}</b>
    ${s3opts.length ? s3opts.map(o => `<label><input type="radio" name="s3" value="${o.key}"> ${S.esc(o.label)}</label>`).join("") : `<i>Nothing to choose from yet. Keep looking — the answer has to be something you've seen.</i>`}
    <div class="verdict" id="v3"></div></div>
  <button id="btn-submit" style="padding:6px 18px;font-weight:bold">Submit report</button>
  <span id="report-msg" style="margin-left:8px"></span>
  <div id="epilogue"></div>`;
  $("#btn-submit").onclick = () => {
    /* Read state FRESH here, not the object renderReport captured above:
       shared.js replaces the state object on every cross-program sync, so a
       form left open for a minute holds a stale object — mutating it and
       calling S.save() persisted the fresh object instead, and the report
       silently never stuck (attempts stayed 0, resolved stayed false). */
    const st = S.state;
    const s1 = (document.querySelector('input[name=s1]:checked') || {}).value;
    const s2 = (document.querySelector('input[name=s2]:checked') || {}).value;
    const s3 = (document.querySelector('input[name=s3]:checked') || {}).value;
    if (!s1 || !s2 || !s3) { $("#report-msg").textContent = "Fill in all three slots first."; return; }
    st.attempts++; S.save();
    const ok1 = cfg.s1correct.includes(s1);
    const ok2 = cfg.s2correct.includes(s2);
    /* A choice slot has no wrong answer — any choice is a decision. It still has to be made. */
    const ok3 = cfg.s3kind === "choice" ? !!s3 : s3 === cfg.s3correct;
    const v1 = $("#v1"), v2 = $("#v2"), v3 = $("#v3");
    v1.className = "verdict " + (ok1 ? "ok" : "bad");
    v1.textContent = ok1 ? "✓ Correct." : "✗ " + cfg.s1wrong;
    v2.className = "verdict " + (ok2 ? "ok" : "bad");
    v2.textContent = ok2 ? "✓ Correct." : "✗ " + cfg.s2wrong;
    v3.className = "verdict " + (ok3 ? "ok" : "bad");
    v3.textContent = ok3 ? (cfg.s3kind === "choice" ? "✓ Noted — this is your call." : "✓ Correct.") : "✗ " + cfg.s3wrong;
    if (ok1 && ok2 && ok3) {
      if (cfg.s3kind === "choice") { st.choice = s3; }
      st.resolved = true;
      if (!st.mail.includes("m-epilogue")) st.mail.push("m-epilogue");
      S.save();
      $("#report-msg").textContent = "";
      setTimeout(renderReport, 400);
      S.toast("✅ <b>Case closed.</b> The report went through — read the epilogue.");
    } else {
      $("#report-msg").textContent = "Partial credit: " + [ok1, ok2, ok3].filter(Boolean).length + "/3 slots right. Try again.";
    }
  };
}

Somnius.onSync = function () {
  const sig = optionsSignature();
  if (sig !== lastSig) { lastSig = sig; renderReport(); }
};
Somnius.onCaseChange = function () { lastSig = null; renderReport(); };

lastSig = optionsSignature();
renderReport();
S.initSync();
S.maybeShowIntro();
S.startHintClock();
