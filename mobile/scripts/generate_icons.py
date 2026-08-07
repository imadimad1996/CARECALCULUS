import os
import subprocess
import time
from PIL import Image

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ASSETS_DIR = r"c:\Users\DeLL\CARECALCULUS\mobile\assets"
TEMP_DIR = r"c:\Users\DeLL\CARECALCULUS\mobile\scripts\temp_render"

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Common SVG Emblem Template with linear gradients for extra depth
SVG_EMBLEM = """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
    <filter id="glowNavy" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Left Navy Half of Cross -->
  <path d="M 50,12 L 38,12 C 37,12 36,13 36,14 L 36,36 C 36,37 35,38 34,38 L 14,38 C 13,38 12,39 12,40 L 12,46 M 12,54 L 12,60 C 12,61 13,62 14,62 L 34,62 C 35,62 36,63 36,64 L 36,86 C 36,87 37,88 38,88 L 50,88" stroke="url(#navyGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Right Teal Half of Cross -->
  <path d="M 50,12 L 62,12 C 63,12 64,13 64,14 L 64,36 C 64,37 65,38 66,38 L 86,38 C 87,38 88,39 88,40 L 88,60 C 88,61 87,62 86,62 L 66,62 C 65,62 64,63 64,64 L 64,86 C 64,87 63,88 62,88 L 50,88" stroke="url(#tealGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Center Badge -->
  <g>
    <!-- Left half of circle -->
    <path d="M 50,42 A 8 8 0 0 0 50,58 Z" fill="#0369a1" />
    <!-- Right half of circle -->
    <path d="M 50,58 A 8 8 0 0 0 50,42 Z" fill="#0f766e" />
    <!-- White Plus Sign -->
    <path d="M 50,46.5 L 50,53.5 M 46.5,50 L 53.5,50" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  </g>

  <!-- Pulse Line (Left half) -->
  <path d="M 6,50 L 16,50 L 19,42 L 23,58 L 27,38 L 31,62 L 34,46 L 38,50 L 42,50" stroke="url(#navyGrad)" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowNavy)" />

  <!-- Network / Mesh (Right half) -->
  <g stroke="url(#tealGrad)" stroke-width="2" opacity="0.9" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowTeal)">
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

  <!-- Nodes (Teal Circles) -->
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
</svg>
"""

# HTML Templates

