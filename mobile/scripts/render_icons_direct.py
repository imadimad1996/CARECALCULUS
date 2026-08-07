import os
import subprocess
import time
from PIL import Image

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ASSETS_DIR = r"c:\Users\DeLL\CARECALCULUS\mobile\assets"
TEMP_DIR = r"c:\Users\DeLL\CARECALCULUS\mobile\scripts\temp_render"

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

SVG_EMBLEM = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
  </defs>

  <path d="M 50,12 L 38,12 C 37,12 36,13 36,14 L 36,36 C 36,37 35,38 34,38 L 14,38 C 13,38 12,39 12,40 L 12,46 M 12,54 L 12,60 C 12,61 13,62 14,62 L 34,62 C 35,62 36,63 36,64 L 36,86 C 36,87 37,88 38,88 L 50,88" stroke="url(#navyGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  
  <path d="M 50,12 L 62,12 C 63,12 64,13 64,14 L 64,36 C 64,37 65,38 66,38 L 86,38 C 87,38 88,39 88,40 L 88,60 C 88,61 87,62 86,62 L 66,62 C 65,62 64,63 64,64 L 64,86 C 64,87 63,88 62,88 L 50,88" stroke="url(#tealGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

  <g>
    <path d="M 50,42 A 8 8 0 0 0 50,58 Z" fill="#0369a1" />
    <path d="M 50,58 A 8 8 0 0 0 50,42 Z" fill="#0f766e" />
    <path d="M 50,46.5 L 50,53.5 M 46.5,50 L 53.5,50" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  </g>

  <path d="M 6,50 L 16,50 L 19,42 L 23,58 L 27,38 L 31,62 L 34,46 L 38,50 L 42,50" stroke="url(#navyGrad)" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" />

  <g stroke="url(#tealGrad)" stroke-width="2" opacity="0.9" stroke-linecap="round" stroke-linejoin="round">
    <line x1="64" y1="22" x2="64" y2="38" />
    <line x1="64" y1="22" x2="58" y2="50" />
    <line x1="64" y1="38" x2="58" y2="50" />
    <line x1="64" y1="38" x2="70" y2="50" />
    <line x1="64" y1="38" x2="76" y2="38" />
    <line x1="76" y1="38" x2="70" y2="50" />
    <line x1="76" y1="38" x2="86" y2="50" />
    <line x1="86" y1="50" x2="70" y2="50" />
    <line x1="86" y1="50" x2="76" y2="62" />
    <line x1="76" y1="62" x2="70" y2="50" />
    <line x1="76" y1="62" x2="64" y2="62" />
    <line x1="64" y1="62" x2="70" y2="50" />
    <line x1="64" y1="62" x2="58" y2="50" />
    <line x1="64" y1="62" x2="64" y2="78" />
    <line x1="64" y1="78" x2="58" y2="50" />
    <line x1="58" y1="50" x2="70" y2="50" />
  </g>

  <g fill="#2dd4bf">
    <circle cx="64" cy="22" r="2.8" />
    <circle cx="64" cy="38" r="2.8" />
    <circle cx="76" cy="38" r="2.8" />
    <circle cx="86" cy="50" r="2.8" />
    <circle cx="76" cy="62" r="2.8" />
    <circle cx="64" cy="62" r="2.8" />
    <circle cx="64" cy="78" r="2.8" />
    <circle cx="70" cy="50" r="2.8" />
    <circle cx="58" cy="50" r="2.8" />
  </g>
