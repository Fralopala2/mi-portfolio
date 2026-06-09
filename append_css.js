const fs = require('fs');
const css = `
:root {
  --colorBg: #05080d;
  --colorBgSoft: #0b1220;
  --colorPanel: rgba(255, 255, 255, 0.05);
  --colorBorder: rgba(255, 255, 255, 0.1);
  --colorText: #f5f7fa;
  --colorTextSoft: rgba(245, 247, 250, 0.72);
  --colorPrimary: #60a5fa;
  --colorSecondary: #22d3ee;
  --shadowMain: 0 24px 80px rgba(0, 0, 0, 0.35);
}
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.12), transparent 25%), radial-gradient(circle at 80% 30%, rgba(34, 211, 238, 0.08), transparent 25%), linear-gradient(180deg, var(--colorBg) 0%, var(--colorBgSoft) 100%);
}
.preloaderPanel {
  width: min(460px, 100%);
  padding: 28px;
  border: 1px solid var(--colorBorder);
  border-radius: 20px;
  background: var(--colorPanel);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadowMain);
}
.preloaderTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.preloaderLabel {
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--colorTextSoft);
}
.preloaderPercent {
  font-family: Arial, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--colorText);
  font-variant-numeric: tabular-nums;
}
.progressBar {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}
.progressFill {
  width: 0%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--colorPrimary) 0%, var(--colorSecondary) 100%);
  box-shadow: 0 0 24px rgba(96, 165, 250, 0.4);
}
.progressMeta {
  margin-top: 12px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: var(--colorTextSoft);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
@media (max-width: 640px) {
  .preloaderPanel {
      padding: 22px;
      border-radius: 18px;
  }
}
`;
fs.appendFileSync('css/index.css', css);
