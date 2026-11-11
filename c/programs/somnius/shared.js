"use strict";
/* ============================================================================
   Somnius — shared engine for the native Windows 94 programs.
   Project Sleepwalk, de-incepted: there is no nested Somnius desktop anymore.
   Each program (Browser, Mail, Notepad, Case File, File Report, 3y3.exe) is
   its own Windows 94 program window. They share ONE save in localStorage on
   this origin (same key/format as the nested game, so existing saves keep
   working) and see each other's updates through `storage` events + focus.
   ============================================================================ */
const LS_KEY = "sleepwalk-case1";
const LS_NAV_KEY = "sleepwalk-nav";   /* {app, page?, assist?, mail?, t} — cross-program navigation request */
const LS_TICK_KEY = "sleepwalk-tick"; /* {t, by, token, lastTick} — hint-clock leader lock, one tick per second */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const NAV_TTL_MS = 10 * 60 * 1000;

const CASE_PAGES = { 1: window.SLEEPWALK_PAGES, 2: window.SLEEPWALK_PAGES2, 3: window.SLEEPWALK_PAGES3 };
const CASE_PEOPLE = { 1: window.SLEEPWALK_PEOPLE, 2: window.SLEEPWALK_PEOPLE2, 3: window.SLEEPWALK_PEOPLE3 };
const CASE_EVIDENCE = { 1: window.SLEEPWALK_EVIDENCE, 2: window.SLEEPWALK_EVIDENCE2, 3: window.SLEEPWALK_EVIDENCE3 };
const CASE_MAIL = { 1: window.SLEEPWALK_MAIL, 2: window.SLEEPWALK_MAIL2, 3: window.SLEEPWALK_MAIL3 };
const CASE_FOLLOWUP = { 1: window.SLEEPWALK_FOLLOWUP, 2: window.SLEEPWALK_FOLLOWUP2, 3: window.SLEEPWALK_FOLLOWUP3 };
const CASE_FILES = { 3: window.SLEEPWALK_FILES3 };
const ZONE_NAMES = { 1: "Goodtime Valley", 2: "Teentopia", 3: "gamerZone" };
const PROGRAM_NAMES = {
  "somnius-browser": "Somnius Browser",
  "somnius-mail": "Somnius Mail",
  "somnius-notepad": "Somnius Notepad",
  "somnius-casefile": "Case File",
  "somnius-report": "File Report",
  "somnius-decryptor": "3y3.exe"
};

let PAGES = CASE_PAGES[1], PEOPLE = CASE_PEOPLE[1], EVIDENCE = CASE_EVIDENCE[1];
const byId = id => PAGES.find(p => p.id === id);
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
function stripHtml(h) { const d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; }

function freshState() {
  return { visited: {}, order: [], enc: {}, ev: {}, pins: [], notes: "",
    hints: 0, hintLog: [], idle: 0, resolved: false, attempts: 0,
    mail: ["m-case", "m-welcome"], read: {}, bookmarks: {}, seenIntro: false,
    started: Date.now(), downloads: [], decrypted: {}, has3y3: false, audioKey: false, choice: null };
}
let saveData = { active: 1, cases: { 1: freshState(), 2: freshState(), 3: freshState() } };
/* ?reset=1 wipes the save before it loads — the clean-state escape hatch for playtesting. */
try { if (new URLSearchParams(location.search).has("reset")) localStorage.removeItem(LS_KEY); } catch (e) {}
/* Normalize any loaded save: every case sub-state must exist AND have every
   field freshState() provides. Saves written by older builds (or a save
   whose cases[1] is missing outright) used to leave `state` undefined or
   half-built, and every program then threw on its first render and showed
   a blank body. Backfilling here makes a stale/partial save load fresh. */
function normalizeSave(data) {
  if (!data || typeof data !== "object") return null;
  if (!data.cases || typeof data.cases !== "object") return null;
  if (data.active !== 1 && data.active !== 2 && data.active !== 3) data.active = 1;
  for (const n of [1, 2, 3]) {
    const c = data.cases[n];
    data.cases[n] = (c && typeof c === "object") ? Object.assign(freshState(), c) : freshState();
  }
  return data;
}
try {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.cases) { const norm = normalizeSave(parsed); if (norm) saveData = norm; }
    else if (parsed && parsed.visited) { saveData.cases[1] = Object.assign(freshState(), parsed); } /* old flat Case 1 save */
  }
} catch (e) {}
/* ?case=2 / ?case=3 opens straight into that case (playtest shortcut). */
try { const c = new URLSearchParams(location.search).get("case"); if (c === "2" || c === "3") saveData.active = +c; } catch (e) {}
let state = saveData.cases[saveData.active];
PAGES = CASE_PAGES[saveData.active]; PEOPLE = CASE_PEOPLE[saveData.active]; EVIDENCE = CASE_EVIDENCE[saveData.active];

