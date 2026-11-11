"use strict";
/* 3y3.exe — a native Windows 94 program. The Null Sector decryptor (Case 3):
   blinking ASCII eye, passphrase "look closer", decrypts the 4 .nfo files.
   The layer-2 file needs the audio key from Skullcrusher's shrine theme. */
Somnius.PROGRAM = "somnius-decryptor";
const S = Somnius;
const $ = S.$;

const EYE_OPEN = "   .-~~~-.\n  /  o o  \\\n |    ^    |\n  \\  ___  /\n   '-----'\n  3y3 is watching.";
const EYE_SHUT = "   .-~~~-.\n  /  - -  \\\n |    ^    |\n  \\  ___  /\n   '-----'\n  3y3 is watching.";
let dlPass = "";

function filesSignature() {
  const state = S.state;
  return JSON.stringify({ d: state.downloads || [], x: state.decrypted || {}, a: !!state.audioKey, h: !!state.has3y3 });
}
let lastSig = null;

function renderDecryptor() {
  const body = $("#decryptor-body");
  const state = S.state;
  const FILES = { 3: window.SLEEPWALK_FILES3 }[S.saveData.active] || {};
  if (!state.downloads) state.downloads = [];
  if (!state.decrypted) state.decrypted = {};
  const rows = state.downloads.length ? state.downloads.map(k => {
    const f = FILES[k]; if (!f) return "";
    const done = !!state.decrypted[k];
    const needsAudio = f.layer === 2 && !state.audioKey;
    const status = done ? "✓ decrypted" : needsAudio ? "⚠ layer 2 — audio key required" : "🔒 encrypted";
    return `<label class="file-row"><input type="radio" name="dl-file" value="${S.esc(k)}"> <b>${S.esc(f.title)}</b> — ${status}</label>`;
  }).join("") : `<i>No encrypted files downloaded yet. Find .nfo files in the zone — the banner ads are a good place to start.</i>`;
  body.innerHTML = `<pre id="eye-art">${EYE_OPEN}</pre>
  <p><b>3y3.exe — Null Sector Decryptor</b><br><span style="color:#666">Status: shareware. register to remove this eye.</span></p>
  <p>Passphrase: <input type="text" id="dl-pass" value="${S.esc(dlPass)}" placeholder="look closer…" style="width:180px"> <button id="btn-decrypt" style="padding:4px 14px;font-weight:bold">Decrypt selected</button></p>
  <div>${rows}</div>
  <div id="dl-status" style="margin-top:6px;font-weight:bold"></div>
  <pre id="decrypt-out">decrypted output appears here.</pre>`;
  $("#dl-pass").addEventListener("input", e => { dlPass = e.target.value; });
  $("#btn-decrypt").onclick = doDecrypt;
  if (state.audioKey) { const st = $("#dl-status"); if (st) st.textContent = "🎵 audio key detected — QR-9931"; }
}
function doDecrypt() {
  const sel = document.querySelector('input[name=dl-file]:checked');
  const out = $("#decrypt-out"), st = $("#dl-status");
  const FILES = { 3: window.SLEEPWALK_FILES3 }[S.saveData.active] || {};
  const state = S.state;
  if (!sel) { st.textContent = "Select a file first."; return; }
  const f = FILES[sel.value]; if (!f) { st.textContent = "File not found."; return; }
  const pass = (dlPass || "").toLowerCase().replace(/\s+/g, "");
  if (pass !== "lookcloser") { st.textContent = "✗ wrong passphrase. the eye blinks."; return; }
  if (f.layer === 2 && !state.audioKey) {
    out.textContent = "⚠ file corrupted — bad sectors.\n\n3y3.exe: audio key required.\n(a corrupted file is not always corrupted. sometimes it is waiting for a song.)";
    st.textContent = "⚠ Decryption failed — layer 2 needs the audio key.";
    return;
  }
  if (!state.decrypted) state.decrypted = {};
  state.decrypted[sel.value] = true;
  state.ev[f.evidence] = Date.now();
  S.save();
  S.toast("✅ Decrypted <b>" + S.esc(f.title) + "</b> — evidence logged.");
  renderDecryptor(); /* refresh the file list so this file flips to ✓ decrypted */
  $("#decrypt-out").textContent = f.content;
  $("#dl-status").textContent = "✓ Decrypted — evidence logged.";
  const radio = document.querySelector('input[name=dl-file][value="' + sel.value + '"]');
  if (radio) radio.checked = true;
  lastSig = filesSignature();
}
/* The eye blinks, on a slow timer, while this program is open. */
setInterval(() => {
  const eye = document.getElementById("eye-art");
  if (eye) eye.textContent = eye.textContent === EYE_OPEN ? EYE_SHUT : EYE_OPEN;
}, 2800);

Somnius.onSync = function () {
  const sig = filesSignature();
  if (sig !== lastSig) { lastSig = sig; renderDecryptor(); }
};
Somnius.onCaseChange = function () { lastSig = null; renderDecryptor(); };

lastSig = filesSignature();
renderDecryptor();
S.initSync();
S.maybeShowIntro();
S.startHintClock();
