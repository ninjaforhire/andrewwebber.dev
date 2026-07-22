export const dynamic = "force-static";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#401014">
<title>Andrew's Holiday Moast | The Miracle of Meat</title>
<meta name="description" content="Andrew's Holiday Moast: Meat Of Absolute Succulent Tenderness. So damn succulent, it's the Moast.">
<meta property="og:title" content="Andrew's Holiday Moast">
<meta property="og:description" content="Meat Of Absolute Succulent Tenderness. So damn succulent, it's the Moast.">
<meta property="og:image" content="/images/recipes/holiday-moast/miracle-of-meat-album-cover.png">
<style>
:root{--ink:#241713;--muted:#665047;--wine:#681d25;--deep:#401014;--cream:#fffaf0;--paper:#f5ead8;--gold:#d9a441;--sage:#50644f;--line:#dbc8aa;--serif:Georgia,'Times New Roman',serif;--sans:Arial,Helvetica,sans-serif;--shadow:0 24px 65px rgba(73,19,21,.15)}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;overflow-x:hidden;background:radial-gradient(circle at 50% 0,#fffdf7,var(--cream) 46%,#f8efdf);color:var(--ink);font-family:var(--serif);line-height:1.65;text-rendering:optimizeLegibility}
img{display:block;max-width:100%}
button,a{font:inherit}
.wrap{width:min(1120px,calc(100% - 44px));margin:auto}
.mast{display:flex;align-items:center;justify-content:space-between;gap:22px;min-height:152px;padding:8px 0;border-bottom:1px solid var(--line)}
.channel-brand{display:flex;flex-direction:column;align-items:flex-start;width:max-content;color:var(--ink);text-decoration:none}
.channel-brand img{width:205px;mix-blend-mode:multiply}
.channel-tagline{position:relative;z-index:1;margin:-18px 0 0 27px;padding:6px 11px 7px;background:var(--wine);color:#fff;box-shadow:4px 4px 0 #d9a441;font:italic 700 12px/1.1 var(--serif);letter-spacing:.015em;transform:rotate(-1deg);white-space:nowrap}
.channel-tagline strong{color:#f8d98d;font-style:normal;font-weight:700}
.mast-actions{display:flex;justify-content:flex-end;gap:9px;flex-wrap:wrap}
.button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--wine);border-radius:999px;padding:11px 15px;color:var(--wine);background:#fffaf5;text-decoration:none;font:900 10px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
.button.primary{background:var(--wine);color:#fff;box-shadow:0 7px 19px #671c2430}
.hero{text-align:center;padding:clamp(56px,8vw,88px) 0 38px}
.kicker,.eyebrow{color:var(--wine);font:900 11px/1.3 var(--sans);letter-spacing:.2em;text-transform:uppercase}
h1{font-size:clamp(58px,10vw,108px);line-height:.86;letter-spacing:-.06em;margin:18px 0 25px;text-wrap:balance}
.dek{max-width:790px;margin:auto;font-size:clamp(19px,2vw,23px);color:#3d2b23;text-wrap:pretty}
.tagline{color:var(--wine);font-size:clamp(25px,3vw,34px);font-weight:700;font-style:italic;line-height:1.2;margin:28px auto 0;text-wrap:balance}
.definition{background:#fffdf8;border:1px solid var(--line);border-radius:22px;padding:30px clamp(24px,4vw,45px);margin:8px 0 54px;box-shadow:0 8px 24px rgba(73,30,19,.08);text-align:center}
.mark{display:block;color:var(--wine);font:900 clamp(34px,6vw,61px)/1 var(--sans);letter-spacing:.12em}
.expansion{display:flex;justify-content:center;align-items:baseline;gap:10px 13px;flex-wrap:wrap;margin:19px 0 0;color:var(--muted);font:800 clamp(13px,1.8vw,17px)/1.4 var(--sans)}
.expansion span{white-space:nowrap}
.expansion b{color:var(--wine);font-size:1.35em}
.expansion i{color:var(--gold);font-style:normal}
.soundtrack{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--deep),var(--wine));color:#fff;border-radius:28px;padding:clamp(24px,4vw,40px);box-shadow:var(--shadow);margin-bottom:62px}
.soundtrack:after{content:"";position:absolute;width:360px;height:360px;border-radius:50%;right:-230px;top:-230px;border:1px solid #ffffff20;box-shadow:0 0 0 42px #ffffff08,0 0 0 84px #ffffff06}
.player{position:relative;z-index:1;display:grid;grid-template-columns:minmax(220px,330px) minmax(0,1fr);gap:clamp(25px,4vw,48px);align-items:center}
.album-art{margin:0}
.album-art img{width:100%;aspect-ratio:1;border:1px solid #ffffff35;border-radius:12px;box-shadow:0 18px 42px #18050877}
.album-art figcaption{margin-top:10px;color:#e6cfc2;font:700 10px/1.4 var(--sans);letter-spacing:.08em;text-align:center;text-transform:uppercase}
.soundtrack .eyebrow{color:#f3cf7e}
.soundtrack h2{font-size:clamp(32px,4vw,48px);line-height:1.03;margin:7px 0 8px;text-wrap:balance}
.track-subtitle{margin:0 0 19px;color:#f3cf7e;font-style:italic}
audio{display:block;width:100%;height:44px}
.note{font:14px/1.5 var(--sans);color:#f7dfd2;margin:12px 0 0}
details.lyrics{position:relative;z-index:1;border-top:1px solid #ffffff2f;margin-top:28px;padding-top:3px}
details.lyrics summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 2px 12px;color:#f8d98d;font:900 12px/1.3 var(--sans);letter-spacing:.13em;text-transform:uppercase}
details.lyrics summary::-webkit-details-marker{display:none}
details.lyrics summary:after{content:"+";font:400 25px/1 var(--sans);transition:transform .2s}
details.lyrics[open] summary:after{transform:rotate(45deg)}
.lyrics-copy{columns:2;column-gap:50px;padding:10px 3px 8px;font-size:17px;color:#fff9ef}
.lyrics-copy p{break-inside:avoid;margin:0 0 25px}
.lyrics-copy span{display:block;color:#f3cf7e;font:900 10px/1.4 var(--sans);letter-spacing:.14em;text-transform:uppercase;margin-bottom:7px}
.meta{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line);background:#fff;margin-bottom:72px;box-shadow:0 8px 24px rgba(73,30,19,.06)}
.meta div{padding:21px 22px;border-right:1px solid var(--line)}
.meta div:last-child{border:0}
.meta b{display:block;color:var(--wine);font:900 11px/1.3 var(--sans);letter-spacing:.13em;text-transform:uppercase;margin-bottom:5px}
.editorial{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(270px,.85fr);align-items:center;gap:clamp(30px,6vw,74px);margin:0 auto 82px}
.editorial.reverse{grid-template-columns:minmax(270px,.85fr) minmax(0,1.15fr)}
.editorial.reverse .feature-photo{order:2}
.feature-photo{position:relative;margin:0}
.feature-photo:before{content:"";position:absolute;inset:18px -18px -18px 18px;border:1px solid var(--gold);border-radius:22px;z-index:-1}
.feature-photo img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:22px;box-shadow:var(--shadow)}
.feature-photo figcaption{display:inline-block;max-width:86%;margin:-24px 0 0 24px;position:relative;background:var(--deep);color:#fff;padding:12px 16px;font:800 11px/1.45 var(--sans);letter-spacing:.05em}
.feature-photo figcaption b{color:#f3cf7e;text-transform:uppercase;letter-spacing:.12em}
.editorial-copy h2,.story h2,.recipe h2{font-size:clamp(38px,5vw,52px);line-height:1;letter-spacing:-.03em;margin:10px 0 24px;text-wrap:balance}
.editorial-copy p{font-size:18px;color:#4a352b}
.story{max-width:790px;margin:0 auto 72px;font-size:19px}
.story p{margin:0 0 20px}
.recipe{background:#fff;border:1px solid var(--line);box-shadow:0 20px 70px #5b2c1712;margin-bottom:38px}
.recipe-head{display:grid;grid-template-columns:1fr auto;gap:25px;align-items:end;padding:42px 50px;background:var(--paper);border-bottom:1px solid var(--line)}
.recipe-head h2{margin-bottom:11px}
.recipe-head p{margin:0}
.recipe-badge{justify-self:end;border:1px solid var(--wine);border-radius:999px;padding:8px 12px;color:var(--wine);font:900 10px/1.2 var(--sans);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
.recipe-grid{display:grid;grid-template-columns:.82fr 1.18fr}
.ingredients,.method{padding:44px 50px}
.ingredients{border-right:1px solid var(--line);background:#fffcf7}
.ingredients h3,.method h3{font-size:30px;line-height:1.1;margin:0 0 24px}
.ingredients h4{font:900 12px/1.3 var(--sans);letter-spacing:.13em;text-transform:uppercase;color:var(--wine);margin:31px 0 12px}
.ingredients ul{list-style:none;padding:0;margin:0}
.ingredients li{padding:10px 0;border-bottom:1px dotted var(--line)}
.method ol{padding:0;margin:0;list-style:none;counter-reset:step}
.method li{counter-increment:step;position:relative;padding:0 0 25px 55px}
.method li:before{content:counter(step);position:absolute;left:0;top:0;width:36px;height:36px;background:var(--wine);color:#fff;border-radius:50%;display:grid;place-items:center;font:900 13px/1 var(--sans)}
.method strong{display:block;font-size:19px;margin-bottom:3px}
.serve{background:var(--sage);color:#fff;padding:34px 50px}
.serve h3{font-size:29px;margin:0 0 10px}
.serve p{margin:0;font-size:18px}
.recipe-actions{display:flex;justify-content:center;gap:11px;flex-wrap:wrap;margin:0 0 76px}
.toast{font-size:clamp(35px,5vw,60px);line-height:1.05;text-align:center;color:var(--wine);font-weight:700;font-style:italic;padding:28px 20px 82px;text-wrap:balance}
.footer{background:var(--ink);color:#eadfce;padding:28px 24px}
.footer-inner{max-width:1000px;margin:auto;display:flex;align-items:center;justify-content:center;gap:13px 16px;flex-wrap:wrap;font:800 10px/1.4 var(--sans);letter-spacing:.13em;text-transform:uppercase;text-align:center}
.footer-item{white-space:nowrap}
.footer-sep{width:4px;height:4px;border-radius:50%;background:var(--gold);flex:none}
.floating-actions{position:fixed;right:18px;bottom:18px;display:flex;gap:8px;z-index:5}
.floating-actions .button{background:var(--ink);border-color:var(--ink);color:#fff;box-shadow:0 8px 25px #0003}
.print-toolbar{display:none}
.print-view{background:#fff}
.print-view .mast,.print-view .hero,.print-view .definition,.print-view .soundtrack,.print-view .meta,.print-view .editorial,.print-view .story,.print-view .recipe-actions,.print-view .toast,.print-view .footer,.print-view .floating-actions{display:none}
.print-view .wrap{width:min(920px,calc(100% - 36px));padding:24px 0}
.print-view .recipe{margin:0;box-shadow:none}
.print-view .print-toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 auto 18px;max-width:920px}
.print-view .print-toolbar p{margin:0;font:800 11px/1.4 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
@media(max-width:850px){.channel-brand img{width:178px}.channel-tagline{margin-top:-15px;margin-left:20px;font-size:10px}.mast-actions .button:not(.primary){display:none}.player,.editorial,.editorial.reverse{grid-template-columns:1fr}.editorial.reverse .feature-photo{order:0}.album-art{width:100%;max-width:390px;margin:auto}.lyrics-copy{columns:1}.recipe-grid{grid-template-columns:1fr}.ingredients{border-right:0;border-bottom:1px solid var(--line)}.meta{grid-template-columns:1fr 1fr}.meta div:nth-child(2){border-right:0}.meta div:nth-child(-n+2){border-bottom:1px solid var(--line)}}
@media(max-width:590px){.wrap{width:calc(100% - 30px);max-width:1120px}.mast{min-height:124px;align-items:flex-start;gap:8px;padding:8px 0 13px}.channel-brand{min-width:0}.channel-brand img{width:138px}.channel-tagline{width:172px;margin-top:-11px;margin-left:7px;padding:5px 7px 6px;font-size:9px;line-height:1.15;white-space:normal}.mast-actions{flex:0 0 auto;padding-top:22px}.mast-actions .button.primary{padding:9px 10px}.button{padding:10px 12px;font-size:9px}.hero{padding-top:46px}h1{font-size:42px;letter-spacing:-.03em}.dek{max-width:330px;font-size:18px}.tagline{max-width:310px;font-size:22px}.definition{padding:27px 16px}.mark{font-size:40px;letter-spacing:.07em}.expansion{gap:5px 8px;font-size:12px}.expansion i{display:none}.meta{grid-template-columns:1fr}.meta div{border-right:0;border-bottom:1px solid var(--line)}.editorial{margin-bottom:66px}.feature-photo:before{inset:12px -8px -12px 8px}.feature-photo figcaption{margin-left:13px}.recipe-head{grid-template-columns:1fr;padding:32px 24px}.recipe-badge{justify-self:start}.ingredients,.method,.serve{padding:32px 24px}.footer-inner{flex-direction:column;gap:9px}.footer-sep{display:none}.footer-item{white-space:normal}.toast{padding-bottom:58px}.floating-actions{display:none}.print-view .print-toolbar{align-items:flex-start;flex-direction:column}}
@page{margin:.55in}
@media print{.print-toolbar,.mast,.hero,.definition,.soundtrack,.meta,.editorial,.story,.recipe-actions,.toast,.footer,.floating-actions{display:none!important}body,.wrap{background:#fff;width:100%;margin:0;padding:0}.recipe{border:0;box-shadow:none;margin:0}.recipe-head,.ingredients,.method,.serve{padding:20px 24px}.recipe-grid{grid-template-columns:.78fr 1.22fr}.ingredients{border-right:1px solid var(--line);border-bottom:0}.ingredients li{padding:4px 0}.method li{padding-bottom:12px}.serve{background:#fff;color:var(--ink);border-top:1px solid var(--line)}}
</style>
</head>
<body>
<div class="print-toolbar"><p>Printer-friendly recipe · No story, photos, or soundtrack</p><div><button class="button primary" onclick="window.print()">Print now</button> <a class="button" href="/recipes/holiday-moast">Back to full recipe</a></div></div>
<div class="wrap">
<header class="mast">
  <a class="channel-brand" href="/recipes/holiday-moast" aria-label="Webber Done home">
    <img src="/images/recipes/holiday-moast/webber-done-logo.png" alt="Webber Done branded into a juicy ribeye steak">
    <span class="channel-tagline">Questionable methods. <strong>Beef beyond reason.</strong></span>
  </a>
  <nav class="mast-actions" aria-label="Recipe actions">
    <a class="button" id="header-share" href="mailto:?subject=Andrew%27s%20Holiday%20Moast">Email recipe</a>
    <a class="button primary" href="#recipe">Jump to recipe</a>
  </nav>
</header>
<main>
<section class="hero">
  <div class="kicker">Holiday recipes · Beef · Sous vide</div>
  <h1>Andrew's<br>Holiday Moast</h1>
  <p class="dek">A 24-hour sous-vide chuck roast, seared like a giant steak and finished with caramelized onion, garlic, and a dark red-wine pan sauce.</p>
  <p class="tagline">“So damn succulent, it’s the Moast.”</p>
</section>
<section class="definition" aria-label="MOAST means Meat Of Absolute Succulent Tenderness">
  <strong class="mark">M.O.A.S.T.</strong>
  <p class="expansion" aria-hidden="true"><span><b>M</b>eat</span><i>·</i><span><b>O</b>f</span><i>·</i><span><b>A</b>bsolute</span><i>·</i><span><b>S</b>ucculent</span><i>·</i><span><b>T</b>enderness</span></p>
</section>
<section class="soundtrack" id="soundtrack">
  <div class="player">
    <figure class="album-art">
      <img src="/images/recipes/holiday-moast/miracle-of-meat-album-cover.png" alt="The Miracle of Meat album cover, featuring a blue and orange creature carrying a roast through a snowy village">
      <figcaption>Original cover art · The Miracle of Meat</figcaption>
    </figure>
    <div>
      <div class="eyebrow">Official recipe soundtrack · <span id="runtime">full recording</span></div>
      <h2>The Miracle of Meat</h2>
      <p class="track-subtitle">The full-length Holiday Moast anthem</p>
      <audio id="audio" controls preload="metadata"><source src="/audio/holiday-moast.mp3" type="audio/mpeg">Your browser does not support audio playback.</audio>
      <p class="note">Press play, then cook like the whole town is depending on dinner.</p>
    </div>
  </div>
  <details class="lyrics">
    <summary>Complete lyrics</summary>
    <div class="lyrics-copy">
      <p><span>Verse I</span>In the town of Frost and Kin, where the snow was charcoal gray,<br>On a dark and dreary Christmas Eve, the children ceased their play.<br>With hollow cheeks and shivered sighs, they stared at candy streets,<br>For cobblestones were bitter frost, and not the promised sweets.</p>
      <p><span>Pre-Chorus</span>No aroma of a pudding warm, no spices in the air,<br>Just the biting of the winter wind, and hunger everywhere.</p>
      <p><span>Verse II</span>Then through the blizzard's blinding white, a shape began to loom,<br>To pierce the veil of winter's breath and break the evening gloom.<br>A creature on four sturdy legs with patterns swirling bold,<br>In shades of orange and of blue, a sight for eyes to hold.</p>
      <p><span>Pre-Chorus</span>Its grin was wide, an uncanny arch, a sociopathic sort of jest,<br>But the most peculiar feature was the secret in its chest.</p>
      <p><span>Chorus</span>Oh, the Moast, the miracle of meat and winter magic,<br>A feast for every starving soul, though strangely dark and tragic.<br>A storybook of carnage for the hungry and the old,<br>He grins and gives his bearing to the snowy, silent street.<br>The Moast has come to save the town with sacrifice of meat,<br>With sacrifice of meat.</p>
      <p><span>Verse III</span>The golden sparks of Christmas light began to rain and fall,<br>Not upon a Christmas tree, but on the Moast's red maw.<br>He stood as still as any stone while blades began to gleam,<br>The centerpiece of every plate, the center of a dream.</p>
      <p><span>Bridge</span>Was it, was it magic? Was it madness? Was it sacrifice or theft?<br>As the carcass was diminished and the village souls were fed.</p>
      <p><span>Bridge II</span>Beware the grin, beware the coat. (Beware the coat.)<br>The meat it gives is all it's got.<br>But what remains when feast is done?<br>Underneath the winter sun.<br>His belly feeds the hungry crowd,<br>While ghostly carols sing aloud!</p>
      <p><span>Chorus</span>Oh, the Moast, the miracle of meat and winter magic,<br>A feast for every starving soul, though strangely dark and tragic.<br>A storybook of carnage for the hungry and the old,<br>He grins and gives his bearing to the snowy, silent street.<br>The Moast has come to save the town with sacrifice of meat,<br>With sacrifice of meat.</p>
      <p><span>Coda</span>The meat is gone. The hunger stays.<br>In the Moast's dark, swirly gaze.</p>
    </div>
  </details>
</section>
<section class="meta">
  <div><b>Prep</b>15 minutes</div><div><b>Cook</b>22 to 24 hours</div><div><b>Temperature</b>135°F / 57°C</div><div><b>Serves</b>4 to 6 people</div>
</section>
<section class="editorial" id="sous-vide-story">
  <figure class="feature-photo">
    <img src="/images/recipes/holiday-moast/sous-vide-cooking.png" alt="A chuck roast cooking in a clear sous-vide bath in a refined home kitchen" loading="lazy">
    <figcaption><b>The long game.</b> Twenty-four hours at 135°F. No shortcuts, no boiling, no panic.</figcaption>
  </figure>
  <div class="editorial-copy"><div class="eyebrow">Low temperature, high drama</div><h2>Let time do the difficult part.</h2><p>Chuck has plenty of flavor and connective tissue. A day in the water bath gives that tissue time to soften while the roast keeps the sliceable structure that makes the final sear worth waiting for.</p></div>
</section>
<section class="story">
  <h2>What exactly is a Moast?</h2>
  <p><strong>Moast</strong> stands for <strong>Meat Of Absolute Succulent Tenderness.</strong> It began as a 2½-pound chuck roast, one onion, several old bottles of wine, and a refusal to accept ordinary pot-roast destiny.</p>
  <p>Cooked whole at 135°F, the chuck becomes tender enough to feel special while keeping a steak-like structure. It is not pot roast. It is not steak. It has transcended the paperwork.</p>
</section>
<section class="editorial reverse" id="kitchen-story">
  <div class="editorial-copy"><div class="eyebrow">The clean room</div><h2>Bright kitchen. Questionable methods.</h2><p>The calm surroundings are important. They create the illusion that naming a roast, writing its anthem, and reducing a bottle of wine around it were all part of a reasonable dinner plan.</p></div>
  <figure class="feature-photo">
    <img src="/images/recipes/holiday-moast/modern-white-kitchen.png" alt="A bright modern all-white kitchen prepared for an ambitious holiday dinner" loading="lazy">
    <figcaption><b>Where it gets serious.</b> Clean lines, hot iron, and absolutely no ordinary pot roast.</figcaption>
  </figure>
</section>
<article class="recipe" id="recipe">
  <header class="recipe-head"><div><h2>Andrew's Holiday Moast</h2><p>Meat Of Absolute Succulent Tenderness with red-wine onion sauce.</p></div><span class="recipe-badge">The official recipe</span></header>
  <div class="recipe-grid">
    <aside class="ingredients"><h3>Ingredients</h3><h4>For the Moast</h4><ul><li>One 2½-pound boneless chuck roast</li><li>12 to 14 grams kosher salt</li><li>2 teaspoons coarse black pepper</li><li>1½ teaspoons garlic powder</li><li>1 teaspoon onion powder</li><li>1 teaspoon smoked paprika</li><li>½ teaspoon dried thyme</li><li>½ teaspoon crushed dried rosemary</li><li>1 tablespoon neutral oil</li></ul><h4>For the sauce</h4><ul><li>1 large onion, thinly sliced</li><li>4 garlic cloves, finely chopped</li><li>1 cup dry red wine</li><li>Reserved sous-vide bag juices</li><li>½ to 1 cup unsalted beef broth</li><li>1 teaspoon Dijon mustard</li><li>1 teaspoon Worcestershire sauce, optional</li><li>2 tablespoons cold butter</li></ul></aside>
    <section class="method"><h3>The making of the Moast</h3><ol><li><strong>Season the beast.</strong>Mix the salt, pepper, garlic powder, onion powder, paprika, thyme, and rosemary. Coat the roast thoroughly.</li><li><strong>Seal it whole.</strong>Vacuum-seal the entire roast tightly. Do not cut it into chunks.</li><li><strong>Pamper it.</strong>Cook at 135°F for 22 to 24 hours, fully submerged.</li><li><strong>Prepare the righteous sear.</strong>Reserve the bag juices, pat the beef extremely dry, and cool uncovered for 10 minutes.</li><li><strong>Sear the hell out of it.</strong>Sear each broad side for 60 to 90 seconds, then briefly sear the edges.</li><li><strong>Build the sauce.</strong>Brown the onion for 8 to 12 minutes. Add garlic for 30 seconds.</li><li><strong>Release the wine.</strong>Deglaze with red wine and simmer until reduced by half.</li><li><strong>Summon the juices.</strong>Add bag juices, Dijon, Worcestershire, and broth. Simmer until glossy.</li><li><strong>Finish with butter.</strong>Remove from heat and whisk in cold butter.</li><li><strong>Serve the legend.</strong>Slice across the grain and spoon the red-wine onions over the top.</li></ol></section>
  </div>
  <section class="serve"><h3>The official plate</h3><p>Serve over buttered egg noodles, creamy polenta, rice, or beside crusty bread. A green vegetable is permitted for legal reasons.</p></section>
</article>
<div class="recipe-actions"><a class="button primary" href="/recipes/holiday-moast?print=1#recipe" target="_blank" rel="noopener">Printer-friendly recipe</a><a class="button share-link" href="mailto:?subject=Andrew%27s%20Holiday%20Moast">Email this recipe</a></div>
<div class="toast">Behold Andrew's Holiday Moast.<br>So damn succulent, it’s the Moast.</div>
</main>
</div>
<div class="floating-actions"><a class="button share-link" href="mailto:?subject=Andrew%27s%20Holiday%20Moast">Email recipe</a><a class="button" href="/recipes/holiday-moast?print=1#recipe" target="_blank" rel="noopener">Print recipe</a></div>
<footer class="footer"><div class="footer-inner"><span class="footer-item">A Webber Done Production</span><span class="footer-sep"></span><span class="footer-item">Established 2026</span><span class="footer-sep"></span><span class="footer-item">Questionable Methods</span></div></footer>
<script>
const params=new URLSearchParams(window.location.search);
if(params.get('print')==='1'){document.body.classList.add('print-view');document.title="Print Andrew's Holiday Moast"}
const audio=document.getElementById('audio'),soundtrack=document.getElementById('soundtrack'),runtime=document.getElementById('runtime');
audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)){const minutes=Math.floor(audio.duration/60),seconds=Math.round(audio.duration%60);runtime.textContent=minutes+':'+String(seconds).padStart(2,'0')}});
audio.addEventListener('play',()=>soundtrack.classList.add('is-playing'));
['pause','ended'].forEach(eventName=>audio.addEventListener(eventName,()=>soundtrack.classList.remove('is-playing')));
const shareUrl=window.location.origin+window.location.pathname;
const shareSubject="Andrew's Holiday Moast: The Miracle of Meat";
const shareBody="You need to see this: Andrew's 24-hour Holiday Moast recipe, complete with its own soundtrack.\\n\\n"+shareUrl;
document.querySelectorAll('.share-link').forEach(link=>{link.href='mailto:?subject='+encodeURIComponent(shareSubject)+'&body='+encodeURIComponent(shareBody)});
const headerShare=document.getElementById('header-share');
headerShare.href='mailto:?subject='+encodeURIComponent(shareSubject)+'&body='+encodeURIComponent(shareBody);
</script>
</body>
</html>`;

export function GET() {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