function save() {
  saveData.cases[saveData.active] = state;
  try { localStorage.setItem(LS_KEY, JSON.stringify(saveData)); } catch (e) {}
}
/* Re-read the save another program just wrote. Returns true if the active case changed. */
function syncFromStorage() {
  let raw = null;
  try { raw = localStorage.getItem(LS_KEY); } catch (e) { return false; }
  if (!raw) {
    /* No save in storage: another program wiped it (two-step reset / ?reset=1).
       Go fresh too, so a stale in-memory state here can never resurrect the
       deleted save with its next save(). No-op when already fresh. */
    const hadProgress = saveData && saveData.cases && [1, 2, 3].some(n => {
      const c = saveData.cases[n];
      return c && (Object.keys(c.visited).length || Object.keys(c.ev).length || c.hints || c.resolved);
    });
    if (!hadProgress) return false;
    saveData = { active: 1, cases: { 1: freshState(), 2: freshState(), 3: freshState() } };
    state = saveData.cases[1];
    PAGES = CASE_PAGES[1]; PEOPLE = CASE_PEOPLE[1]; EVIDENCE = CASE_EVIDENCE[1];
    reconcile3y3Icon(); /* the wipe also removes the downloaded tool's desktop icon */
    return true;
  }
  let parsed = null;
  try { parsed = JSON.parse(raw); } catch (e) { return false; }
  if (!parsed || !parsed.cases) return false;
  const norm = normalizeSave(parsed);
  if (!norm) return false;
  const caseChanged = norm.active !== saveData.active;
  if (!caseChanged) {
    /* Preserve the `state` object identity: normalizeSave() builds a NEW
       object per case, so a plain reassignment here silently orphaned any
       state object a program captured at render time — the File Report's
       submit handler held one for minutes (its re-render is signature-gated)
       and its attempts++/resolved=true mutations were discarded by the next
       save(), which persisted the fresh object instead. Merge in place. */
    const fresh = norm.cases[saveData.active];
    for (const k of Object.keys(state)) if (!(k in fresh)) delete state[k];
    Object.assign(state, fresh);
    saveData.active = norm.active;
    saveData.cases = norm.cases;
    saveData.cases[saveData.active] = state;
  } else {
    saveData = norm;
    state = saveData.cases[saveData.active];
    PAGES = CASE_PAGES[saveData.active]; PEOPLE = CASE_PEOPLE[saveData.active]; EVIDENCE = CASE_EVIDENCE[saveData.active];
  }
  return caseChanged;
}
/* Switch cases: swap the active sub-state and every per-case registry. Other
   programs pick the switch up through `storage` events / focus. */
function setCase(n) {
  if (n === saveData.active) return;
  saveData.active = n; state = saveData.cases[n];
  PAGES = CASE_PAGES[n]; PEOPLE = CASE_PEOPLE[n]; EVIDENCE = CASE_EVIDENCE[n];
  save();
  if (typeof Somnius.onCaseChange === "function") Somnius.onCaseChange(n);
  refresh();
}
function encounterPage(p) {
  (p.people || []).forEach(person => { if (!state.enc[person]) state.enc[person] = Date.now(); });
  Object.keys(EVIDENCE).forEach(k => { if (EVIDENCE[k].unlockPage === p.id && !state.ev[k]) state.ev[k] = Date.now(); });
}
/* Call the hosting program's re-render hook, if it registered one. */
function refresh() { if (typeof Somnius.onSync === "function") { try { Somnius.onSync(); } catch (e) {} } }

/* ================= cross-program opening ================= */
/* Open another Somnius program in the real Windows 94 desktop. In the OS the
   document iframe can reach the parent: window.parent.sys42.apps.launch().
   If that is unavailable (program opened standalone in a browser tab), the
   navigation request stays in localStorage and the target program consumes
   it the next time it opens. */
function openProgram(command, nav) {
  if (nav) {
    try { localStorage.setItem(LS_NAV_KEY, JSON.stringify(Object.assign({ app: command, t: Date.now() }, nav))); } catch (e) {}
  }
  let launched = false;
  try {
    const p = window.parent;
    if (p && p !== window && p.sys42 && p.sys42.apps && typeof p.sys42.apps.launch === "function") {
      const r = p.sys42.apps.launch(command);
      if (r && typeof r.catch === "function") r.catch(function () {});
      launched = true;
    }
  } catch (e) { launched = false; }
  if (!launched) toast("Open <b>" + esc(PROGRAM_NAMES[command] || command) + "</b> from the Start menu — your place is saved.");
  return launched;
}
/* Consume a navigation request addressed to THIS program (called on load,
   on focus, and on `storage` events). Stale requests (>10 min) are dropped. */
function consumeNav() {
  let nav = null;
  try { nav = JSON.parse(localStorage.getItem(LS_NAV_KEY) || "null"); } catch (e) { return null; }
  if (!nav || nav.app !== Somnius.PROGRAM) return null;
  try { localStorage.removeItem(LS_NAV_KEY); } catch (e) {}
  if (Date.now() - (nav.t || 0) > NAV_TTL_MS) return null;
  return nav;
}

