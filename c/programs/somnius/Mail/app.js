"use strict";
/* Somnius Mail — a native Windows 94 program. The case mailbox, reading
   pane, and unread counts. Hint emails (Tier 1) arrive here. */
Somnius.PROGRAM = "somnius-mail";
const S = Somnius;

function renderMail() {
  const list = $("#mail-list"); list.innerHTML = "";
  const state = S.state;
  S.allMail().forEach(m => {
    const d = document.createElement("div");
    d.className = "mail-item" + (state.read[m.id] ? "" : " unread");
    d.innerHTML = `<span class="mdate">${S.esc(m.date)}</span><b>${S.esc(m.from)}</b> — ${S.esc(m.subject)}`;
    d.onclick = () => { state.read[m.id] = true; S.save(); $("#mail-read").textContent = m.from + " — " + m.subject + "\n" + m.date + "\n\n" + m.body; renderMail(); };
    list.appendChild(d);
  });
  const unread = S.allMail().filter(m => !state.read[m.id]).length;
  $("#mail-count").textContent = unread ? unread + " unread" : "all read";
}
function openMessage(id) {
  const m = S.allMail().find(x => x.id === id);
  if (!m) return;
  S.state.read[m.id] = true; S.save();
  $("#mail-read").textContent = m.from + " — " + m.subject + "\n" + m.date + "\n\n" + m.body;
  renderMail();
}
function handleNav() {
  const navReq = S.consumeNav();
  if (!navReq) return;
  if (navReq.mail) openMessage(navReq.mail);
}

Somnius.onSync = renderMail;
Somnius.onCaseChange = function () {
  $("#mail-read").innerHTML = "<i>Select a message to read it.</i>";
  renderMail();
};
Somnius.onNav = handleNav;

renderMail();
handleNav();
S.initSync();
S.maybeShowIntro();
S.startHintClock();
