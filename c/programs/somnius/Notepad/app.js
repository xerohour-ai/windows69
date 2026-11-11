"use strict";
/* Somnius Notepad — a native Windows 94 program. The player's notes plus
   pinned pages. Clicking a pin opens the page in the Somnius Browser. */
Somnius.PROGRAM = "somnius-notepad";
const S = Somnius;

function renderNotepad() {
  const state = S.state;
  const ta = $("#notes");
  if (document.activeElement !== ta) ta.value = state.notes || "";
  const pins = $("#pins");
  pins.innerHTML = state.pins.length ? state.pins.map(pin => `<div class="pin">📌 <a href="#" data-pin="${pin.id}">${S.esc(pin.title)}</a></div>`).join("") : `<i>Nothing pinned yet. Use “📌 Pin to Notepad” in the browser.</i>`;
  pins.querySelectorAll("[data-pin]").forEach(a => a.onclick = e => {
    e.preventDefault();
    S.openProgram("somnius-browser", { page: a.dataset.pin });
  });
}
$("#notes").addEventListener("input", e => { S.state.notes = e.target.value; S.save(); });

Somnius.onSync = renderNotepad;
Somnius.onCaseChange = renderNotepad;

renderNotepad();
S.initSync();
S.maybeShowIntro();
S.startHintClock();