/* ================= toast (document-local status message) ================= */
function toast(msg) {
  let t = document.getElementById("som-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "som-toast";
    document.body.appendChild(t);
  }
  t.innerHTML = msg; t.style.display = "block";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = "none"; }, 6000);
}

/* ================= two-step reset ================= */
/* Native confirm() dialogs get auto-dismissed by automated browsers, so the
   reset arms on first click and fires on a second click within 5s. */
let resetArmed = false, resetArmTimer = null;
function doReset() {
  if (!resetArmed) {
    resetArmed = true;
    toast("⚠️ Click Reset case again within 5 seconds to wipe your save and restart.");
    resetArmTimer = setTimeout(() => { resetArmed = false; }, 5000);
    return;
  }
  clearTimeout(resetArmTimer);
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
  /* Remove the 3y3.exe desktop icon first (the save it came from is gone),
     then reload. The 2s race keeps a hung filesystem call from ever
     bricking the reset; the load-time reconcile deletes the icon anyway. */
  Promise.race([remove3y3Icon(), sleep(2000)]).then(() => location.reload());
}

/* ================= tune player (WebAudio music box) ================= */
/* The tune is evidence: the same 16-note melody, the same fingerprints.
   QR-7712 on both uploads in Case 1; QR-9931 is the shrine theme in Case 3
   and the audio key for 3y3.exe layer 2. */
let audioCtx = null, tuneTimer = null;
const MELODY = [880, 1318.5, 1046.5, 880, 784, 659.3, 587.3, 659.3, 523.3, 659.3, 784, 987.8, 880, 784, 659.3, 587.3];
const BASS = [220, 220, 174.6, 220];
const TUNES = {
  "1": { fp: "QR-7712", note: "Same ID on both uploads." },
  "2": { fp: "QR-7712", note: "Same ID on both uploads." },
  "shrine": { fp: "QR-9931", note: "Same ID as the Null Sector keygen.", audioKey: true }
};
function playTune(which) {
  const tune = TUNES[which] || TUNES["1"];
  if (tune.audioKey && !state.audioKey) { state.audioKey = true; save(); toast("🎵 3y3.exe: audio key detected — QR-9931"); }
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    if (tuneTimer) { clearTimeout(tuneTimer); tuneTimer = null; }
    const t0 = audioCtx.currentTime + 0.05;
    MELODY.forEach((f, i) => {
      const t = t0 + i * 0.42;
      const o = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = f; o2.type = "sine"; o2.frequency.value = f * 3;
      const g2 = audioCtx.createGain(); g2.gain.value = 0.12;
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.start(t); o2.start(t); o.stop(t + 1); o2.stop(t + 1);
      if (i % 4 === 0) {
        const b = audioCtx.createOscillator(), bg = audioCtx.createGain();
        b.type = "triangle"; b.frequency.value = BASS[(i / 4) | 0];
        b.connect(bg); bg.connect(audioCtx.destination);
        bg.gain.setValueAtTime(0.0001, t); bg.gain.exponentialRampToValueAtTime(0.07, t + 0.05);
        bg.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
        b.start(t); b.stop(t + 1.5);
      }
    });
    $$(".tune-state").forEach(s => s.textContent = s.dataset.state === which ? "♪ playing… fingerprint " + tune.fp : "");
    tuneTimer = setTimeout(() => {
      $$(".tune-state").forEach(s => s.textContent = s.dataset.state === which ? "♪ played — fingerprint " + tune.fp + ". " + tune.note : "");
    }, MELODY.length * 420 + 600);
  } catch (e) { toast("Audio is blocked in this browser — but the metadata is the evidence: fingerprint " + tune.fp + "."); }
}

/* ================= downloads (3y3.exe + encrypted .nfo files) ================= */
function downloadFile(key) {
  if (key === "3y3.exe") {
    if (!state.has3y3) { state.has3y3 = true; save(); reconcile3y3Icon(); toast("⬇ Downloaded <b>3y3.exe</b> — it's on your desktop now. Open it to decrypt files."); }
    else toast("3y3.exe is already downloaded.");
    return;
  }
  const FILES = CASE_FILES[saveData.active] || {};
  if (!FILES[key]) { toast("Download failed — file not found."); return; }
  if (!state.downloads) state.downloads = [];
  if (!state.downloads.includes(key)) { state.downloads.push(key); save(); toast("⬇ Downloaded <b>" + esc(key) + "</b> — open 3y3.exe to decrypt it."); }
  else toast("Already downloaded.");
}