# 1. Master Icon (1024x1024)
HTML_MASTER_ICON = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b1329;
    background: radial-gradient(circle at 50% 30%, #172a46 0%, #0b1329 75%);
    overflow: hidden;
  }}
  .ambient-glow {{
    position: absolute;
    width: 900px;
    height: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45, 212, 191, 0.22) 0%, rgba(56, 189, 248, 0.18) 40%, rgba(0, 0, 0, 0) 70%);
  }}
  .shield-plate {{
    width: 820px;
    height: 820px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 220px;
    background: linear-gradient(145deg, #0d2238 0%, #061928 100%);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.7),
      0 0 60px rgba(45, 212, 191, 0.3),
      inset 0 3px 6px rgba(255, 255, 255, 0.28),
      inset 0 -6px 12px rgba(0, 0, 0, 0.6);
    border: 3px solid rgba(255, 255, 255, 0.16);
  }}
  .icon-svg {{
    width: 630px;
    height: 630px;
    filter: drop-shadow(0 18px 30px rgba(0,0,0,0.6));
  }}
</style>
</head>
<body>
  <div class="ambient-glow"></div>
  <div class="shield-plate">
    <div class="icon-svg">{SVG_EMBLEM}</div>
  </div>
</body>
</html>"""

# 2. Android Adaptive Icon Foreground (1024x1024 - Transparent background, 66% safe zone radius)
HTML_ADAPTIVE_ICON = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    overflow: hidden;
  }}
  .shield-plate {{
    width: 640px;
    height: 640px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 175px;
    background: linear-gradient(145deg, #0d2238 0%, #061928 100%);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.6),
      0 0 50px rgba(45, 212, 191, 0.3),
      inset 0 2px 5px rgba(255, 255, 255, 0.28),
      inset 0 -5px 10px rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.16);
  }}
  .icon-svg {{
    width: 480px;
    height: 480px;
    filter: drop-shadow(0 12px 20px rgba(0,0,0,0.6));
  }}
</style>
</head>
<body>
  <div class="shield-plate">
    <div class="icon-svg">{SVG_EMBLEM}</div>
  </div>
</body>
</html>"""

# 3. Splash Screen (2048x2048)
HTML_SPLASH_SCREEN = f"""<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: 2048px;
    height: 2048px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0b1329;
    background: radial-gradient(circle at 50% 40%, #152945 0%, #0b1329 70%);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    overflow: hidden;
  }}
  .ambient-glow {{
    position: absolute;
    width: 1400px;
    height: 1400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, rgba(56, 189, 248, 0.12) 40%, rgba(0, 0, 0, 0) 70%);
  }}
  .shield-plate {{
    width: 750px;
    height: 750px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 200px;
    background: linear-gradient(145deg, #0d2238 0%, #061928 100%);
    box-shadow: 
      0 35px 90px rgba(0, 0, 0, 0.7),
      0 0 70px rgba(45, 212, 191, 0.35),
      inset 0 4px 8px rgba(255, 255, 255, 0.28),
      inset 0 -8px 16px rgba(0, 0, 0, 0.6);
    border: 3px solid rgba(255, 255, 255, 0.18);
    margin-bottom: 70px;
  }}
  .icon-svg {{
    width: 560px;
    height: 560px;
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.6));
  }}
  .brand-title {{
    font-size: 130px;
    font-weight: 900;
    letter-spacing: -2px;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1;
    margin-bottom: 24px;
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }}
  .title-care {{ color: #ffffff; }}
  .title-calculus {{
    background: linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .brand-subtitle {{
    font-size: 34px;
    font-weight: 700;
    letter-spacing: 12px;
    color: #94a3b8;
    text-transform: uppercase;
  }}
</style>
</head>
<body>
  <div class="ambient-glow"></div>
  <div class="shield-plate">
    <div class="icon-svg">{SVG_EMBLEM}</div>
  </div>
  <div class="brand-title">
    <span class="title-care">Care</span><span class="title-calculus">Calculus</span>
  </div>
  <div class="brand-subtitle">AI-Powered Clinical Calculators</div>
</body>
</html>"""

# 4. Notification Icon (512x512 - Monochrome White on Transparent)
HTML_NOTIFICATION_ICON = """<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 512px;
    height: 512px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    overflow: hidden;
  }
  .icon-svg {
    width: 440px;
    height: 440px;
  }
</style>
</head>
<body>
  <div class="icon-svg">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <!-- Cross Left Half -->
      <path d="M 50,12 L 38,12 C 37,12 36,13 36,14 L 36,36 C 36,37 35,38 34,38 L 14,38 C 13,38 12,39 12,40 L 12,46 M 12,54 L 12,60 C 12,61 13,62 14,62 L 34,62 C 35,62 36,63 36,64 L 36,86 C 36,87 37,88 38,88 L 50,88" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Cross Right Half -->
      <path d="M 50,12 L 62,12 C 63,12 64,13 64,14 L 64,36 C 64,37 65,38 66,38 L 86,38 C 87,38 88,39 88,40 L 88,60 C 88,61 87,62 86,62 L 66,62 C 65,62 64,63 64,64 L 64,86 C 64,87 63,88 62,88 L 50,88" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Center Badge -->
      <g>
        <circle cx="50" cy="50" r="8" fill="#ffffff" />
        <path d="M 50,46.5 L 50,53.5 M 46.5,50 L 53.5,50" stroke="#000000" stroke-width="2" stroke-linecap="round" />
      </g>

      <!-- Pulse Line -->
      <path d="M 6,50 L 16,50 L 19,42 L 23,58 L 27,38 L 31,62 L 34,46 L 38,50 L 42,50" stroke="#ffffff" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Network Lines -->
      <g stroke="#ffffff" stroke-width="2" opacity="0.9" stroke-linecap="round" stroke-linejoin="round">
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

      <!-- Nodes -->
      <g fill="#ffffff">
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
    </svg>
  </div>
</body>
</html>"""

# 5. Favicon (512x512)
HTML_FAVICON = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    width: 512px;
    height: 512px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b1329;
    overflow: hidden;
  }}
  .shield-plate {{
    width: 440px;
    height: 440px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 120px;
    background: linear-gradient(145deg, #0d2238 0%, #061928 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }}
  .icon-svg {{
    width: 340px;
    height: 340px;
  }}
</style>
</head>
<body>
  <div class="shield-plate">
    <div class="icon-svg">{SVG_EMBLEM}</div>
  </div>
</body>
</html>"""

RENDER_TASKS = [
    ("icon.html", "icon_raw.png", os.path.join(ASSETS_DIR, "icon.png"), 1024, 1024, HTML_MASTER_ICON),
    ("adaptive.html", "adaptive_raw.png", os.path.join(ASSETS_DIR, "adaptive-icon.png"), 1024, 1024, HTML_ADAPTIVE_ICON),
    ("splash.html", "splash_raw.png", os.path.join(ASSETS_DIR, "splash.png"), 2048, 2048, HTML_SPLASH_SCREEN),
    ("notification.html", "notification_raw.png", os.path.join(ASSETS_DIR, "notification-icon.png"), 512, 512, HTML_NOTIFICATION_ICON),
    ("favicon.html", "favicon_raw.png", os.path.join(ASSETS_DIR, "favicon.png"), 512, 512, HTML_FAVICON),
]

def render_all():
    print("Starting rendering pipeline...")
    for html_name, raw_png_name, final_path, width, height, content in RENDER_TASKS:
        html_path = os.path.join(TEMP_DIR, html_name)
        raw_png_path = os.path.join(TEMP_DIR, raw_png_name)
        
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        cmd = [
            EDGE_PATH,
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--window-size={width},{height}",
            "--force-device-scale-factor=1",
            f"--screenshot={raw_png_path}",
            f"file:///{html_path.replace('\\', '/')}"
        ]
        
        print(f"Rendering {final_path} ({width}x{height})...")
        subprocess.run(cmd, check=True)
        time.sleep(1)
        
        # Open with PIL to ensure exact dimension crop and quality saving
        im = Image.open(raw_png_path)
        # Crop exactly to top-left width x height if edge window includes extra padding
        im_cropped = im.crop((0, 0, width, height))
        im_cropped.save(final_path, format="PNG", optimize=True)
        print(f"Saved {final_path} - Size: {im_cropped.size}")

if __name__ == "__main__":
    render_all()
