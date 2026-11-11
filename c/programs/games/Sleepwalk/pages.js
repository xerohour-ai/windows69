/* Project Sleepwalk — Case 1 "The Quiet Room"
   Page CMS: every page is a data file. Fields match the design doc:
   id, title, author, zone, tags, type (stub|standard|hub), costMin,
   hidden (unlisted: reachable only via links, never search/directory),
   dir (directory category), people (encountered on visit),
   links (outbound page ids), body (era-authentic HTML). */
window.SLEEPWALK_PAGES = [
{
  id: "marbles-home", title: "Marbles' Flip-Flop Corner!!", author: "marbles_4ever",
  zone: "Goodtime Valley", tags: ["flip-flop", "personal", "sisters"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["marbles_4ever", "angelfeathers"],
  links: ["fanclub-hub", "memorial-404", "tune"],
  body: `<div class="pg stars">
  <h1>~* Marbles' Flip-Flop Corner!! *~</h1>
  <marquee>welcome to my corner of the internet!! flip-flops forever!!</marquee>
  <p>hi i'm <b>marbles</b>, i'm 19, i collect flip-flops (the shoes AND the sound effect, don't ask) and i run the <a href="#" data-page="fanclub-hub">Flip-Flop Fan Club</a>.</p>
  <p>my big sister <b>dani</b> made this page with me. she did the stars. click the stars. she said the stars are the whole point.</p>
  <p>dani's middle name was <b>mara</b>. she hated it. i loved it. she wrote me a lullaby once and called it <a href="#" data-page="tune">lullaby_for_mara</a>. it was the only song she ever finished.</p>
  <div class="box sad"><b>PLEASE READ:</b> dani's memorial page is <a href="#" data-page="memorial-404">GONE</a>. somebody took it down and nobody will tell me why. if you know anything, email me. please. she was my sister.</div>
  <p class="sig">page designed by marbles_4ever + angelfeathers ★ do not steal our stars</p>
  <p class="tiny">you are visitor #004,812 &nbsp;|&nbsp; best viewed at 800x600 &nbsp;|&nbsp; last updated Mar 19, 2004</p>
  </div>`
},
{
  id: "fanclub-hub", title: "The Flip-Flop Fan Club — Official Hub", author: "marbles_4ever",
  zone: "Goodtime Valley", tags: ["flip-flop", "club", "hub"],
  type: "hub", costMin: 180, hidden: false, dir: "Clubs",
  people: ["marbles_4ever", "Halberd_77", "buttonsandbows"],
  links: ["marbles-home", "halberd-member", "eulogy", "tune"],
  body: `<div class="pg stars">
  <h1>THE FLIP-FLOP FAN CLUB</h1>
  <p><i>est. 2002 &nbsp;|&nbsp; 214 members &nbsp;|&nbsp; flip-flops forever</i></p>
  <p>welcome to the club!! we like flip-flops. we like the sound they make. we like summer. that is the whole club.</p>
  <h2>MEMBERS</h2>
  <ul>
    <li><b>marbles_4ever</b> — founder, president, chief flip-flopper</li>
    <li><a href="#" data-page="eulogy">buttonsandbows</a> — vice president, bows division</li>
    <li><a href="#" data-page="halberd-member">Halberd_77</a> — <span class="hl">member since Mar 24, 2004 ★ NEWEST MEMBER</span></li>
    <li>...and 211 more. full roster in the club binder.</li>
  </ul>
  <h2>TUNE OF THE WEEK</h2>
  <p>our own <a href="#" data-page="tune">lullaby_for_mara</a> — written by angelfeathers for the club. play it loud. play it for dani.</p>
  <p class="sig">hub designed by marbles_4ever ★ flip-flops forever</p>
  <p class="tiny">club rules: 1. be nice. 2. no shoes indoors. 3. flip-flops are shoes and also not shoes. do not argue about rule 3.</p>
  </div>`
},
{
  id: "memorial-404", title: "angelfeathers — Page Removed", author: "Somnius",
  zone: "Goodtime Valley", tags: ["memorial", "removed", "angelfeathers"],
  type: "stub", costMin: 30, hidden: false, dir: "Memorials",
  people: ["angelfeathers", "mod_possum"],
  links: ["cached-guestbook", "kb-removed", "memorial-directory", "zone-rules"],
  body: `<div class="pg plain">
  <h1>This page has been removed.</h1>
  <div class="box warn"><b>Removed by a Zone Moderator</b><br>
  Reason: <b>off-platform contact solicitation</b> (Rule 12)<br>
  Removed: Apr 9, 2004 &nbsp;|&nbsp; Page: <b>angelfeathers</b> — memorial page for Danielle M.</div>
  <p>This page used to be here. It was a memorial page, built by her sister.</p>
  <p>What you can still see:</p>
  <ul>
    <li><a href="#" data-page="cached-guestbook">cached copy of the guestbook</a> (archived Apr 8, 2004)</li>
    <li><a href="#" data-page="memorial-directory">Gone But Online — memorial directory</a></li>
    <li><a href="#" data-page="kb-removed">Why was my page removed?</a></li>
    <li><a href="#" data-page="zone-rules">Goodtime Valley Zone Rules</a></li>
  </ul>
  <p class="tiny">If you believe this removal was a mistake, contact a Zone Moderator. Response time: 6–8 weeks.</p>
  </div>`
},
{
  id: "cached-guestbook", title: "CACHED COPY — angelfeathers guestbook", author: "Somnius Archive",
  zone: "Goodtime Valley", tags: ["guestbook", "cache", "angelfeathers"],
  type: "standard", costMin: 90, hidden: true, dir: "Memorials",
  people: ["buttonsandbows", "Halberd_77", "angelfeathers"],
  links: ["memorial-404", "profile-card"],
  body: `<div class="pg stars">
  <h1>~ guestbook ~ angelfeathers</h1>
  <p class="tiny">CACHED COPY — archived by the Somnius Archive, Apr 8, 2004. This is a snapshot. The live page is gone.</p>
  <div class="gb">
    <p><b>buttonsandbows</b> — Mar 20, 2004<br>miss u dani. i keep coming here to talk to you like you're going to answer. the stars are still up. i can't take them down.</p>
    <p><b>Halberd_77</b> — Mar 28, 2004<br>i know you're reading this. you can't just leave a room and expect the room to stay empty.</p>
    <p><b>guest_441</b> — Apr 1, 2004<br>why does it say she was online yesterday?? she's dead. how is she active?? is this a glitch</p>
    <p><b>guest_902</b> — Apr 2, 2004<br>her profile says last active Apr 2. that's THREE WEEKS after the funeral. somebody explain this to me right now</p>
  </div>
  <p class="tiny">4 entries shown. <a href="#" data-page="profile-card">View angelfeathers' directory profile card</a></p>
  </div>`
},
{
  id: "profile-card", title: "Directory Profile — angelfeathers", author: "Somnius Directory",
  zone: "Goodtime Valley", tags: ["profile", "directory", "angelfeathers"],
  type: "stub", costMin: 30, hidden: false, dir: "People",
  people: ["angelfeathers"],
  links: ["memorial-404", "cached-guestbook"],
  body: `<div class="pg plain">
  <h1>Somnius Directory — Profile Card</h1>
  <table class="card">
    <tr><td>Handle</td><td><b>angelfeathers</b></td></tr>
    <tr><td>Name</td><td>Danielle M. ("Dani")</td></tr>
    <tr><td>Age</td><td>22</td></tr>
    <tr><td>City</td><td>Millbrook</td></tr>
    <tr><td>Member since</td><td>2002</td></tr>
    <tr><td>Zone</td><td>Goodtime Valley</td></tr>
    <tr><td><b>Last active</b></td><td><b class="hl">Apr 2, 2004</b></td></tr>
    <tr><td>Status</td><td>memorialized</td></tr>
  </table>
  <p class="tiny">Dani died Mar 8, 2004. Her funeral was Mar 12, 2004. This card says she was last active <b>Apr 2, 2004 — three weeks after her funeral.</b></p>
  <p><a href="#" data-page="memorial-404">Her memorial page</a> was removed Apr 9, 2004.</p>
  </div>`
},
{
  id: "halberd-home", title: "HAL'S POETRY HOLE", author: "Halberd_77",
  zone: "Goodtime Valley", tags: ["poetry", "halberd"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["Halberd_77", "angelfeathers"],
  links: ["halberd-poetry", "halberd-guestbook", "halberd-member"],
  body: `<div class="pg dark">
  <h1>HAL'S POETRY HOLE</h1>
  <p><i>poems for A.F. — she left without saying goodbye. she'll come back. they always come back to the room.</i></p>
  <p>this is my hole. i write poems here. most of them are for one person. if you are that person: <b>come home.</b></p>
  <ul>
    <li><a href="#" data-page="halberd-poetry">newest poem — "For the Girl Who Left the Room Quiet"</a></li>
    <li><a href="#" data-page="halberd-guestbook">guestbook</a> (sign it. she reads it. i know she does.)</li>
    <li><a href="#" data-page="halberd-member">my Flip-Flop Fan Club member page</a></li>
  </ul>
  <p class="tiny">you are visitor #000,066 &nbsp;|&nbsp; do not steal my poems &nbsp;|&nbsp; do not email me about her</p>
  </div>`
},
{
  id: "halberd-poetry", title: "For the Girl Who Left the Room Quiet", author: "Halberd_77",
  zone: "Goodtime Valley", tags: ["poetry", "halberd"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["Halberd_77"],
  links: ["halberd-home", "halberd-guestbook"],
  body: `<div class="pg dark">
  <h1>For the Girl Who Left the Room Quiet</h1>
  <p class="poem">You think a locked door stops me.<br>
  I know every hallway in this house.<br>
  I know the sound your footsteps make<br>
  when you think nobody is listening.<br><br>
  You can change your name.<br>
  You can paint the walls a different blue.<br>
  The room is still the room.<br>
  I am still standing in it.</p>
  <p class="tiny">written Mar 26, 2004. for A.F. — come home.</p>
  <p><a href="#" data-page="halberd-home">back to the hole</a></p>
  </div>`
}
];
window.SLEEPWALK_PAGES.push(
{
  id: "halberd-guestbook", title: "guestbook — HAL'S POETRY HOLE", author: "Halberd_77",
  zone: "Goodtime Valley", tags: ["guestbook", "halberd"],
  type: "stub", costMin: 30, hidden: false, dir: "People",
  people: ["Halberd_77", "angelfeathers"],
  links: ["halberd-home", "halberd-poetry"],
  body: `<div class="pg dark">
  <h1>~ guestbook ~</h1>
  <div class="gb">
    <p><b>angelfeathers</b> — Feb 14, 2004<br>your poems are getting scary hal. in a good way? call me.</p>
    <p><b>angelfeathers</b> — Feb 27, 2004<br>please stop writing poems about my bedroom window. i mean it this time.</p>
    <p><b>guest_12</b> — Mar 30, 2004<br>dude. she's gone. stop writing to her.</p>
  </div>
  <p class="tiny">Dani's last entry here is Feb 27, 2004. Nothing from her after Mar 8 — the day she died. Or the day she stopped being Dani.</p>
  <p><a href="#" data-page="halberd-home">back to the hole</a></p>
  </div>`
},
{
  id: "zone-rules", title: "Goodtime Valley Zone Rules", author: "mod_possum",
  zone: "Goodtime Valley", tags: ["rules", "moderation", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: ["mod_possum"],
  links: ["mod-log", "kb-removed", "memorial-404"],
  body: `<div class="pg plain">
  <h1>Goodtime Valley — Zone Rules</h1>
  <p class="tiny">Posted by mod_possum, Zone Moderator. Last updated Jan 2004.</p>
  <h2>Rule 7 — Memorial pages</h2>
  <p>A memorial page may be removed <b>only at the request of the account holder</b>, and only with <b>two moderator sign-offs</b>. A memorial is not a regular page. Treat it like a headstone.</p>
  <h2>Rule 12 — Off-platform contact solicitation</h2>
  <p>Pages that solicit contact outside Somnius may be removed. A solicitation removal requires <b>attached evidence</b> and a <b>second moderator's signature</b>. No evidence, no removal.</p>
  <h2>Rule 1 — Be nice</h2>
  <p>Goodtime Valley is the family-friendly zone. Be nice. That's the rule. That's the whole rule.</p>
  <p>See also: <a href="#" data-page="mod-log">the public Mod Log</a> &nbsp;|&nbsp; <a href="#" data-page="kb-removed">Why was my page removed?</a></p>
  </div>`
},
{
  id: "mod-log", title: "Mod Log — Goodtime Valley (Public)", author: "mod_possum",
  zone: "Goodtime Valley", tags: ["mod log", "moderation", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: ["mod_possum", "angelfeathers"],
  links: ["zone-rules", "memorial-404", "possum-personal"],
  body: `<div class="pg plain">
  <h1>Mod Log — Goodtime Valley</h1>
  <p class="tiny">Public record. Every removal, every signature. If it isn't in the log, it didn't happen.</p>
  <table class="card">
    <tr><td><b>Apr 9, 2004</b></td><td><b class="hl">angelfeathers — REMOVED.</b><br>Reason: <b>owner request — account closure.</b><br>Signed: mod_possum (1 of 2 required). Second signature: <b>— none —</b><br>Evidence attached: <b>none.</b></td></tr>
    <tr><td>Apr 2, 2004</td><td>spam_page_88 — REMOVED. Reason: spam. Signed: mod_possum, mod_wren. Evidence: 14 identical posts.</td></tr>
    <tr><td>Mar 19, 2004</td><td>coolpics4u — REMOVED. Reason: solicitation. Signed: mod_possum, mod_wren. Evidence: screenshot, 3 user reports.</td></tr>
  </table>
  <p>The other removals have two signatures and evidence attached. The angelfeathers removal has <b>one signature, no evidence</b> — and a completely different reason from the one on <a href="#" data-page="memorial-404">the removal notice itself</a>, which says "off-platform contact solicitation."</p>
  <p class="tiny">Log kept by <a href="#" data-page="possum-personal">mod_possum</a>.</p>
  </div>`
},
{
  id: "webring-hub", title: "The Quiet Room Webring", author: "static-bloom",
  zone: "Goodtime Valley", tags: ["webring", "quiet room", "hub"],
  type: "hub", costMin: 180, hidden: false, dir: "Clubs",
  people: ["quietrooms"],
  links: ["quietrooms-home", "marbles-home"],
  body: `<div class="pg quiet">
  <h1>The Quiet Room Webring</h1>
  <p><i>pages for people who like it quiet. no shouting. no flashing. just rooms, and the people in them.</i></p>
  <p>All member pages share the Quiet Room starter kit — a star-tile background, blue links, and the credit line at the bottom of the page. If you see the stars, you're in the right place.</p>
  <h2>MEMBERS</h2>
  <ul>
    <li><a href="#" data-page="quietrooms-home">quietrooms</a> — <span class="hl">newest member, joined Apr 3, 2004</span></li>
    <li>the-quiet-garden — a garden that never grows, on purpose</li>
    <li>static-bloom — tv static, but flowers</li>
    <li>room-with-a-window — the window is painted on. it still helps.</li>
  </ul>
  <p class="tiny">webring nav: &lt; previous &nbsp;|&nbsp; random &nbsp;|&nbsp; next &gt; &nbsp;|&nbsp; list all 41 members</p>
  <p class="tiny">ring founded 2003. 41 members. one rule: keep it quiet.</p>
  </div>`
},
{
  id: "quietrooms-home", title: "quietrooms — the quiet room", author: "quietrooms",
  zone: "Goodtime Valley", tags: ["quiet room", "personal"],
  type: "standard", costMin: 90, hidden: true, dir: "People",
  people: ["quietrooms", "angelfeathers"],
  links: ["quietrooms-guestbook", "tune", "webring-hub"],
  body: `<div class="pg stars">
  <h1>the quiet room</h1>
  <p>i like the quiet room. nobody knocks here.</p>
  <p>i moved in april. new name, new city, same stars. the stars were the only thing i kept. the stars are the whole point.</p>
  <p>things i do in the quiet room:</p>
  <ul>
    <li>listen to the rain (there is no rain. i imagine it.)</li>
    <li>play my tune. <a href="#" data-page="tune">lullaby_for_mara</a>. it is the only song i ever finished.</li>
    <li>do not answer the door.</li>
  </ul>
  <p class="tiny">age: 24 &nbsp;|&nbsp; city: Nowhere, OK &nbsp;|&nbsp; member since: Apr 3, 2004</p>
  <p><a href="#" data-page="quietrooms-guestbook">guestbook</a> &nbsp;|&nbsp; <a href="#" data-page="webring-hub">the webring</a></p>
  <p class="sig">this page was designed by angelfeathers ★ do not steal my stars</p>
  </div>`
},
{
  id: "quietrooms-guestbook", title: "guestbook — quietrooms", author: "quietrooms",
  zone: "Goodtime Valley", tags: ["guestbook", "quiet room"],
  type: "stub", costMin: 30, hidden: true, dir: "People",
  people: ["quietrooms", "buttonsandbows"],
  links: ["quietrooms-home"],
  body: `<div class="pg stars">
  <h1>~ guestbook ~ the quiet room</h1>
  <div class="gb">
    <p><b>buttonsandbows</b> — Apr 20, 2004<br><span class="hl">hey Dani, found you.</span> don't worry, i won't tell. — b.</p>
    <p><b>guest_77</b> — Apr 22, 2004<br>love the stars! who designed this?</p>
    <p><b>quietrooms</b> — Apr 22, 2004<br>a friend. she's gone now.</p>
  </div>
  <p class="tiny">One entry calls her "Dani." She replied like it was nothing. It wasn't nothing.</p>
  <p><a href="#" data-page="quietrooms-home">back to the quiet room</a></p>
  </div>`
},
{
  id: "tune", title: "lullaby_for_mara.mp3 — Somnius Tunes", author: "Somnius Tunes",
  zone: "Goodtime Valley", tags: ["tune", "music", "evidence"],
  type: "standard", costMin: 90, hidden: false, dir: "Clubs",
  people: ["angelfeathers", "quietrooms"],
  links: ["marbles-home", "fanclub-hub", "quietrooms-home"],
  body: `<div class="pg plain">
  <h1>Somnius Tunes — track page</h1>
  <h2>lullaby_for_mara.mp3</h2>
  <p>A music-box lullaby. Soft. A little sad. The kind of song you write for one person and never play for anyone else.</p>
  <div class="box">
    <b>Upload 1</b> — by <b>angelfeathers</b>, Feb 14, 2004<br>
    Audio ID: <b>QR-7712</b> &nbsp;|&nbsp; Length: 0:42 &nbsp;|&nbsp; Plays: 1,204<br>
    <button class="tune-btn" data-tune="1">▶ PLAY</button> <span class="tune-state" data-state="1"></span>
  </div>
  <div class="box">
    <b>Upload 2</b> — by <b>quietrooms</b>, Apr 3, 2004<br>
    Audio ID: <b>QR-7712</b> &nbsp;|&nbsp; Length: 0:42 &nbsp;|&nbsp; Plays: 17<br>
    <button class="tune-btn" data-tune="2">▶ PLAY</button> <span class="tune-state" data-state="2"></span>
  </div>
  <p class="tiny">Somnius audio fingerprint: <b>QR-7712</b> — this fingerprint matches <b>2 uploads</b> on Somnius. Two handles. One song. One fingerprint never lies.</p>
  <p class="tiny">Same audio ID. Same length. Same song — uploaded two months apart, under two different names.</p>
  </div>`
}
);
window.SLEEPWALK_PAGES.push(
{
  id: "halberd-member", title: "Flip-Flop Fan Club — Member: Halberd_77", author: "marbles_4ever",
  zone: "Goodtime Valley", tags: ["flip-flop", "club", "halberd"],
  type: "stub", costMin: 30, hidden: false, dir: "Clubs",
  people: ["Halberd_77"],
  links: ["fanclub-hub", "halberd-home"],
  body: `<div class="pg stars">
  <h1>MEMBER CARD — Halberd_77</h1>
  <table class="card">
    <tr><td>Handle</td><td><b>Halberd_77</b></td></tr>
    <tr><td>Member since</td><td><b class="hl">Mar 24, 2004</b></td></tr>
    <tr><td>Favorite flip-flop</td><td>the left one. hers.</td></tr>
    <tr><td>Club role</td><td>member (probationary — see rule 1, be nice)</td></tr>
  </table>
  <p class="tiny">He joined the club <b>the week Dani stopped posting</b>. Her last homepage update was Mar 19, 2004. He joined Mar 24 — five days later — to a club run by her little sister, about a joke only the two of them would get.</p>
  <p><a href="#" data-page="fanclub-hub">back to the hub</a></p>
  </div>`
},
{
  id: "memorial-directory", title: "Gone But Online — Memorial Directory", author: "Gone But Online",
  zone: "Goodtime Valley", tags: ["memorial", "directory", "hub"],
  type: "hub", costMin: 180, hidden: false, dir: "Memorials",
  people: ["angelfeathers"],
  links: ["memorial-404", "zone-rules", "mod-log", "dev-blog"],
  body: `<div class="pg plain">
  <h1>Gone But Online</h1>
  <p><i>a directory of memorial pages, kept by volunteers. a page is a headstone. a headstone should not move.</i></p>
  <ul>
    <li><b>angelfeathers</b> — memorial for Danielle M. &nbsp;<span class="hl">REMOVAL DISPUTED — family contests the reason.</span> <a href="#" data-page="memorial-404">See the removal notice</a> · <a href="#" data-page="mod-log">See the Mod Log</a></li>
    <li>paperlanterns — memorial for Old Tom. intact since 2002.</li>
    <li>softstatic — memorial for June. intact since 2003.</li>
    <li>...and 58 more. all intact. all except one.</li>
  </ul>
  <p>How removal is supposed to work, per <a href="#" data-page="dev-blog">Somnius Labs</a>: only the account holder can request it, and it takes two moderators. This is the only disputed removal in the directory's history.</p>
  </div>`
},
{
  id: "eulogy", title: "For Dani — a eulogy by buttonsandbows", author: "buttonsandbows",
  zone: "Goodtime Valley", tags: ["eulogy", "memorial"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["buttonsandbows", "angelfeathers"],
  links: ["fanclub-hub", "memorial-404"],
  body: `<div class="pg plain">
  <h1>For Dani</h1>
  <p class="tiny">Posted Mar 15, 2004 by buttonsandbows. <span class="hl">EDITED Apr 5, 2004 — 1 line added.</span></p>
  <p>dani taught me how to make a webpage. she said: pick a background you love and then never change it. hers was stars. mine is bows. she said the page is the person, and if you get the page right, the person is never really gone.</p>
  <p>i don't know what to do with that now. the page is gone. so where does that leave her?</p>
  <p class="hl">wait. I saw her.</p>
  <div class="box">
    <b>Edit history</b><br>
    Mar 15, 2004 (original): ends at "...so where does that leave her?"<br>
    Apr 5, 2004 (edit): one line added — <i>"wait. I saw her."</i> Nothing else changed. No explanation. She never edited it again.
  </div>
  <p class="tiny">She saw her. Three weeks after the funeral, and four days before the memorial page was deleted.</p>
  </div>`
},
{
  id: "dev-blog", title: "Somnius Labs Dev Blog — How memorialization works", author: "Somnius Labs",
  zone: "Goodtime Valley", tags: ["dev blog", "memorial", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: [],
  links: ["memorial-directory", "zone-rules"],
  body: `<div class="pg plain">
  <h1>Somnius Labs Dev Blog</h1>
  <h2>How memorialization works</h2>
  <p class="tiny">Posted Jan 2004 by the Somnius Labs team.</p>
  <p>When a user dies, their pages become memorials. We built it this way on purpose: a memorial is not a regular page, and it should be almost impossible to delete one by accident — or on purpose, by someone who isn't the person it belongs to.</p>
  <p><b>Only the account holder can request removal of a memorial.</b> Not family. Not friends. Not a moderator acting alone. The account holder, and two moderators to sign it.</p>
  <p>We never remove a memorial on solicitation grounds alone. That rule exists because grief makes people report each other, and a grieving family should never lose the only place they have left to visit.</p>
  <p class="tiny">— the Somnius Labs team. Somnius Labs built Somnius. We still believe in the stars.</p>
  </div>`
},
{
  id: "kb-removed", title: "KB: Why was my page removed?", author: "Somnius Help",
  zone: "Goodtime Valley", tags: ["help", "removal", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: [],
  links: ["zone-rules", "memorial-404"],
  body: `<div class="pg plain">
  <h1>Why was my page removed?</h1>
  <p class="tiny">Somnius Help Center · Knowledge Base article #114</p>
  <p>Pages are removed for three reasons: spam, solicitation, or an owner request.</p>
  <h2>Solicitation removals</h2>
  <p>A solicitation removal requires <b>attached evidence</b> and a <b>second moderator's signature</b>. If your page was removed for solicitation and no evidence is listed on the removal notice, contact the Zone Moderator — the removal may not have followed procedure.</p>
  <h2>Owner-request removals</h2>
  <p>Only the account holder can request removal of their own page. For memorial pages, see Rule 7: two moderator sign-offs are required.</p>
  <p class="tiny">Still confused? Read the <a href="#" data-page="zone-rules">Zone Rules</a>. Still confused after that? Email a moderator and wait 6–8 weeks.</p>
  </div>`
},
{
  id: "possum-personal", title: "possum's page (do not steal my possums)", author: "mod_possum",
  zone: "Goodtime Valley", tags: ["personal", "moderator"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["mod_possum", "angelfeathers"],
  links: ["mod-log", "zone-rules"],
  body: `<div class="pg possum">
  <h1>possum's page</h1>
  <p><i>( opossum ascii art would go here. imagine a small sad possum. he is doing his best. )</i></p>
  <p>hi. i'm possum. i moderate goodtime valley. that's 400 pages a day. i read every report. i am very tired. i love this zone. i love the people in it. that is why i am tired.</p>
  <p>sometimes i delete the wrong thing and i can't undo it. i keep a list.</p>
  <div class="box">
    <b>pages i wish i could undelete:</b>
    <ol>
      <li>coolpics4u — it was spam. i don't wish that one. ignore that one.</li>
      <li><span class="hl">angelfeathers — she asked me to. don't tell her sister yet. she wasn't ready.</span></li>
    </ol>
  </div>
  <p class="tiny">if you're reading this because you're looking into angelfeathers: she asked me. that is all i can say. she asked me, and i did it, and i filed it wrong on purpose so nobody would come looking. i'm sorry. i did what she asked.</p>
  <p class="sig">page designed by mod_possum ★ possums forever</p>
  </div>`
}
);

/* People registry: display names for the report pickers. */
window.SLEEPWALK_PEOPLE = {
  "marbles_4ever": "marbles_4ever — the client, 19, runs the Flip-Flop Fan Club",
  "angelfeathers": "angelfeathers — Dani, the 'dead' sister",
  "quietrooms": "quietrooms — new user in the Quiet Room Webring",
  "Halberd_77": "Halberd_77 — Dani's ex, writes poems about her",
  "buttonsandbows": "buttonsandbows — Dani's friend, wrote the eulogy",
  "mod_possum": "mod_possum — Goodtime Valley moderator"
};

/* Identity evidence: unlocked by visiting the named page. Any ONE proves identity. */
window.SLEEPWALK_EVIDENCE = {
  "tune": { label: "The tune — same audio ID (QR-7712) under both handles", unlockPage: "tune" },
  "design": { label: "The “designed by” credit — angelfeathers' signature on quietrooms' page", unlockPage: "quietrooms-home" },
  "guestbook-slip": { label: "The guestbook slip — “hey Dani, found you.”", unlockPage: "quietrooms-guestbook" }
};

/* Mail: the case brief, the welcome note, and the Tier 1 follow-up (arrives on the stuck timer). */
window.SLEEPWALK_MAIL = [
  { id: "m-case", from: "marbles_4ever", subject: "my sister's page is gone. can you help?", date: "Nov 8, 2004",
    body: `hi. i don't know if you take cases like this. my big sister dani died eight months ago. her memorial page was called angelfeathers and it was in goodtime valley and now it's GONE. the page just says "removed by zone moderator" and nobody will tell me why.\n\nher page was the only place i had left to visit her. please find out who took it down.\n\n— marbles\n\np.s. her handle was angelfeathers. start there. that's all i know.` },
  { id: "m-welcome", from: "Somnius Labs", subject: "Welcome to Somnius, investigator", date: "Nov 8, 2004",
    body: `You asked for access. You have it.\n\nSomnius is a shared dream-internet. People build pages here while they sleep. Goodtime Valley is the family-friendly zone — start there.\n\nA word of advice from the people who built this place: a page is a person. Read the page, and you're reading the person. The directory will only get you so far. The webrings go further.\n\n— Somnius Labs` }
];
window.SLEEPWALK_FOLLOWUP = { id: "m-followup", from: "marbles_4ever", subject: "re: my sister's page is gone. can you help?", date: "today",
  body: `hey, it's me again. i know you're looking. i just keep thinking about one thing.\n\ndid you try her guestbook? the one on the memorial page, before it went down. people wrote in it AFTER. after she died, i mean. i saw it once and i didn't understand it and now i can't stop thinking about it.\n\nthe guestbook. try the guestbook.\n\n— marbles` };