/* ================= 3y3.exe desktop icon (Case 3) ================= */
/* In the original nested game, downloading the trainer made a 3y3.exe icon
   appear on the fake Somnius desktop (eye glyph, "3y3.exe") and opening it
   launched the decryptor. In the de-inception the decryptor is a native
   program, so the download must instead plant a REAL shortcut on the
   Windows 94 desktop: a .desktop file in ~/desktop/, written through the
   OS filesystem (window.parent.sys42.fs — the same parent object
   openProgram() uses for apps.launch; os.fs = fs in 42/api/os.js:138).
   The desktop folder watches the file index (42/ui/media/folder.js #watch)
   and re-renders live, so the icon appears without a reload; its grid
   flows column-first (desktop.css: grid-auto-flow: column), so the new
   icon lands in column 1, row 4, right below Case File, and the desktop's
   own untracked-icon handler persists that position into desktop.json5
   (keep() auto-saves mutations). A .desktop with Exec="somnius-decryptor"
   and no Icon= resolves its picture from the Decryptor program's own eye
   icon (getIconFromPath getDesktopFile -> parseExec -> exec.icon), and a
   double-click runs os.exec("somnius-decryptor"). The file lives in the
   IndexedDB-backed virtual FS (driver write() updates the file index and
   stores the content), so it survives a page reload; it is NOT in
   files.cbor — runtime files aren't shipped. Gated on cases[3].has3y3,
   the Case 3 download, never on the active case, so it cannot appear in
   Cases 1/2. */
const DESKTOP_3Y3_PATH = "/c/users/windows93/desktop/3y3.desktop";
const DESKTOP_3Y3_CONTENT = "[Desktop Entry]\nName=\"3y3.exe\"\nExec=\"somnius-decryptor\"\n";
function osFs() {
  try {
    const p = window.parent;
    if (p && p !== window && p.sys42 && p.sys42.fs) return p.sys42.fs;
  } catch (e) {}
  return null;
}
async function remove3y3Icon() {
  const fs = osFs();
  if (!fs) return;
  try { if (await fs.access(DESKTOP_3Y3_PATH)) await fs.delete(DESKTOP_3Y3_PATH); } catch (e) {}
}
/* Make the desktop match the save: icon present iff Case 3 downloaded
   3y3.exe. Idempotent — safe to call from every program on load, and
   after a download or a wipe. */
async function reconcile3y3Icon() {
  const fs = osFs();
  if (!fs) return; /* standalone tab: no desktop to update */
  try {
    const want = !!(saveData.cases[3] && saveData.cases[3].has3y3);
    if (!want) { await remove3y3Icon(); return; }
    let exists = false;
    try { exists = await fs.access(DESKTOP_3Y3_PATH); } catch (e) { exists = false; }
    if (!exists) await fs.writeText(DESKTOP_3Y3_PATH, DESKTOP_3Y3_CONTENT);
  } catch (e) {}
}

