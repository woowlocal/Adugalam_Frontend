import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome, FiPlay, FiRotateCcw, FiAlertTriangle,
  FiCheckCircle, FiChevronLeft, FiChevronRight,
  FiTarget, FiShield, FiZap, FiAward
} from "react-icons/fi";
import "./NotFound.css";

// Detect touch device
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const TOTAL_WAVES = 5;

// ── Canvas drawing helpers for enemies (no emojis) ──
const drawCone = (ctx, x, y, size = 14) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.8, size * 0.6);
  ctx.lineTo(-size * 0.8, size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;
  ctx.stroke();
  // Stripe
  ctx.fillStyle = "#fff";
  ctx.fillRect(-size * 0.4, size * 0.15, size * 0.8, size * 0.15);
  ctx.restore();
};

const drawBottle = (ctx, x, y, size = 12) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#222";
  // Body
  ctx.beginPath();
  ctx.roundRect(-size * 0.4, -size * 0.3, size * 0.8, size * 1.0, 3);
  ctx.fill();
  // Cap
  ctx.fillStyle = "#555";
  ctx.fillRect(-size * 0.25, -size * 0.6, size * 0.5, size * 0.3);
  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(-size * 0.15, -size * 0.2, size * 0.15, size * 0.5);
  ctx.restore();
};

const drawBoot = (ctx, x, y, size = 14) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#111";
  // Sole
  ctx.beginPath();
  ctx.roundRect(-size * 0.8, size * 0.3, size * 1.6, size * 0.4, 3);
  ctx.fill();
  // Upper
  ctx.beginPath();
  ctx.roundRect(-size * 0.3, -size * 0.6, size * 0.9, size * 0.9, 4);
  ctx.fill();
  // Laces
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i += 2) {
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.4 + i * size * 0.1);
    ctx.lineTo(size * 0.4, -size * 0.4 + i * size * 0.1);
    ctx.stroke();
  }
  ctx.restore();
};

const drawGolden = (ctx, x, y, size = 14) => {
  ctx.save();
  ctx.translate(x, y);
  // Star shape (5 points)
  ctx.fillStyle = "#111";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerR = size;
    const innerR = size * 0.45;
    const outerA = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const innerA = outerA + (2 * Math.PI) / 10;
    if (i === 0) ctx.moveTo(Math.cos(outerA) * outerR, Math.sin(outerA) * outerR);
    else ctx.lineTo(Math.cos(outerA) * outerR, Math.sin(outerA) * outerR);
    ctx.lineTo(Math.cos(innerA) * innerR, Math.sin(innerA) * innerR);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawBoss = (ctx, x, y, sw, sh) => {
  ctx.save();
  ctx.translate(x, y);
  // Goal posts
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-sw * 0.45, sh * 0.45);
  ctx.lineTo(-sw * 0.45, -sh * 0.35);
  ctx.lineTo(sw * 0.45, -sh * 0.35);
  ctx.lineTo(sw * 0.45, sh * 0.45);
  ctx.stroke();
  // Net lines
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1.5;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-sw * 0.45 + i * (sw * 0.9 / 4), -sh * 0.35);
    ctx.lineTo(-sw * 0.45 + i * (sw * 0.9 / 4), sh * 0.45);
    ctx.stroke();
  }
  for (let j = 1; j < 3; j++) {
    ctx.beginPath();
    ctx.moveTo(-sw * 0.45, -sh * 0.35 + j * (sh * 0.8 / 3));
    ctx.lineTo(sw * 0.45, -sh * 0.35 + j * (sh * 0.8 / 3));
    ctx.stroke();
  }
  ctx.restore();
};