</svg>"""

HTML_MASTER_ICON = f"""<!DOCTYPE html><html><head><style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 1024px; height: 1024px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 30%, #172a46 0%, #0b1329 75%); overflow: hidden; }}
  .shield {{ width: 820px; height: 820px; display: flex; align-items: center; justify-content: center; border-radius: 220px; background: linear-gradient(145deg, #0d2238 0%, #061928 100%); box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(45,212,191,0.3), inset 0 3px 6px rgba(255,255,255,0.28); border: 3px solid rgba(255,255,255,0.16); }}
  .svg-box {{ width: 630px; height: 630px; filter: drop-shadow(0 18px 30px rgba(0,0,0,0.6)); }}
</style></head><body><div class="shield"><div class="svg-box">{SVG_EMBLEM}</div></div></body></html>"""

HTML_ADAPTIVE_ICON = f"""<!DOCTYPE html><html><head><style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 1024px; height: 1024px; display: flex; align-items: center; justify-content: center; background: transparent; overflow: hidden; }}
  .shield {{ width: 640px; height: 640px; display: flex; align-items: center; justify-content: center; border-radius: 175px; background: linear-gradient(145deg, #0d2238 0%, #061928 100%); box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.28); border: 2px solid rgba(255,255,255,0.16); }}
  .svg-box {{ width: 480px; height: 480px; filter: drop-shadow(0 12px 20px rgba(0,0,0,0.6)); }}
</style></head><body><div class="shield"><div class="svg-box">{SVG_EMBLEM}</div></div></body></html>"""

HTML_SPLASH_SCREEN = f"""<!DOCTYPE html><html><head><style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 2048px; height: 2048px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 40%, #152945 0%, #0b1329 70%); font-family: 'Inter', sans-serif; overflow: hidden; }}
  .shield {{ width: 750px; height: 750px; display: flex; align-items: center; justify-content: center; border-radius: 200px; background: linear-gradient(145deg, #0d2238 0%, #061928 100%); box-shadow: 0 35px 90px rgba(0,0,0,0.7), 0 0 70px rgba(45,212,191,0.35); border: 3px solid rgba(255,255,255,0.18); margin-bottom: 70px; }}
  .svg-box {{ width: 560px; height: 560px; }}
  .title {{ font-size: 130px; font-weight: 900; letter-spacing: -2px; display: flex; gap: 8px; margin-bottom: 24px; }}
  .care {{ color: #ffffff; }}
  .calc {{ background: linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
  .subtitle {{ font-size: 34px; font-weight: 700; letter-spacing: 12px; color: #94a3b8; text-transform: uppercase; }}
</style></head><body>
  <div class="shield"><div class="svg-box">{SVG_EMBLEM}</div></div>
  <div class="title"><span class="care">Care</span><span class="calc">Calculus</span></div>
  <div class="subtitle">AI-Powered Clinical Calculators</div>
</body></html>"""

HTML_NOTIFICATION_ICON = """<!DOCTYPE html><html><head><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 512px; height: 512px; display: flex; align-items: center; justify-content: center; background: transparent; overflow: hidden; }
  .svg-box { width: 440px; height: 440px; }
</style></head><body><div class="svg-box">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <path d="M 50,12 L 38,12 C 37,12 36,13 36,14 L 36,36 C 36,37 35,38 34,38 L 14,38 C 13,38 12,39 12,40 L 12,46 M 12,54 L 12,60 C 12,61 13,62 14,62 L 34,62 C 35,62 36,63 36,64 L 36,86 C 36,87 37,88 38,88 L 50,88" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 50,12 L 62,12 C 63,12 64,13 64,14 L 64,36 C 64,37 65,38 66,38 L 86,38 C 87,38 88,39 88,40 L 88,60 C 88,61 87,62 86,62 L 66,62 C 65,62 64,63 64,64 L 64,86 C 64,87 63,88 62,88 L 50,88" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <g><circle cx="50" cy="50" r="8" fill="#ffffff" /><path d="M 50,46.5 L 50,53.5 M 46.5,50 L 53.5,50" stroke="#000000" stroke-width="2" stroke-linecap="round" /></g>
    <path d="M 6,50 L 16,50 L 19,42 L 23,58 L 27,38 L 31,62 L 34,46 L 38,50 L 42,50" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" />
    <g stroke="#ffffff" stroke-width="2" opacity="0.9" stroke-linecap="round" stroke-linejoin="round">
      <line x1="64" y1="22" x2="64" y2="38" /><line x1="64" y1="22" x2="58" y2="50" /><line x1="64" y1="38" x2="58" y2="50" /><line x1="64" y1="38" x2="70" y2="50" /><line x1="64" y1="38" x2="76" y2="38" /><line x1="76" y1="38" x2="70" y2="50" /><line x1="76" y1="38" x2="86" y2="50" /><line x1="86" y1="50" x2="70" y2="50" /><line x1="86" y1="50" x2="76" y2="62" /><line x1="76" y1="62" x2="70" y2="50" /><line x1="76" y1="62" x2="64" y2="62" /><line x1="64" y1="62" x2="70" y2="50" /><line x1="64" y1="62" x2="58" y2="50" /><line x1="64" y1="62" x2="64" y2="78" /><line x1="64" y1="78" x2="58" y2="50" /><line x1="58" y1="50" x2="70" y2="50" />
    </g>
    <g fill="#ffffff">
      <circle cx="64" cy="22" r="2.8" /><circle cx="64" cy="38" r="2.8" /><circle cx="76" cy="38" r="2.8" /><circle cx="86" cy="50" r="2.8" /><circle cx="76" cy="62" r="2.8" /><circle cx="64" cy="62" r="2.8" /><circle cx="64" cy="78" r="2.8" /><circle cx="70" cy="50" r="2.8" /><circle cx="58" cy="50" r="2.8" />
    </g>
  </svg>
</div></body></html>"""

HTML_FAVICON = f"""<!DOCTYPE html><html><head><style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 512px; height: 512px; display: flex; align-items: center; justify-content: center; background: #0b1329; overflow: hidden; }}
  .shield {{ width: 440px; height: 440px; display: flex; align-items: center; justify-content: center; border-radius: 120px; background: linear-gradient(145deg, #0d2238 0%, #061928 100%); border: 2px solid rgba(255,255,255,0.2); }}
  .svg-box {{ width: 340px; height: 340px; }}
</style></head><body><div class="shield"><div class="svg-box">{SVG_EMBLEM}</div></div></body></html>"""

TASKS = [
    ("icon.png", 1024, 1024, HTML_MASTER_ICON),
    ("adaptive-icon.png", 1024, 1024, HTML_ADAPTIVE_ICON),
    ("splash.png", 2048, 2048, HTML_SPLASH_SCREEN),
    ("notification-icon.png", 512, 512, HTML_NOTIFICATION_ICON),
    ("favicon.png", 512, 512, HTML_FAVICON),
]

for idx, (filename, width, height, html_content) in enumerate(TASKS):
    html_file = os.path.join(TEMP_DIR, f"task_{idx}.html")
    raw_png = os.path.join(TEMP_DIR, f"task_{idx}_raw.png")
    final_png = os.path.join(ASSETS_DIR, filename)

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    user_dir = os.path.join(TEMP_DIR, f"user_data_{idx}")
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--user-data-dir={user_dir}",
        f"--window-size={width},{height}",
        "--force-device-scale-factor=1",
        f"--screenshot={raw_png}",
        f"file:///{html_file.replace('\\', '/')}"
    ]
    subprocess.run(cmd, capture_output=True)
    
    if os.path.exists(raw_png):
        im = Image.open(raw_png)
        cropped = im.crop((0, 0, width, height))
        cropped.save(final_png, format="PNG", optimize=True)
        print(f"SUCCESS: Generated {filename} ({width}x{height}) -> {os.path.getsize(final_png)} bytes")
    else:
        print(f"FAILED: Could not render {filename}")