/* ================= per-case config: report, case file, intro, home ================= */
const CASE_META = {
  1: { title: "Case 1 — “The Quiet Room”", client: "marbles_4ever, 19", objective: "memorial page <b>angelfeathers</b> (her sister Dani) vanished from Goodtime Valley. Find out who took it down.",
    proves: ["Does the tune-as-evidence mechanic read without a hint?", "Do players find the webring without Search Assist?", "What did 20 pages cost — the real scope document?"] },
  2: { title: "Case 2 — “The Girl Who Drew the Stars”", client: "lunar_latte, 15", objective: "her webcomic <b>Comet Cat</b> is being reposted as someone else's work on a slick Teentopia page called starfactory. She wants her cat back.",
    proves: ["Does multi-zone search still feel like discovery, not a wall?", "Does the zoom-to-reveal signature read like the tune did?", "Does a second victim make the player say “farm” on their own?", "Does putting Hollowell in a report slot land, or does it need a scene?"] },
  3: { title: "Case 3 — “The 3y3 of the Storm”", client: "pixelpete_99, 14", objective: "his older brother <b>DoomDealer</b> was banned from gamerZone for uploading a cracked game. Pete thinks he was framed. Find out what really happened.",
    proves: ["Does a tool-gated case (a decryptor) still feel like reading, not a minigame?", "Does the client being wrong land, or does it feel like a gotcha?", "Does the ethical choice at the end feel like a real choice, or a menu?", "What did 20 pages cost — the real scope document?"] }
};
const REPORTS = {
  1: { title: "File Report — Case 1: The Quiet Room", client: "marbles_4ever",
    s1label: "Who requested the removal?", s1correct: ["angelfeathers", "quietrooms"],
    s1wrong: "Not quite. Who ASKED for the removal — not who carried it out? The 404 and the Mod Log disagree, and one of them is the cover story.",
    s2label: "What proves quietrooms is Dani?", s2correct: ["tune", "design", "guestbook-slip"],
    s2wrong: "That doesn't prove she's the same person. What links the two handles — same song, same signature, same slip?",
    s3label: "Where is she now?", s3kind: "people", s3correct: "quietrooms",
    s3wrong: "She's not there anymore. Where did the webring lead?",
    epilogue: `<p>You told marbles_4ever the truth: Dani asked for the memorial to come down. She is alive, living quietly as quietrooms, hiding from Halberd_77. The tune proved it. The stars proved it. Her friend's slip proved it.</p><p>She doesn't reply for a day. Then: <i>“thank you. i don't know if i'm angry or relieved. i think both.”</i></p><p>Whether telling her was a kindness is left alone. That's the job.</p>` },
  2: { title: "File Report — Case 2: The Girl Who Drew the Stars", client: "lunar_latte",
    s1label: "Who stole “Comet Cat”?", s1correct: ["starfactory"],
    s1wrong: "Not quite. The victim isn't the thief. Who profits from the copies?",
    s2label: "What proves it?", s2correct: ["signature", "misspelling", "timestamps"],
    s2wrong: "That shows something happened — but not who drew it first. What links the art to lunar_latte's hand?",
    s3label: "Who owns starfactory?", s3kind: "entities", s3correct: "hollowell",
    s3wrong: "Follow the money past the page itself. Who is named in the small print?",
    epilogue: `<p>You told lunar_latte the truth: starfactory stole Comet Cat, and Hollowell Media Group owns starfactory. mod_sprocket pulled the stolen pages the same day. She got her name back. starfactory is still up — Hollowell holds the zone's ad contract, and the farm has lawyers.</p><p>She doesn't reply for a day. Then: <i>“thank you. comet cat is mine again. i don't know why that doesn't feel like winning.”</i></p><p>Credit, not justice. That's the job.</p>` },
  3: { title: "File Report — Case 3: The 3y3 of the Storm", client: "pixelpete_99",
    s1label: "Who runs The Null Sector?", s1correct: ["c0de_z", "skullcrusher"],
    s1wrong: "Not quite. The ringleader hides behind two names — one public, one hidden. Who profits from the trainer?",
    s2label: "What proves it?", s2correct: ["audio", "guestbook", "log", "chatlog"],
    s2wrong: "That shows something happened — but not who runs the ring. What links the public gamer to the hidden group?",
    s3label: "What do you do with the evidence?", s3kind: "choice",
    s3choices: [
      { key: "full", label: "Send the full evidence to the gamerZone mods" },
      { key: "fraud", label: "Send only the ban-fraud evidence" },
      { key: "anon", label: "Send the evidence anonymously to pixelpete_99" },
      { key: "delete", label: "Delete the evidence and report “no case”" }
    ],
    s3wrong: "Pick one. There is no right answer — only the one you can live with.",
    epilogues: {
      full: `<p>You sent everything to the gamerZone mods: the chat log, the keygen fingerprint, the guestbook, the forged ban request. c0de_z was banned the same day. DoomDealer's ban was reviewed — and he was banned again, for warez, less severe this time. The ring dissolved. Some innocent members were caught in it.</p><p>Pete doesn't reply for a day. Then: <i>“my brother's home. he's mad at me. he's mad at himself. thank you. i think.”</i></p><p>Clearing his name meant clearing all of it. That's the job.</p>`,
      fraud: `<p>You sent only the ban-fraud evidence: one signature where the rules demand two, a session token used while mod_hex was at a LAN party. c0de_z was banned. DoomDealer was unbanned on probation.</p><p>Pete doesn't reply for a day. Then: <i>“he's back!! he says thank you. he says don't ask him about the other stuff.”</i></p><p>c0de_z's alt accounts survived. The ring is quieter, not gone. You got the brother back, not the justice. That's the job.</p>`,
      anon: `<p>You sent the evidence anonymously to pixelpete_99 — no mods, no names, just the truth in his inbox. He confronted DoomDealer the same night. His brother admitted everything: the cracks, the refusal, the proof he never got to release.</p><p>Pete doesn't reply for a day. Then: <i>“we talked all night. he told me everything. the mods still think he's a pirate. but i know. our family knows.”</i></p><p>c0de_z continues. The zone doesn't know. The family does. That's the job.</p>`,
      delete: `<p>You deleted the evidence and filed “no case.” DoomDealer stays banned. c0de_z continues. The group survives.</p><p>Pete doesn't reply for a day. Then: <i>“u said there was nothing. i know there was something. i don't trust u anymore.”</i></p><p>The quietest outcome, and the most compromised. That's the job.</p>`
    } }
};
const S3_ENTITIES = [
  { key: "hollowell", label: "Hollowell Media Group — the conglomerate", unlockPages: ["starfactory-about", "press-release"] },
  { key: "somnius", label: "Somnius Labs — they built the platform", unlockPages: ["devblog2"] },
  { key: "sprocket", label: "mod_sprocket — the Teentopia moderator", unlockPages: ["modlog2", "sprocket-personal"] },
  { key: "indie", label: "Independent artists — that's what starfactory claims", unlockPages: ["starfactory-about"] }
];
function entityOptions() { return S3_ENTITIES.filter(e => e.unlockPages.some(p => state.visited[p])); }
const DISTRACTORS = {
  1: {
    "poem": { label: "Halberd's poem — proves he's obsessed, not who she is", unlockPage: "halberd-poetry" },
    "modlog": { label: "The Mod Log — proves the removal broke procedure, not who she is", unlockPage: "mod-log" },
    "eulogy": { label: "The eulogy edit — proves someone saw her, not where she is", unlockPage: "eulogy" }
  },
  2: {
    "comparison": { label: "The comparison page — the panels match, but it doesn't say who copied whom", unlockPage: "comparison" },
    "ranking": { label: "The Rising Stars list — starfactory is #1, but popularity isn't proof", unlockPage: "rising-stars" },
    "guestbook-praise": { label: "starfactory's guestbook — fans love it, but fans can be fooled", unlockPage: "starfactory-guestbook" }
  },
  3: {
    "cracks": { label: "The fake game cracks — they prove DoomDealer cracked games, not that he posted the keylogger", unlockPage: "warez-list" },
    "legend": { label: "The clan praise — “doomdealer is a legend” proves he's admired, not what he did", unlockPage: "clan-deathtrap" },
    "surface": { label: "The ModLog entry — on the surface it looks like a clean ban", unlockPage: "modlog3" }
  }
};
function encounteredPeople() { return Object.keys(state.enc).sort((a, b) => state.enc[a] - state.enc[b]); }
function unlockedEvidenceOptions() {
  const opts = [];
  Object.keys(EVIDENCE).forEach(k => { if (state.ev[k]) opts.push({ key: k, label: EVIDENCE[k].label }); });
  const D = DISTRACTORS[saveData.active];
  Object.keys(D).forEach(k => { if (state.visited[D[k].unlockPage]) opts.push({ key: k, label: D[k].label }); });
  return opts;
}
const HINT_TEXT = {
  1: { tier1: "Tier 1 — client follow-up email (no new page for 60s): “did you try her guestbook?”", from: "marbles_4ever" },
  2: { tier1: "Tier 1 — client follow-up email (no new page for 60s): “did you look at the stars?”", from: "lunar_latte" },
  3: { tier1: "Tier 1 — Somnius Labs email (no new page for 60s): “Have you checked the banner ads? Some trainers are not trainers.”", from: "Somnius Labs" }
};
const INTRO = {
  1: { title: "SOMNIUS — Case 1: The Quiet Room",
    body: `<h1>You are a private investigator.</h1><p>Not a moderator. Not an employee. Someone people hire when the platform won't help them.</p><p>Your client is <b>marbles_4ever</b>, 19. Her older sister Dani died eight months ago. Dani's memorial page — <b>angelfeathers</b> — has vanished from Goodtime Valley, and nobody will say why.</p><p>Your only tools are the programs on this desktop: a <b>browser</b>, <b>mail</b>, a <b>notepad</b>, and your ability to notice when two stories don't match.</p><p>Read the case email. Then go looking. When you know the truth, <b>File Report</b> and tell her.</p>` },
  2: { title: "SOMNIUS — Case 2: The Girl Who Drew the Stars",
    body: `<h1>You are a private investigator.</h1><p>Not a moderator. Not an employee. Someone people hire when the platform won't help them.</p><p>Your client is <b>lunar_latte</b>, 15. She draws a webcomic called <b>Comet Cat</b> — one panel a night, after homework. A slick page called <b>starfactory</b> is posting her comic like they drew it, and they're #1 in Teentopia while she's #47.</p><p>New zone, same tools: a <b>browser</b>, <b>mail</b>, a <b>notepad</b>, and your ability to notice when two stories don't match. In Teentopia, the art is the person.</p><p>Read the case email. Then go looking. When you know the truth, <b>File Report</b> and tell her.</p>` },
  3: { title: "SOMNIUS — Case 3: The 3y3 of the Storm",
    body: `<h1>You are a private investigator.</h1><p>Not a moderator. Not an employee. Someone people hire when the platform won't help them.</p><p>Your client is <b>pixelpete_99</b>, 14. His older brother <b>DoomDealer</b> was banned from gamerZone for uploading a cracked game. Pete thinks he was framed. He is wrong about that — and right about something else.</p><p>New zone, same tools: a <b>browser</b>, <b>mail</b>, a <b>notepad</b>, and your ability to notice when two stories don't match. In gamerZone, the ads are not all ads, and some files are not what they say they are. You will need a tool of your own before this one is over.</p><p>Read the case email. Then go looking. When you know the truth, <b>File Report</b> — and decide what the truth is for.</p>` }
};
const HOMES = {
  1: `<div class="pg plain"><h1>Welcome to Somnius</h1><p><i>the internet you visit while you sleep. goodtime valley node. november 2004.</i></p><p>You have <b>1 unread case email</b>. Start there — or start digging.</p><p>📁 <a href="#" data-page="memorial-404">angelfeathers — the missing memorial page</a><br>📁 <a href="#" data-page="fanclub-hub">The Flip-Flop Fan Club</a><br>📁 <a href="#" data-page="zone-rules">Goodtime Valley Zone Rules</a></p><p class="tiny">Tip: use the Directory button for public pages, Search for keywords, and follow links — the webrings go further than the directory does.</p></div>`,
  2: `<div class="pg plain"><h1>Welcome to Somnius</h1><p><i>the internet you visit while you sleep. teentopia node. november 2004.</i></p><p>You have <b>1 unread case email</b>. Start there — or start digging.</p><p>📁 <a href="#" data-page="lunar-home">lunar_latte — the girl who drew the stars</a><br>📁 <a href="#" data-page="comet-hub">COMET CAT — Official Hub</a><br>📁 <a href="#" data-page="starfactory-home">starfactory — the internet's #1 comics network</a></p><p class="tiny">Tip: use the Directory button for public pages, Search for keywords, and follow links — the webrings go further than the directory does.</p></div>`,
  3: `<div class="pg plain"><h1>Welcome to Somnius</h1><p><i>the internet you visit while you sleep. gamerzone node. november 2004.</i></p><p>You have <b>1 unread case email</b>. Start there — or start digging.</p><p>📁 <a href="#" data-page="pete-home">pixelpete_99 — the client</a><br>📁 <a href="#" data-page="cheat-vault">The Cheat Vault</a><br>📁 <a href="#" data-page="skullcrusher">Skullcrusher's Shrine</a></p><p class="tiny">Tip: use the Directory button for public pages, Search for keywords, and follow links — the webrings go further than the directory does. Some files are encrypted .nfo files. The zone's banner ads are not all ads.</p></div>`
};

