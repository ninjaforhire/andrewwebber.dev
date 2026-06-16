# AndrewWebber.dev — Brand Kit

Open **`index.html`** in a browser for the full, live guidelines (renders in real Geist with the exact site treatment).

## Structure
```
brand/
  index.html          # live brand guidelines + per-asset downloads + full export
  tokens.json         # colors, fonts, gradients, rules (for code)
  svg/                # vector masters (color / white / black) — monogram, horizontal, stacked, favicon
  png/                # transparent raster (high-res) + *-glow + og image   [created by Export]
  webp/               # compressed color masters                            [created by Export]
  favicon/            # 16–512 png tiles + favicon.ico                      [created by Export]
  video/              # animated logo mp4 (+ frames)                        [created by Export]
```

## Generating the raster set
The SVG vectors are ready now. For PNG/WebP/favicon/MP4 (rendered in true Geist):
1. Open `index.html`, go to **Downloads**.
2. Click **“Export full raster set”** and choose this `brand` folder.
3. It writes `png/`, `webp/`, `favicon/`, and `video/frames/`.
4. The MP4 and `favicon.ico` are assembled from those by the build step.

## The logo
- **Wordmark / horizontal:** AndrewWebber.dev_  (Andrew = steel, Webber = green, .dev_ = mono + green caret)
- **Stacked hero:** Andrew / Webber with `.dev_` kicked to the upper-right of the stack (matches the site)
- **Monogram:** AW_  (favicon / avatar)
- Font: **Geist ExtraBold**; caret/labels: **Geist Mono**
- Primary accent: **#00FF41**. Glow + gradients are **screen only**; print uses solid one-ink.
