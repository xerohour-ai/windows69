/* Project Sleepwalk — Case 2 "The Girl Who Drew the Stars"
   Same CMS shape as Case 1 (pages.js): id, title, author, zone, tags,
   type (stub|standard|hub), costMin, hidden, dir, people, links, body.
   Zone: Teentopia. Search/directory scope per case in the slice; in the
   full game unlocked zones accumulate in search. */
window.SLEEPWALK_PAGES2 = [
{
  id: "lunar-home", title: "lunar_latte's corner of the internet", author: "lunar_latte",
  zone: "Teentopia", tags: ["comics", "comet cat", "personal"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["lunar_latte"],
  links: ["comet-hub", "lunar-guestbook", "sketchbook"],
  body: `<div class="pg teen">
  <h1>~* lunar_latte's corner *~</h1>
  <marquee>comet cat delivers lost things to people in their dreams!! new panel every night!!</marquee>
  <p>hi i'm <b>lunar</b>, i'm 15, i draw a comic called <a href="#" data-page="comet-hub">COMET CAT</a> in ms paint, one panel a night, after homework. it's about a cat who delivers lost things to people in their dreams. the cat is small and the universe is big and that's the whole comic.</p>
  <p>i draw everything myself. every star, every whisker. if you see my cat somewhere that isn't here, <b>please tell me</b>. three people this week asked if i sold comet cat to starfactory. i didn't. i don't know who they are.</p>
  <p>my <a href="#" data-page="sketchbook">sketchbook</a> has the early drawings, with dates. dates matter. remember the dates.</p>
  <p class="sig">page designed by lunar_latte ★ do not steal my cat</p>
  <p class="tiny">you are visitor #000,913 &nbsp;|&nbsp; best viewed at 800x600 &nbsp;|&nbsp; last updated Nov 10, 2004</p>
  </div>`
},
{
  id: "comet-hub", title: "COMET CAT — Official Hub", author: "lunar_latte",
  zone: "Teentopia", tags: ["comics", "comet cat", "hub"],
  type: "hub", costMin: 180, hidden: false, dir: "Clubs",
  people: ["lunar_latte"],
  links: ["lunar-home", "sketchbook", "lunar-guestbook"],
  body: `<div class="pg teen">
  <h1>COMET CAT</h1>
  <p><i>a comic about a small cat, a big universe, and the things people lose in their sleep. by lunar_latte. only by lunar_latte.</i></p>
  <h2>EPISODES</h2>
  <ul>
    <li>Ep 1 — "The Lost Key" (Jan 9, 2004) — the first one. drawn in study hall.</li>
    <li>Ep 2 — "The Left Sock" (Jan 16, 2004)</li>
    <li>Ep 3 — "The Library Card" (Jan 23, 2004)</li>
    <li>Ep 4 — "The Star That Fell Twice" (Jan 30, 2004) — the stars in this one took forever. look at the stars.</li>
    <li>...and 40 more. one a week, every week, since january.</li>
  </ul>
  <h2>FAN MAIL</h2>
  <p>"3 people this week asked if I sold Comet Cat to starfactory. I didn't sell it. I wouldn't sell my cat." — lunar, Nov 2004</p>
  <p><a href="#" data-page="sketchbook">sketchbook — how comet cat was born</a> &nbsp;|&nbsp; <a href="#" data-page="lunar-guestbook">guestbook</a></p>
  <p class="tiny">comet cat (c) 2004 lunar_latte. the cat is mine. the stars are mine. the misspellings are also mine, do not fix them.</p>
  </div>`
},
{
  id: "starfactory-home", title: "starfactory — the internet's #1 comics network", author: "starfactory",
  zone: "Teentopia", tags: ["comics", "network", "starfactory"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["starfactory"],
  links: ["starfactory-comic", "starfactory-about", "starfactory-guestbook"],
  body: `<div class="pg corp">
  <h1>★ STARFACTORY ★</h1>
  <p><i>the internet's #1 comics network. new comics every day. our artists work around the clock to bring you the best of the teen internet.</i></p>
  <p>welcome to starfactory! we are a network of independent artists (meet them on our <a href="#" data-page="starfactory-about">about page</a>!) and we publish the hottest comics on Somnius, including our smash hit original series:</p>
  <p><b><a href="#" data-page="starfactory-comic">COMET CAT — by starfactory™</a></b></p>
  <p>our comics are 100% original and 100% ours. any resemblance to comics by other creators is purely coincidental and also flattering.</p>
  <p><a href="#" data-page="starfactory-guestbook">guestbook</a> — our fans love us! (moderated for positivity)</p>
  <p class="tiny">© 2004 starfactory network. all rights reserved. all comics reserved. all cats reserved.</p>
  </div>`
},
{
  id: "starfactory-comic", title: "COMET CAT — by starfactory™", author: "starfactory",
  zone: "Teentopia", tags: ["comics", "comet cat", "starfactory"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["starfactory"],
  links: ["starfactory-home", "comparison"],
  body: `<div class="pg corp">
  <h1>COMET CAT</h1>
  <p class="tiny">by starfactory™ &nbsp;|&nbsp; first published Feb 14, 2004 &nbsp;|&nbsp; "an original starfactory creation"</p>
  <p><i>Episode 1 — "The Lost Key": a small cat finds a lost key in the dark and delivers it to a sleeping girl. the girl wakes up smiling. the cat is small and the universe is big.</i></p>
  <p>narration, panel 3: "the cat knew the key was definately lost, and definately worth finding."</p>
  <p>our artists drew every star by hand. every whisker. it took our whole team weeks. (it did not take weeks. it took a download.)</p>
  <p><a href="#" data-page="comparison">someone made a comparison page. we do not like the comparison page.</a></p>
  <p><a href="#" data-page="starfactory-home">back to starfactory</a></p>
  </div>`
},
{
  id: "comparison", title: "SIDE BY SIDE — lunar_latte vs. starfactory", author: "guest_221",
  zone: "Teentopia", tags: ["evidence", "comparison", "comet cat"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: ["lunar_latte", "starfactory"],
  links: ["lunar-home", "starfactory-comic", "zoom-panel", "profile-cards"],
  body: `<div class="pg plain">
  <h1>SIDE BY SIDE</h1>
  <p class="tiny">Posted by guest_221, Nov 2004. "I put these next to each other because something felt wrong and I couldn't say what."</p>
  <table class="card">
    <tr><td><b>lunar_latte — "The Lost Key"</b><br>Posted Jan 9, 2004<br><br>Panel 3 narration: "the cat knew the key was <b>definately</b> lost, and <b>definately</b> worth finding."</td>
    <td><b>starfactory — "The Lost Key"</b><br>Posted Feb 14, 2004<br><br>Panel 3 narration: "the cat knew the key was <b>definately</b> lost, and <b>definately</b> worth finding."</td></tr>
  </table>
  <p>The panels are identical. The stars are identical. The whiskers are identical. Even the <b>misspelling</b> is identical — "definately," twice, in the same sentence. A copyist copies the mistakes too.</p>
  <p>Identical proves <i>someone</i> copied. It doesn't say who copied whom. For that, you need the dates: hers Jan 9, theirs Feb 14. See the <a href="#" data-page="profile-cards">directory profile cards</a>.</p>
  <p>And then look at the stars. Really look at them. <a href="#" data-page="zoom-panel">Magnify panel #10.</a></p>
  </div>`
},
{
  id: "sketchbook", title: "lunar_latte's sketchbook — how comet cat was born", author: "lunar_latte",
  zone: "Teentopia", tags: ["sketchbook", "process", "comet cat"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["lunar_latte"],
  links: ["comet-hub", "zoom-panel", "lunar-home"],
  body: `<div class="pg sketch">
  <h1>sketchbook</h1>
  <p>this is where comet cat was born. <b>Jan 9, 2004, in study hall.</b> i drew a cat with a key and then i couldn't stop.</p>
  <p>things i do in every comic (so you know it's mine):</p>
  <ul>
    <li>i hide my initials in the stars. every tenth panel. look in the corners. i hide things in the corners.</li>
    <li>i misspell "definitely" as "definately." every time. my english teacher gave up on me in 2003.</li>
    <li>the cat's left ear is always a little bit bent. that's not a mistake. that's the cat.</li>
  </ul>
  <p>panel #10 is my favorite. the stars in panel #10 took forever. <a href="#" data-page="zoom-panel">look at panel #10 up close.</a></p>
  <p class="tiny">sketches: jan 2004 (comet cat is born) · feb 2004 (the cat gets a scarf) · mar 2004 (the cat meets a moth — hi moss!)</p>
  </div>`
},
{
  id: "zoom-panel", title: "Panel #10 — magnified", author: "lunar_latte",
  zone: "Teentopia", tags: ["evidence", "comet cat", "signature"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["lunar_latte"],
  links: ["sketchbook", "comparison"],
  body: `<div class="pg sketch">
  <h1>Panel #10 — "The Star That Fell Twice"</h1>
  <p>The cat looks up at the night sky. The sky is full of little hand-drawn stars. At normal size, they're just stars.</p>
  <div class="zoom-panel-art">✦ &nbsp;·&nbsp; ✧ &nbsp;·&nbsp; ★ &nbsp;·&nbsp; ✦ &nbsp;·&nbsp; ✧<br>· &nbsp;★&nbsp; · &nbsp;✦ &nbsp;·&nbsp; ★ &nbsp;·&nbsp; ✧ &nbsp;·<br>✧ &nbsp;·&nbsp; ★ &nbsp;·&nbsp; ✦ &nbsp;·&nbsp; ★ &nbsp;·&nbsp; ✦</div>
  <p><button class="zoom-btn">🔍 MAGNIFY THIS PANEL</button></p>
  <div class="zoom-reveal">In the bottom-left corner, hidden in the stars:<br><span style="font-size:28px">L L</span><br>Two letters, drawn in starlight. lunar_latte hides "LL" in the stars of every tenth panel. This is panel #10. The same "LL" is in starfactory's version — because starfactory's version IS her panel.</div>
  <p class="tiny">A signature you can see. That's the whole case, right there in the corner.</p>
  </div>`
}
];
window.SLEEPWALK_PAGES2.push(
{
  id: "teentopia-rules", title: "Teentopia Zone Rules", author: "mod_sprocket",
  zone: "Teentopia", tags: ["rules", "moderation", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: ["mod_sprocket"],
  links: ["modlog2", "kb-stolen", "rising-stars"],
  body: `<div class="pg plain">
  <h1>Teentopia — Zone Rules</h1>
  <p class="tiny">Posted by mod_sprocket, Zone Moderator (age 17). Last updated Oct 2004.</p>
  <h2>Rule 3 — No reposting</h2>
  <p>Reposting someone else's work as your own is a <b>ban</b>. Not a warning. A ban. Your art is yours. Their art is theirs. This rule is the whole zone.</p>
  <h2>Rule 9 — The mods are teens too</h2>
  <p>Teentopia is moderated by teenagers, on weekends, between homework. Be patient with us. We are doing our best and our best is tired.</p>
  <h2>Rule 1 — Be nice or get grounded</h2>
  <p>Be nice. That's the rule. That's the whole rule. (Grounded means banned. We are teens. We say grounded.)</p>
  <p>See also: <a href="#" data-page="modlog2">the public Mod Log</a> &nbsp;|&nbsp; <a href="#" data-page="kb-stolen">Someone stole my art</a></p>
  </div>`
},
{
  id: "modlog2", title: "Mod Log — Teentopia (Public)", author: "mod_sprocket",
  zone: "Teentopia", tags: ["mod log", "moderation", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: ["mod_sprocket", "starfactory"],
  links: ["teentopia-rules", "sprocket-personal", "starfactory-home"],
  body: `<div class="pg plain">
  <h1>Mod Log — Teentopia</h1>
  <p class="tiny">Public record. Every removal, every signature. If it isn't in the log, it didn't happen.</p>
  <table class="card">
    <tr><td><b>Feb 2004</b></td><td>starfactory reported (reposting). <b>Escalated to Hollowell — no action.</b></td></tr>
    <tr><td><b>Mar 2004</b></td><td>starfactory reported (reposting). <b>Escalated to Hollowell — no action.</b></td></tr>
    <tr><td><b>May 2004</b></td><td>starfactory reported (reposting). <b>Escalated to Hollowell — no action.</b></td></tr>
    <tr><td><b>Jul 2004</b></td><td>starfactory reported (reposting). <b>Escalated to Hollowell — no action.</b></td></tr>
    <tr><td><b>Sep 2004</b></td><td>starfactory reported (reposting). <b>Escalated to Hollowell — no action.</b></td></tr>
    <tr><td><b>Oct 2004</b></td><td>starfactory reported (reposting). <b>Escalated to Hollowell — no action.</b></td></tr>
    <tr><td>Oct 12, 2004</td><td>spam_kid99 — BANNED. Reason: spamming the guestbook. Signed: mod_sprocket. Done in one day.</td></tr>
  </table>
  <p>Six reports against starfactory. Six escalations. Zero action. A spam kid gets banned in a day — but the network that steals everyone's comics gets "escalated" forever. The log doesn't say who Hollowell is. The log just says the name, six times, like a wall.</p>
  <p class="tiny">Log kept by <a href="#" data-page="sprocket-personal">mod_sprocket</a>.</p>
  </div>`
},
{
  id: "webring-sketchbook", title: "The Sketchbook Webring", author: "moss_and_moths",
  zone: "Teentopia", tags: ["webring", "sketchbook", "hub"],
  type: "hub", costMin: 180, hidden: false, dir: "Clubs",
  people: ["moss_and_moths", "lunar_latte"],
  links: ["moss-home", "lunar-home"],
  body: `<div class="pg sketch">
  <h1>The Sketchbook Webring</h1>
  <p><i>pages for people who draw their own stuff. that's the whole ring. if you didn't draw it, don't post it.</i></p>
  <h2>MEMBERS</h2>
  <ul>
    <li><a href="#" data-page="lunar-home">lunar_latte</a> — draws Comet Cat, one panel a night</li>
    <li><a href="#" data-page="moss-home">moss_and_moths</a> — draws Mothlight, one moth at a time</li>
    <li>pencil_shavings — draws hands. only hands. very good hands.</li>
    <li>inkblot_jen — draws maps of places that don't exist</li>
  </ul>
  <p class="tiny">webring nav: &lt; previous &nbsp;|&nbsp; random &nbsp;|&nbsp; next &gt; &nbsp;|&nbsp; list all 23 members</p>
  <p class="tiny">ring founded 2003. 23 members. one rule: draw your own stuff.</p>
  </div>`
},
{
  id: "moss-home", title: "moss_and_moths — Mothlight", author: "moss_and_moths",
  zone: "Teentopia", tags: ["comics", "mothlight", "personal"],
  type: "standard", costMin: 90, hidden: true, dir: "People",
  people: ["moss_and_moths", "starfactory"],
  links: ["webring-sketchbook", "starfactory-home"],
  body: `<div class="pg sketch">
  <h1>moss_and_moths — Mothlight</h1>
  <p>hi i'm moss. i draw a comic called <b>Mothlight</b>. it's about a moth who is afraid of the dark, which is funny if you think about it, because moths love light and this one is scared of it. i think about it a lot.</p>
  <p>my comic showed up on <a href="#" data-page="starfactory-home">starfactory</a> in march. they spelled my name wrong and everything. "moss_and_moths" became "moss_and_moths™". like the ™ makes it theirs.</p>
  <p>i reported it. the ticket came back "escalated to Hollowell." i don't know who Hollowell is. i think Hollowell is where reports go to die.</p>
  <p>if starfactory stole from lunar too, then it's not just me. it's a pattern. patterns are proof. tell someone.</p>
  <p class="sig">page designed by moss_and_moths ★ do not steal my moth</p>
  </div>`
},
{
  id: "starfactory-guestbook", title: "guestbook — starfactory", author: "starfactory",
  zone: "Teentopia", tags: ["guestbook", "starfactory"],
  type: "stub", costMin: 30, hidden: false, dir: "People",
  people: ["starfactory"],
  links: ["starfactory-home"],
  body: `<div class="pg corp">
  <h1>~ guestbook ~ starfactory</h1>
  <p class="tiny">(moderated for positivity)</p>
  <div class="gb">
    <p><b>fan_001</b> — Oct 2004<br>how do you draw so fast?? a new comic every day!! you're amazing!!</p>
    <p><b>starfactory</b> — Oct 2004<br>thank you!! we have a whole team of artists! 😊</p>
    <p><b>guest_88</b> — Oct 2004<br>wait, this cat looks familiar...</p>
    <p><b>starfactory</b> — Oct 2004<br>all cats look familiar! that's what makes cats great! 😊</p>
  </div>
  <p class="tiny">A whole team of artists. No names. No portfolios. Just a team, and a smile, and a cat that isn't theirs.</p>
  </div>`
},
{
  id: "lunar-guestbook", title: "guestbook — lunar_latte", author: "lunar_latte",
  zone: "Teentopia", tags: ["guestbook", "comet cat"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["lunar_latte", "marbles_4ever"],
  links: ["lunar-home", "comet-hub"],
  body: `<div class="pg teen">
  <h1>~ guestbook ~ lunar_latte</h1>
  <div class="gb">
    <p><b>fan_221</b> — Nov 2004<br>I saw your cat on starfactory! They said they drew it! I told them you're the real one!!</p>
    <p><b>marbles_4ever</b> — Nov 2004<br>your stars remind me of my sister's page. she drew stars too. keep drawing. the stars are the whole point.</p>
    <p><b>lunar_latte</b> — Nov 2004<br>thank you. the stars are the whole point. i hide things in the stars. that's where the truth is.</p>
  </div>
  <p class="tiny">Three people told her they'd seen her cat somewhere else. And a girl from another zone stopped by to talk about stars.</p>
  </div>`
},
{
  id: "profile-cards", title: "Directory Profiles — lunar_latte vs. starfactory", author: "Somnius Directory",
  zone: "Teentopia", tags: ["profile", "directory", "evidence"],
  type: "stub", costMin: 30, hidden: false, dir: "People",
  people: ["lunar_latte", "starfactory"],
  links: ["lunar-home", "starfactory-home", "comparison"],
  body: `<div class="pg plain">
  <h1>Somnius Directory — Profile Cards</h1>
  <table class="card">
    <tr><td><b>lunar_latte</b></td><td>Age 15 · Member since 2003<br>First upload: <b>Jan 9, 2004</b> ("The Lost Key")<br>Uploads: 44 episodes, one a week, every week</td></tr>
    <tr><td><b>starfactory</b></td><td>Age — (network) · Account created: <b>Feb 2, 2004</b><br>First upload: <b>Feb 14, 2004</b> ("The Lost Key")<br>Uploads: 312 comics in 9 months. A new comic every day.</td></tr>
  </table>
  <p>Her first upload is <b>Jan 9</b>. Their first upload is <b>Feb 14</b> — five weeks later, the same episode, the same panels, the same misspelling. 312 comics in 9 months isn't a team of artists. It's a machine that takes things.</p>
  <p><a href="#" data-page="comparison">See the side-by-side comparison</a></p>
  </div>`
}
);
window.SLEEPWALK_PAGES2.push(
{
  id: "devblog2", title: "Somnius Labs Dev Blog — We will never allow farming", author: "Somnius Labs",
  zone: "Teentopia", tags: ["dev blog", "farming", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: [],
  links: ["webring-sketchbook", "teentopia-rules"],
  body: `<div class="pg plain">
  <h1>Somnius Labs Dev Blog</h1>
  <h2>We will never allow farming</h2>
  <p class="tiny">Posted Jan 2004 by the Somnius Labs team.</p>
  <p>Somnius is for people, not farms. A farm is a network that takes creators' work, strips the names off, and sells the traffic. We built this place for the kid drawing one panel a night after homework — not for the machine that downloads her comic and calls it "original."</p>
  <p><b>If a network ever tries to strip-mine our creators, we will shut it down.</b> That is a promise. We wrote it down so we can't forget it.</p>
  <p class="tiny">— the Somnius Labs team. Somnius Labs built Somnius. We still believe in the kid with the pencil.</p>
  <p class="tiny">Note, added Oct 2004 by an editor: "Somnius Labs was acquired by Hollowell Media Group in September 2004. This blog is no longer updated."</p>
  </div>`
},
{
  id: "kb-stolen", title: "KB: Someone stole my art", author: "Somnius Help",
  zone: "Teentopia", tags: ["help", "reposting", "official"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: [],
  links: ["teentopia-rules", "modlog2"],
  body: `<div class="pg plain">
  <h1>Someone stole my art</h1>
  <p class="tiny">Somnius Help Center · Knowledge Base article #207</p>
  <p>If someone reposted your work as their own, report it to your Zone Moderator with two things: <b>your earlier timestamp</b> and <b>something only you would know is in the work</b> — a hidden signature, a habit, a mistake you always make. First upload wins. That is the policy.</p>
  <h2>If the reposter is a network</h2>
  <p>Report it the same way, and then report it again, because networks have lawyers and moderators have homework. If the Zone Moderator escalates your report, ask where it was escalated to — and write the name down.</p>
  <p class="tiny">Still confused? Read the <a href="#" data-page="teentopia-rules">Zone Rules</a>. Rule 3 is the whole zone.</p>
  </div>`
},
{
  id: "starfactory-about", title: "About starfactory", author: "starfactory",
  zone: "Teentopia", tags: ["about", "starfactory", "hollowell"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["starfactory"],
  links: ["starfactory-home", "press-release"],
  body: `<div class="pg corp">
  <h1>About starfactory</h1>
  <p>we are a network of independent artists! our artists are:</p>
  <ul>
    <li>"Alex" — likes drawing cats</li>
    <li>"Sam" — likes drawing dogs</li>
    <li>"Pat" — likes drawing everything</li>
  </ul>
  <p>our artists have no last names, no homepages, and no portfolios. our artists are very busy. our artists draw 312 comics in 9 months. our artists are a miracle of productivity.</p>
  <p>we love independent artists. we love them so much we put their work on our network and keep the traffic. that's love. that's the business model.</p>
  <p class="tiny" style="font-size:8px;color:#999">© 2004 starfactory network — a Hollowell Media Group property. all rights reserved.</p>
  <p><a href="#" data-page="press-release">Press: Hollowell Media Group acquires the starfactory network</a></p>
  </div>`
},
{
  id: "press-release", title: "Hollowell Media Group acquires the starfactory network", author: "Hollowell Media Group",
  zone: "Teentopia", tags: ["press", "hollowell", "acquisition"],
  type: "stub", costMin: 30, hidden: false, dir: "Official",
  people: [],
  links: ["starfactory-about"],
  body: `<div class="pg plain">
  <h1>PRESS RELEASE</h1>
  <h2>Hollowell Media Group acquires the starfactory network</h2>
  <p class="tiny">October 2004 · For immediate release</p>
  <p>Hollowell Media Group is pleased to announce the acquisition of the starfactory network, the internet's #1 comics network. starfactory joins the Hollowell family of brands.</p>
  <p>"Together we will bring the best of the teen internet to advertisers everywhere," said a Hollowell spokesperson. "The creators will barely notice the difference. That is the idea."</p>
  <p>The creators noticed the difference.</p>
  <p class="tiny">Hollowell Media Group also acquired Somnius Labs in September 2004. Somnius Labs built Somnius. Hollowell Media Group owns it now.</p>
  </div>`
},
{
  id: "rising-stars", title: "Teentopia — Rising Stars", author: "Somnius Directory",
  zone: "Teentopia", tags: ["ranking", "directory", "starfactory"],
  type: "standard", costMin: 90, hidden: false, dir: "Official",
  people: ["lunar_latte", "starfactory"],
  links: ["lunar-home", "starfactory-home"],
  body: `<div class="pg plain">
  <h1>Teentopia — Rising Stars</h1>
  <p class="tiny">Ranked by traffic. Updated weekly. Traffic is not quality. Traffic is traffic.</p>
  <ol>
    <li><b>starfactory</b> — 48,201 visits this week</li>
    <li>pencil_shavings — 3,104 visits (draws hands. only hands.)</li>
    <li>inkblot_jen — 2,877 visits</li>
    <li>moss_and_moths — 1,942 visits</li>
    <li>... 42 more ...</li>
    <li value="47"><b>lunar_latte</b> — 312 visits this week</li>
  </ol>
  <p>#1 is a farm that steals comics. #47 is the girl who drew them. The list ranks traffic, and traffic goes to whoever shouts loudest — not whoever drew first.</p>
  </div>`
},
{
  id: "sprocket-personal", title: "sprocket's page (i am doing my best)", author: "mod_sprocket",
  zone: "Teentopia", tags: ["personal", "moderator"],
  type: "standard", costMin: 90, hidden: false, dir: "People",
  people: ["mod_sprocket"],
  links: ["modlog2", "teentopia-rules"],
  body: `<div class="pg plain">
  <h1>sprocket's page</h1>
  <p>hi. i'm sprocket. i'm 17. i moderate teentopia alone on weekends, between homework. there are 4,000 pages in this zone and one of me.</p>
  <p>i reported starfactory six times. every time the ticket came back "escalated to Hollowell" and then nothing. i don't think the adults read my reports. i keep reporting anyway, because that's the job, and because lunar is 15 and her cat is hers.</p>
  <p>if you're the investigator looking into starfactory: the mod log is public. the pattern is in the log. six escalations, zero action. that's not moderation. that's a wall with a name on it.</p>
  <p class="sig">page designed by mod_sprocket ★ be nice or get grounded</p>
  </div>`
}
);

/* People registry for Case 2 report pickers. */
window.SLEEPWALK_PEOPLE2 = {
  "lunar_latte": "lunar_latte — the client, 15, draws Comet Cat",
  "starfactory": "starfactory — the slick comics network",
  "moss_and_moths": "moss_and_moths — draws Mothlight, also scraped",
  "mod_sprocket": "mod_sprocket — Teentopia moderator, 17",
  "marbles_4ever": "marbles_4ever — the client from Case 1, stopping by"
};

/* Identity evidence for Case 2: unlocked by visiting the named page. Any ONE proves it. */
window.SLEEPWALK_EVIDENCE2 = {
  "signature": { label: "The hidden signature — “LL” in the stars of panel #10", unlockPage: "zoom-panel" },
  "misspelling": { label: "The misspelling — “definately” in both versions", unlockPage: "comparison" },
  "timestamps": { label: "The timestamps — hers Jan 9, theirs Feb 14", unlockPage: "profile-cards" }
};

/* Mail for Case 2: the case brief, the welcome note, and the Tier 1 follow-up. */
window.SLEEPWALK_MAIL2 = [
  { id: "m-case", from: "lunar_latte", subject: "someone stole my cat. can you help?", date: "Nov 12, 2004",
    body: `hi. i don't know if you take cases like this. i draw a comic called comet cat. it's about a cat who delivers lost things to people in their dreams. i draw one panel a night, after homework.\n\nthere's a page called starfactory and they posted my comic like they drew it. my cat. my stars. my misspellings. everyone thinks it's theirs now because they're #1 and i'm #47.\n\nplease find out who they really are.\n\n— lunar\n\np.s. my comic is called comet cat. start there. that's all i know.` },
  { id: "m-welcome", from: "Somnius Labs", subject: "Welcome to Teentopia, investigator", date: "Nov 12, 2004",
    body: `You asked for access. You have it.\n\nTeentopia is the teen zone — comics, diaries, fan pages, and the occasional turf war over who invented a dance. The moderators here are teenagers. Be patient with them.\n\nA word of advice: in Teentopia, the art is the person. If two pages have the same art, one of them is lying — and the lie always leaves a fingerprint.\n\n— Somnius Labs` }
];
window.SLEEPWALK_FOLLOWUP2 = { id: "m-followup", from: "lunar_latte", subject: "re: someone stole my cat. can you help?", date: "today",
  body: `hey, it's me again. i know you're looking. i just keep thinking about one thing.\n\ndid you look at the stars? not the big picture, the little ones. in the corners. i hide things in the corners.\n\nthe stars. try the stars.\n\n— lunar` };