/* ================= case intro (first launch) ================= */
/* Shown by whichever Somnius program the player opens first — the intro is
   unmissable, and its button takes you straight to the case email in Mail. */
function maybeShowIntro() {
  if (state.seenIntro) return;
  if (document.getElementById("som-intro")) return;
  const cfg = INTRO[saveData.active];
  const wrap = document.createElement("div");
  wrap.id = "som-intro";
  wrap.innerHTML = `<div class="card"><div class="intro-title">${esc(cfg.title)}</div>
    <div class="body">${cfg.body}
    <p><button id="intro-go" style="padding:6px 16px;font-weight:bold">Open the case email →</button></p>
    <p style="color:#666;font-size:11px">Project Sleepwalk: 3 cases, 20 pages per case. Progress saves in this browser, per case. “Reset case” in the Case File program clears it.</p>
    </div></div>`;
  document.body.appendChild(wrap);
  document.getElementById("intro-go").onclick = () => {
    state.seenIntro = true; save();
    wrap.remove();
    if (Somnius.PROGRAM !== "somnius-mail") openProgram("somnius-mail");
  };
}

/* ================= hints: 3 diegetic tiers on the no-new-page timer ================= */
/* The clock only runs while a Somnius program is open (there is no nested
   desktop left to run it). One program owns each second via a localStorage
   leader lock, so two open programs never double-fire a tier. Same tiers,
   texts and thresholds as the nested game: 60 / 150 / 240 seconds idle. */
