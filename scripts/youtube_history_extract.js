// YouTube Watch History → JSON extractor (DevTools snippet)
//
// USAGE
//   1. Open https://www.youtube.com/feed/history in your signed-in browser
//   2. Open DevTools (Cmd+Opt+I) → Console
//   3. Edit TARGET_START / TARGET_END below for the date window you want
//   4. Paste this whole file + hit Enter
//   5. When console prints "JSON copied to clipboard", in a terminal run:
//        pbpaste > scripts/data/youtube-day-136-143.json
//
// WHY MANUAL? YouTube's history page requires Google sign-in. Headless
// scrapers (Firecrawl, headed Chromium with ephemeral profile) can't
// reliably carry that auth without 2FA dance. Running in your real
// browser's DevTools gives full session access with zero credit cost.
//
// Per memory rule [journey_video_filter]: enrich step will drop
// music/gaming/politics entries downstream — no need to filter here.

(async () => {
  const TARGET_START = new Date('2026-05-10T00:00:00');
  const TARGET_END   = new Date('2026-05-18T00:00:00');

  function parseHeader(h) {
    if (!h) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    if (/today/i.test(h)) return today;
    if (/yesterday/i.test(h)) { const d=new Date(today); d.setDate(d.getDate()-1); return d; }
    const d = new Date(h);
    return isNaN(d) ? null : d;
  }

  async function scrollUntilCovered() {
    let lastCount = 0, stuck = 0;
    for (let i = 0; i < 80; i++) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise(r => setTimeout(r, 1200));
      const headers = [...document.querySelectorAll('#title.ytd-item-section-renderer, ytd-item-section-header-renderer #title')];
      const dates = headers.map(h => parseHeader(h.textContent.trim())).filter(Boolean);
      const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
      console.log('scroll', i, 'headers', headers.length, 'min', minDate?.toISOString().slice(0, 10));
      if (minDate && minDate < TARGET_START) break;
      const count = document.querySelectorAll('ytd-video-renderer').length;
      if (count === lastCount) { stuck++; if (stuck >= 3) break; } else stuck = 0;
      lastCount = count;
    }
  }

  await scrollUntilCovered();

  const sections = [...document.querySelectorAll('ytd-item-section-renderer')];
  const out = [];
  for (const s of sections) {
    const hEl = s.querySelector('#title');
    const d = parseHeader(hEl ? hEl.textContent.trim() : null);
    if (!d || d < TARGET_START || d >= TARGET_END) continue;
    const dateStr = d.toISOString().slice(0, 10);
    for (const v of s.querySelectorAll('ytd-video-renderer')) {
      const titleEl = v.querySelector('#video-title');
      const a = v.querySelector('a#video-title-link, a#video-title');
      const channelEl = v.querySelector('ytd-channel-name a, #channel-name a');
      const meta = [...v.querySelectorAll('#metadata-line span')].map(s => s.textContent.trim());
      out.push({
        date: dateStr,
        title: titleEl?.textContent?.trim() || '',
        url: a?.href || '',
        channel: channelEl?.textContent?.trim() || '',
        views: meta[0] || '',
        watched_ago: meta[1] || '',
      });
    }
  }

  console.log('captured', out.length, 'videos in window', TARGET_START.toISOString().slice(0, 10), '..', TARGET_END.toISOString().slice(0, 10));
  await navigator.clipboard.writeText(JSON.stringify(out, null, 2));
  console.log('JSON copied to clipboard — run `pbpaste > scripts/data/youtube-day-136-143.json` in terminal');
  return out.length;
})();