const drawBall = (ctx, x, y, r = 9) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  // Pentagon patches
  ctx.fillStyle = "#fff";
  const patches = [[0, -r * 0.45], [r * 0.4, r * 0.2], [-r * 0.4, r * 0.2]];
  patches.forEach(([px, py]) => {
    ctx.beginPath(); ctx.arc(px, py, r * 0.22, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
};

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);

  const [gameState, setGameState] = useState("START");
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [turfHealth, setTurfHealth] = useState(100);

  const gs = useRef({
    W: 500, H: 550,
    keys: { left: false, right: false, shoot: false },
    touchLeft: false, touchRight: false,
    lastShootTime: 0,
    score: 0, wave: 1, turfHealth: 100,
    state: "START",
    player: { x: 250, y: 500, width: 44, height: 28, speed: 5 },
    bullets: [], enemies: [], particles: [], popups: [],
    formationDir: 1, formationSpeedX: 1, formationSpeedY: 0.08,
    waveTransitionTimer: 0, frameCount: 0,
  });

  const applyLayout = useCallback(() => {
    const canvas = canvasRef.current;
    const cont = containerRef.current;
    if (!canvas || !cont) return;
    const W = Math.min(cont.getBoundingClientRect().width, 580);
    const H = Math.min(window.innerHeight * 0.58, 580);
    canvas.width = W; canvas.height = H;
    const s = gs.current;
    s.W = W; s.H = H; s.player.y = H - 45;
    if (!s._playerInit) { s.player.x = W / 2; s._playerInit = true; }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", applyLayout);
    applyLayout();
    return () => window.removeEventListener("resize", applyLayout);
  }, [applyLayout]);

  useEffect(() => {
    const s = gs.current;
    const onKeyDown = (e) => {
      if (["ArrowLeft","KeyA"].includes(e.code)) s.keys.left = true;
      if (["ArrowRight","KeyD"].includes(e.code)) s.keys.right = true;
      if (e.code === "Space") { e.preventDefault(); s.keys.shoot = true; }
    };
    const onKeyUp = (e) => {
      if (["ArrowLeft","KeyA"].includes(e.code)) s.keys.left = false;
      if (["ArrowRight","KeyD"].includes(e.code)) s.keys.right = false;
      if (e.code === "Space") s.keys.shoot = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); };
  }, []);

  const spawnParticles = (x, y, count, color = "#111") => {
    for (let i = 0; i < count; i++) {
      gs.current.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7 - 2,
        life: 1.0, color,
        size: Math.random() * 4 + 2,
      });
    }
  };

  const spawnWave = useCallback((waveNum) => {
    const s = gs.current;
    s.enemies = [];
    s.formationDir = 1;
    s.formationSpeedX = 0.8 + waveNum * 0.35;
    s.formationSpeedY = 0.06 + waveNum * 0.04;

    if (waveNum === 5) {
      s.enemies.push({ type: 'boss', x: s.W / 2, y: 90, width: 80, height: 60, hp: 15, maxHp: 15, score: 250 });
      for (let i = 0; i < 5; i++) {
        s.enemies.push({ type: 'boot', x: 60 + i * (s.W - 120) / 4, y: 170, width: 28, height: 28, hp: 2, maxHp: 2, score: 30, phase: i });
      }
      return;
    }

    const configs = [null,
      { rows: 2, cols: 5, types: ['cone','cone'] },
      { rows: 3, cols: 6, types: ['cone','bottle','cone'] },
      { rows: 3, cols: 7, types: ['boot','bottle','cone'] },
      { rows: 4, cols: 7, types: ['boot','golden','bottle','cone'] },
    ];
    const cfg = configs[waveNum];
    const startX = s.W / 2 - (cfg.cols * 52) / 2 + 26;

    for (let r = 0; r < cfg.rows; r++) {
      const typeKey = cfg.types[r] || 'cone';
      for (let c = 0; c < cfg.cols; c++) {
        const isGolden = waveNum >= 3 && Math.random() < 0.06;
        const t = isGolden ? 'golden' : typeKey;
        const hpMap = { cone: 1, bottle: 1, boot: 2, golden: 3 };
        const scoreMap = { cone: 10, bottle: 20, boot: 30, golden: 100 };
        const hp = hpMap[t];
        s.enemies.push({ type: t, x: startX + c * 52, y: 38 + r * 46, width: 28, height: 28, hp, maxHp: hp, score: scoreMap[t], phase: Math.random() * Math.PI * 2 });
      }
    }
  }, []);

  const startGame = useCallback(() => {
    applyLayout();
    const s = gs.current;
    s.score = 0; s.wave = 1; s.turfHealth = 100; s.state = "PLAYING";
    s.player.x = s.W / 2;
    s.bullets = []; s.particles = []; s.popups = [];
    setScore(0); setWave(1); setTurfHealth(100); setGameState("PLAYING");
    spawnWave(1);
  }, [applyLayout, spawnWave]);

  const mkTouch = (dir, val) => (e) => {
    e.preventDefault();
    const s = gs.current;
    if (dir === 'left') s.touchLeft = val;
    if (dir === 'right') s.touchRight = val;
    if (dir === 'shoot') s.keys.shoot = val;
  };

  // Canvas touch: drag finger → player follows | quick tap → shoot
  const touchStartRef = useRef(null);

  const handleCanvasTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      touchStartRef.current = { startX: tx, moved: false, time: Date.now() };
      // Immediately move player to finger position
      const s = gs.current;
      if (s.state === 'PLAYING') {
        const scale = s.W / rect.width;
        s.player.x = Math.max(28, Math.min(s.W - 28, tx * scale));
      }
    }
  }, []);

  const handleCanvasTouchMove = useCallback((e) => {
    e.preventDefault();
    const s = gs.current;
    if (s.state !== 'PLAYING' || !touchStartRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const tx = e.touches[0].clientX - rect.left;
    const scale = s.W / rect.width;
    // Player tracks finger position directly
    s.player.x = Math.max(28, Math.min(s.W - 28, tx * scale));
    touchStartRef.current.moved = true;
  }, []);

  const handleCanvasTouchEnd = useCallback((e) => {
    const s = gs.current;
    if (!touchStartRef.current) return;
    const wasTap = !touchStartRef.current.moved && (Date.now() - touchStartRef.current.time) < 200;
    touchStartRef.current = null;
    // Quick tap without drag → shoot
    if (wasTap && s.state === 'PLAYING') {
      s.bullets.push({ x: s.player.x, y: s.player.y - 22, speed: 9 });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const s = gs.current;
      s.frameCount++;
      const { W, H } = s;

      if (s.frameCount % 6 === 0 && s.state === "PLAYING") {
        setScore(s.score);
        setTurfHealth(s.turfHealth);
      }

      ctx.clearRect(0, 0, W, H);

      // White background with subtle grid
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,0,0,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Turf strip
      ctx.fillStyle = "#111";
      ctx.fillRect(0, H - 36, W, 36);
      ctx.strokeStyle = "#333"; ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(0, H - 18); ctx.lineTo(W, H - 18); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff";
      ctx.fillRect(8, H - 34, 3, 18);
      ctx.fillRect(W - 11, H - 34, 3, 18);
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.strokeRect(W / 2 - 22, H - 36, 44, 14);

      if (s.state === "PLAYING") {
        if (s.keys.left || s.touchLeft) s.player.x -= s.player.speed;
        if (s.keys.right || s.touchRight) s.player.x += s.player.speed;
        s.player.x = Math.max(28, Math.min(W - 28, s.player.x));

        if (s.keys.shoot && time - s.lastShootTime > 280) {
          s.bullets.push({ x: s.player.x, y: s.player.y - 22, speed: 9 });
          s.lastShootTime = time;
        }

        for (let i = s.bullets.length - 1; i >= 0; i--) {
          s.bullets[i].y -= s.bullets[i].speed;
          if (s.bullets[i].y < -10) s.bullets.splice(i, 1);
        }

        let hitEdge = false, lowestY = 0;
        s.enemies.forEach(e => {
          if (e.type === 'boot') e.x += Math.sin(time / 180 + e.phase) * 1.5;
          e.x += s.formationSpeedX * s.formationDir;
          e.y += s.formationSpeedY;
          if (e.x < 20 || e.x > W - 20) hitEdge = true;
          if (e.y > lowestY) lowestY = e.y;
        });
        if (hitEdge) {
          s.formationDir *= -1;
          s.enemies.forEach(e => { e.y += 18; });
        }

        if (lowestY > H - 55) {
          s.turfHealth = Math.max(0, s.turfHealth - 25);
          spawnParticles(W / 2, H - 50, 20, "#111");
          s.enemies.forEach(e => { e.y -= 120; });
          setTurfHealth(s.turfHealth);
          if (s.turfHealth <= 0) {
            s.state = "GAMEOVER"; setScore(s.score); setGameState("GAMEOVER");
          }
        }

        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i]; let hit = false;
          for (let j = s.enemies.length - 1; j >= 0; j--) {
            const e = s.enemies[j];
            if (Math.abs(b.x - e.x) < e.width / 2 + 8 && Math.abs(b.y - e.y) < e.height / 2 + 8) {
              e.hp--;
              hit = true;
              spawnParticles(e.x, e.y, 5, e.type === 'golden' ? '#555' : '#888');
              if (e.hp <= 0) {
                s.score += e.score;
                s.popups.push({ x: e.x, y: e.y, text: `+${e.score}`, life: 1.0 });
                spawnParticles(e.x, e.y, 14, '#111');
                s.enemies.splice(j, 1);
              }
              break;
            }
          }
          if (hit) s.bullets.splice(i, 1);
        }

        if (s.enemies.length === 0) {
          if (s.wave >= TOTAL_WAVES) {
            s.state = "VICTORY"; setScore(s.score); setGameState("VICTORY");
          } else {
            s.wave++;
            s.state = "WAVECOMPLETE"; s.waveTransitionTimer = time;
            setWave(s.wave); setScore(s.score); setGameState("WAVECOMPLETE");
          }
        }
      } else if (s.state === "WAVECOMPLETE") {
        if (time - s.waveTransitionTimer > 2200) {
          spawnWave(s.wave); s.state = "PLAYING"; setGameState("PLAYING");
        }
      }

      // Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= dt * 2.2;
        if (p.life <= 0) { s.particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Score popups
      for (let i = s.popups.length - 1; i >= 0; i--) {
        const p = s.popups[i];
        p.y -= 1.2; p.life -= dt * 2;
        if (p.life <= 0) { s.popups.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#111";
        ctx.font = "bold 13px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;
      }

      // Draw enemies (geometric shapes)
      s.enemies.forEach(e => {
        if (e.type === 'boss') {
          drawBoss(ctx, e.x, e.y, e.width, e.height);
          const bw = 64;
          ctx.fillStyle = "#e5e5e5"; ctx.fillRect(e.x - bw/2, e.y - 48, bw, 7);
          ctx.fillStyle = "#111"; ctx.fillRect(e.x - bw/2, e.y - 48, bw * (e.hp / e.maxHp), 7);
          ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.strokeRect(e.x - bw/2, e.y - 48, bw, 7);
        } else if (e.type === 'cone')   { drawCone(ctx, e.x, e.y); }
        else if (e.type === 'bottle')   { drawBottle(ctx, e.x, e.y); }
        else if (e.type === 'boot')     { drawBoot(ctx, e.x, e.y); }
        else if (e.type === 'golden')   { drawGolden(ctx, e.x, e.y); }
      });

      // Draw bullets (custom ball)
      s.bullets.forEach(b => {
        drawBall(ctx, b.x, b.y, 7);
        ctx.save();
        ctx.shadowColor = "#059669"; ctx.shadowBlur = 10;
        ctx.fillStyle = "#059669";
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.restore();
      });

      // Draw player
      if (s.state !== "START") {
        const { x, y } = s.player;
        ctx.save(); ctx.translate(x, y);
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.roundRect(-22, -10, 44, 22, 6); ctx.fill();
        ctx.fillStyle = "#333"; ctx.fillRect(-5, -22, 10, 14);
        ctx.fillStyle = "#059669";
        ctx.beginPath(); ctx.arc(0, -22, 5, 0, Math.PI * 2); ctx.fill();
        // Draw mini ball on player
        drawBall(ctx, 0, 5, 7);
        ctx.restore();
      }

      if (s.state === "PLAYING" && s.turfHealth <= 25) {
        const pulse = Math.abs(Math.sin(time / 150)) * 0.12;
        ctx.fillStyle = `rgba(0,0,0,${pulse})`;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [spawnWave]);

  const healthColor = turfHealth > 50 ? "#059669" : turfHealth > 25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="nf-page">

      {/* 404 HEADER - Clear user message */}
      <header className="nf-header">
        <div className="nf-badge">404</div>
        <div className="nf-header-text">
          <h1 className="nf-headline">Page Not Found</h1>
          <p className="nf-sub">The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </header>

      {/* HUD */}
      <div className="nf-hud">
        <div className="nf-hud-chip">
          <span className="nf-chip-label">SCORE</span>
          <span className="nf-chip-val">{score}</span>
        </div>
        <div className="nf-health-wrap">
          <span className="nf-chip-label">TURF HEALTH</span>
          <div className="nf-health-track">
            <div className="nf-health-fill" style={{ width: `${turfHealth}%`, background: healthColor }} />
          </div>
          <span className="nf-health-pct" style={{ color: healthColor }}>{turfHealth}%</span>
        </div>
        <div className="nf-hud-chip">
          <span className="nf-chip-label">WAVE</span>
          <span className="nf-chip-val">{wave}/{TOTAL_WAVES}</span>
        </div>
      </div>

      {/* GAME AREA */}
      <div className="nf-game-wrapper" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="nf-canvas"
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
        />

        {/* START */}
        {gameState === "START" && (
          <div className="nf-overlay">
            <div className="nf-modal">
              <div className="nf-modal-icon"><FiShield size={48} /></div>
              <h2 className="nf-modal-title">DEFEND YOUR TURF!</h2>
              <p className="nf-modal-sub">While you're here, protect the pitch from invaders.</p>
              <div className="nf-controls-guide">
                <div className="nf-ctrl-row">
                  <kbd><FiChevronLeft size={14} /></kbd><kbd><FiChevronRight size={14} /></kbd>
                  <span>Move</span>
                </div>
                <div className="nf-ctrl-row"><kbd>SPACE</kbd><span>Shoot</span></div>
              </div>
              <button className="nf-btn-green" onClick={startGame}>
                <FiPlay size={16} /> START GAME
              </button>
            </div>
          </div>
        )}

        {/* WAVE COMPLETE */}
        {gameState === "WAVECOMPLETE" && (
          <div className="nf-overlay nf-overlay-wave">
            <div className="nf-wave-pill">
              <span className="nf-wave-row"><FiCheckCircle size={20} /> WAVE {wave - 1} CLEARED!</span>
              {wave === TOTAL_WAVES && (
                <span className="nf-boss-warning"><FiAlertTriangle size={13} /> FINAL BOSS INCOMING</span>
              )}
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {gameState === "GAMEOVER" && (
          <div className="nf-overlay">
            <div className="nf-modal nf-modal-danger">
              <div className="nf-modal-icon red"><FiZap size={48} /></div>
              <h2 className="nf-modal-title">GAME OVER</h2>
              <p className="nf-modal-sub">The turf has been invaded!</p>
              <div className="nf-score-box">
                <span className="nf-chip-label">FINAL SCORE</span>
                <span className="nf-score-big">{score}</span>
              </div>
              <div className="nf-modal-actions">
                <button className="nf-btn-dark" onClick={startGame}>
                  <FiRotateCcw size={15} /> PLAY AGAIN
                </button>
                <button className="nf-btn-green" onClick={() => navigate("/")}>
                  <FiHome size={15} /> GO HOME
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VICTORY */}
        {gameState === "VICTORY" && (
          <div className="nf-overlay nf-overlay-victory">
            <div className="nf-modal nf-modal-success">
              <div className="nf-modal-icon green"><FiAward size={48} /></div>
              <h2 className="nf-modal-title">TURF SAVED!</h2>
              <p className="nf-modal-sub">Great defense! You protected the ground.</p>
              <div className="nf-score-box">
                <span className="nf-chip-label">FINAL SCORE</span>
                <span className="nf-score-big">{score}</span>
              </div>
              <div className="nf-modal-actions">
                <button className="nf-btn-dark" onClick={startGame}>
                  <FiRotateCcw size={15} /> PLAY AGAIN
                </button>
                <button className="nf-btn-green" onClick={() => navigate("/")}>
                  <FiHome size={15} /> GO HOME
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Floating compact mobile controls — inside game canvas */}
        <div className="nf-float-ctrl">
          <button className="nf-fc-btn"
            onTouchStart={mkTouch('left',true)} onTouchEnd={mkTouch('left',false)}
            onMouseDown={mkTouch('left',true)} onMouseUp={mkTouch('left',false)} onMouseLeave={mkTouch('left',false)}>
            <FiChevronLeft size={20} />
          </button>
          <button className="nf-fc-btn nf-fc-shoot"
            onTouchStart={mkTouch('shoot',true)} onTouchEnd={mkTouch('shoot',false)}
            onMouseDown={mkTouch('shoot',true)} onMouseUp={mkTouch('shoot',false)} onMouseLeave={mkTouch('shoot',false)}>
            <FiTarget size={16} />
          </button>
          <button className="nf-fc-btn"
            onTouchStart={mkTouch('right',true)} onTouchEnd={mkTouch('right',false)}
            onMouseDown={mkTouch('right',true)} onMouseUp={mkTouch('right',false)} onMouseLeave={mkTouch('right',false)}>
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* RETURN HOME — Always Visible Green */}
      <button className="nf-home-btn" onClick={() => navigate("/")}>
        <FiHome size={20} />
        Return to Adugalam Homepage
      </button>

    </div>
  );
};

export default NotFound;