const HINT_PRIORITY = {
  1: ["webring-hub", "cached-guestbook", "tune", "quietrooms-home", "memorial-directory", "possum-personal"],
  2: ["webring-sketchbook", "comparison", "zoom-panel", "moss-home", "starfactory-about", "press-release"],
  3: ["cheat-vault", "free-gamez", "null-hub", "doom-stash", "modlog3", "skullcrusher"]
};
const HINT_SECONDS = [60, 150, 240];
function firstUnvisitedPriority() { return HINT_PRIORITY[saveData.active].find(id => !state.visited[id]) || ({ 1: "quietrooms-home", 2: "zoom-panel", 3: "null-hub" })[saveData.active]; }
function fireHint(tier) {
  syncFromStorage(); /* re-read: another program may have fired first */
  if (state.hints >= tier) return;
  if (tier === 1) {
    if (!state.mail.includes("m-followup")) state.mail.push("m-followup");
    state.hintLog.push(HINT_TEXT[saveData.active].tier1);
    toast("✉️ New mail from <b>" + esc(HINT_TEXT[saveData.active].from) + "</b> — she remembered something.");
  } else if (tier === 2) {
    const target = firstUnvisitedPriority();
    state.hintLog.push("Tier 2 — Search Assist surfaced an unvisited page: " + byId(target).title);
    toast("🔍 Somnius Search Assist surfaced a related result in the browser.");
    openProgram("somnius-browser", { assist: target });
  } else if (tier === 3) {
    const target = firstUnvisitedPriority();
    if (!state.pins.find(x => x.id === target)) state.pins.push({ id: target, title: byId(target).title + " (pinned by Somnius Assist)" });
    state.hintLog.push("Tier 3 — Notepad auto-pinned: " + byId(target).title);
    toast("📌 Somnius Assist pinned a page to your Notepad.");
  }
  state.hints = tier; save(); refresh();
}
let tickTimer = null;
function startHintClock() {
  if (tickTimer) return;
  /* Leader election: claim this second, wait 100 ms, then re-read the claim.
     The program whose claim survives owns the tick; the other skips it. A
     last-tick guard (<900 ms since the last successful tick) keeps two
     near-simultaneous claims from both counting. Without the delay the
     write-then-read is synchronous and every program always "wins", so the
     idle clock runs 2x with two programs open. */
  tickTimer = setInterval(async () => {
    if (document.hidden) return;
    const now = Date.now();
    let prev = null;
    try { prev = JSON.parse(localStorage.getItem(LS_TICK_KEY)); } catch (e) {}
    if (prev && prev.lastTick && now - prev.lastTick < 900) return; /* ticked <1s ago */
    const token = "t" + now + "-" + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem(LS_TICK_KEY, JSON.stringify({ t: now, by: Somnius.PROGRAM, token, lastTick: prev ? prev.lastTick || 0 : 0 })); } catch (e) { return; }
    await sleep(100);
    let cur = null;
    try { cur = JSON.parse(localStorage.getItem(LS_TICK_KEY)); } catch (e) {}
    if (!cur || cur.token !== token) return; /* another program owns this second */
    if (cur.lastTick && now - cur.lastTick < 900) return; /* a rival ticked meanwhile */
    syncFromStorage();
    if (state.resolved) return;
    state.idle++;
    try { localStorage.setItem(LS_TICK_KEY, JSON.stringify({ t: now, by: Somnius.PROGRAM, token, lastTick: now })); } catch (e) {}
    const clock = document.getElementById("hint-clock");
    if (clock) clock.textContent = "No new pages for " + Math.floor(state.idle / 60) + ":" + String(state.idle % 60).padStart(2, "0");
    if (state.hints < 1 && state.idle >= HINT_SECONDS[0]) fireHint(1);
    else if (state.hints < 2 && state.idle >= HINT_SECONDS[1]) fireHint(2);
    else if (state.hints < 3 && state.idle >= HINT_SECONDS[2]) fireHint(3);
    else save();
  }, 1000);
}

/* The epilogue email: closing a case delivers the client's reply into Mail
   (the epilogue text itself also shows in the File Report's closed view, as
   in the original — the mail is the part the original never sent, added here
   so the result is visible in Mail as well as in the report). */
function epilogueMail() {
  const cfg = REPORTS[saveData.active];
  const epi = cfg.epilogues ? (cfg.epilogues[state.choice] || cfg.epilogues.full) : cfg.epilogue;
  return { id: "m-epilogue", from: cfg.client, subject: "Case closed — thank you",
    date: "Nov 9, 2004", body: stripHtml(epi) };
}

/* ================= shared public API ================= */
window.Somnius = {
  PROGRAM: null,            /* set by each program's app.js, e.g. "somnius-browser" */
  onSync: null,             /* hosting program's re-render hook */
  onCaseChange: null,       /* hosting program's case-switch hook */
  get state() { return state; },
  get saveData() { return saveData; },
  get PAGES() { return PAGES; },
  get PEOPLE() { return PEOPLE; },
  get EVIDENCE() { return EVIDENCE; },
  LS_KEY, ZONE_NAMES, CASE_META, REPORTS, INTRO, HOMES, HINT_SECONDS,
  byId, esc, stripHtml, $, $$, save, syncFromStorage, setCase, encounterPage,
  refresh, openProgram, consumeNav, toast, doReset, playTune, downloadFile,
  maybeShowIntro, startHintClock, fireHint, firstUnvisitedPriority,
  entityOptions, encounteredPeople, unlockedEvidenceOptions, allMail: function () {
    const list = CASE_MAIL[saveData.active].slice();
    if (state.mail.includes("m-followup")) list.push(CASE_FOLLOWUP[saveData.active]);
    if (state.mail.includes("m-epilogue")) list.push(epilogueMail());
    return list;
  },
  /* Wire the cross-program sync: storage events from other programs + focus. */
  initSync: function () {
    window.addEventListener("storage", (e) => {
      if (e.key === LS_KEY) { const changed = syncFromStorage(); if (changed && typeof Somnius.onCaseChange === "function") Somnius.onCaseChange(saveData.active); refresh(); }
      else if (e.key === LS_NAV_KEY) { if (typeof Somnius.onNav === "function") Somnius.onNav(); }
    });
    window.addEventListener("focus", () => {
      const changed = syncFromStorage();
      if (changed && typeof Somnius.onCaseChange === "function") Somnius.onCaseChange(saveData.active);
      refresh();
      if (typeof Somnius.onNav === "function") Somnius.onNav();
    });
  }
};
window.doReset = doReset;

/* Reconcile the 3y3.exe desktop icon with the loaded save on every program
   launch: a returning player who already downloaded it in Case 3 gets the
   icon back on boot, and a stale icon left by a wiped save (?reset=1, or a
   reset in another program) is removed. Runs in every program; idempotent. */
reconcile3y3Icon();
