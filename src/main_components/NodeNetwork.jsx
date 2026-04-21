import { useEffect, useRef, useState } from "react";

const LABELS = [
  { name: "HOME", url: "/" },// working
  { name: "SOCIETY", url: "/society" },
  { name: "ACHIEVEMENTS", url: "/achievements" },// to be build later 
  { name: "RULES", url: "/rules" },// working
  { name: "CONTACT US", url: "/contact" },// to be build later 
  { name: "INSTAGRAM", url: "https://www.instagram.com/sapien.society/" },
  { name: "TOP 50 MINDS", url: "/top-50-minds" },// to be build later 
  { name: "BOARD MEMBERS", url: "/board-members" },// to be build later 
];

let REPEATS = 2;       // each label appears this many times
let EXTRA_NODES = 8;  // extra unlabeled ambient nodes
let CONN_DIST = 2000;   // max distance for drawing a connection
let HOVER_DIST = 50;  // radius for hover detection

function rand(a, b) { return Math.random() * (b - a) + a; }

export default function NodeNetwork({ onNavigate }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ nodes: [], mouse: { x: -9999, y: -9999 }, hoveredNode: null, log: [] });
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;
  const [log, setLog] = useState([]);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = stateRef.current;

    function buildNodes(W, H) {
      const nodes = [];
      const margin = 60;

      for (let r = 0; r < REPEATS; r++) {
        for (let i = 0; i < LABELS.length; i++) {
          let bx, by;
          if (r === 0) {
            const angle = (i / LABELS.length) * Math.PI * 2 - Math.PI / 2 + rand(-0.15, 0.15);
            bx = W / 2 + Math.cos(angle) * (W * 0.44 + rand(-40, 40));
            by = H / 2 + Math.sin(angle) * (H * 0.41 + rand(-30, 30));
            bx = Math.min(Math.max(bx, margin), W - margin);
            by = Math.min(Math.max(by, margin), H - margin);
          } else if (r === 1) {
            const angle = (i / LABELS.length) * Math.PI * 2 + Math.PI / LABELS.length + rand(-0.2, 0.2);
            bx = W / 2 + Math.cos(angle) * (W * 0.25 + rand(-50, 50));
            by = H / 2 + Math.sin(angle) * (H * 0.23 + rand(-40, 40));
          } else if (r === 2) {
            bx = W / 2 + rand(-W * 0.18, W * 0.18);
            by = H / 2 + rand(-H * 0.18, H * 0.18);
          } else {
            bx = rand(margin, W - margin);
            by = rand(margin, H - margin);
          }

          nodes.push({
            x: bx, y: by, baseX: bx, baseY: by,
            label: LABELS[i].name, url: LABELS[i].url,
            size: r === 0 ? rand(2.2, 3.5) : rand(1.4, 2.8),
            phase: rand(0, Math.PI * 2),
            speed: rand(0.00025, 0.00065),
            ax: rand(18, 32), ay: rand(10, 20),
            fontSize: r === 0 ? rand(10, 13) : rand(8.5, 11),
            bold: r === 0,
          });
        }
      }

      for (let i = 0; i < EXTRA_NODES; i++) {
        const bx = rand(margin, W - margin);
        const by = rand(margin, H - margin);
        nodes.push({
          x: bx, y: by, baseX: bx, baseY: by,
          label: null, url: null,
          size: rand(1.0, 2.0),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.0003, 0.0008),
          ax: rand(12, 28), ay: rand(8, 18),
        });
      }
      return nodes;
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const isMobile = window.innerWidth < 768;
      REPEATS = isMobile ? 1 : 2;
      EXTRA_NODES = isMobile ? 6 : 8;
      CONN_DIST = isMobile ? Math.max(window.innerWidth * 0.5, 600) : 2000;
      HOVER_DIST = isMobile ? 80 : 50;

      state.nodes = buildNodes(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function pushLog(msg) {
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      state.log = [`> [${t}] ${msg}`, ...state.log].slice(0, 5);
      setLog([...state.log]);
    }

    let raf;
    function draw(ts) {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const mx = state.mouse.x, my = state.mouse.y;

      for (const n of state.nodes) {
        n.x = n.baseX + Math.sin(ts * n.speed + n.phase) * n.ax;
        n.y = n.baseY + Math.cos(ts * n.speed * 0.7 + n.phase) * n.ay;
        const pad = 50;
        if (n.baseX < pad) n.baseX += 0.3;
        if (n.baseX > W - pad) n.baseX -= 0.3;
        if (n.baseY < pad) n.baseY += 0.3;
        if (n.baseY > H - pad) n.baseY -= 0.3;
      }

      let hovered = null, minD = HOVER_DIST;
      for (const n of state.nodes) {
        const d = Math.hypot(n.x - mx, n.y - my);
        if (d < minD) { minD = d; hovered = n; }
      }
      if (hovered !== state.hoveredNode) {
        if (hovered?.label) pushLog(`HOVER ${hovered.label}`);
        state.hoveredNode = hovered;
      }

      // Connections — always visible
      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const a = state.nodes[i], b = state.nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > CONN_DIST) continue;
          const isHigh = hovered && (a === hovered || b === hovered);
          const ratio = 1 - d / CONN_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          // Dialed back base opacity limits by 20% to slightly dim the network connections
          ctx.strokeStyle = `rgba(255,40,40,${isHigh ? Math.min(1, ratio * 0.96) : ratio * 0.52 + 0.08})`;
          ctx.lineWidth = isHigh ? 2.5 : ratio * 1.2 + 0.5;
          ctx.stroke();
        }
      }

      // Nodes + labels
      for (const n of state.nodes) {
        const isHov = n === state.hoveredNode;
        const prox = Math.max(0, 1 - Math.hypot(n.x - mx, n.y - my) / CONN_DIST);

        if (isHov) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 36);
          g.addColorStop(0, "rgba(255,60,60,0.35)");
          g.addColorStop(1, "rgba(255,60,60,0)");
          ctx.beginPath(); ctx.arc(n.x, n.y, 36, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        }

        ctx.beginPath();
        // Boosted node arc sizes and opacity strictly for greater dot visibility
        ctx.arc(n.x, n.y, isHov ? n.size * 3.8 : n.size * (1.8 + prox * 1.0), 0, Math.PI * 2);
        ctx.fillStyle = isHov ? "rgb(255,40,40)" : `rgba(255,30,30,${0.85 + prox * 0.15})`;
        ctx.fill();

        if (isHov && n.label) {
          ctx.strokeStyle = "rgba(255,60,60,0.95)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(n.x - 14, n.y - 14, 28, 28);
        }

        if (n.label) {
          const alpha = isHov ? 1 : Math.min(1, 0.75 + prox * 0.25); // Hardened base opacity limit for text
          const fs = n.fontSize || 10;
          const isMobile = W < 768;
          const scale = isMobile ? 0.9 : 1.15; // Scaled text up generally

          // Using Chillax font to achieve a much cleaner, elegant, modern appearance on the network nodes
          ctx.font = `${isHov ? "bold" : "bold"} ${(isHov ? fs + 4 : fs + 2) * scale}px 'Chillax', sans-serif`;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;

          // Dynamic text alignment correctly handles strings bleeding off-screen on thin mobile devices
          if (n.x > W * 0.6) {
            ctx.textAlign = "right";
            ctx.fillText(n.label, n.x - 14, n.y + 4);
          } else {
            ctx.textAlign = "left";
            ctx.fillText(n.label, n.x + 14, n.y + 4);
          }
        }
      }

      // Light edge vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    function getMousePos(evt) {
      const rect = canvas.getBoundingClientRect();
      const clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : (evt.changedTouches ? evt.changedTouches[0].clientX : evt.clientX);
      const clientY = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientY : (evt.changedTouches ? evt.changedTouches[0].clientY : evt.clientY);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function onMouseMove(e) {
      const pos = getMousePos(e);
      state.mouse.x = pos.x;
      state.mouse.y = pos.y;
      setCoords({ x: Math.round(pos.x), y: Math.round(pos.y) });
    }

    function onClick(e) {
      const pos = getMousePos(e);
      for (const n of state.nodes) {
        if (Math.hypot(n.x - pos.x, n.y - pos.y) < 35 && n.url) { // Added mobile fat-finger touch tolerance limit
          if (onNavigateRef.current) {
            onNavigateRef.current(n.url);
          } else if (n.url.startsWith("http")) {
            window.open(n.url, "_blank");
          } else {
            window.location.href = n.url;
          }
          break;
        }
      }
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onMouseMove, { passive: true });
    canvas.addEventListener("touchstart", onMouseMove, { passive: true });
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchend", onClick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onMouseMove);
      canvas.removeEventListener("touchstart", onMouseMove);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchend", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "transparent", fontFamily: "'Courier New', monospace", overflow: "hidden", cursor: "crosshair" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      <div style={{ position: "absolute", top: 22, left: 28, color: "rgba(255,255,255,0.85)", fontSize: 12, letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", userSelect: "none" }}>
        SOCIETY NETWORK
      </div>

      <div style={{ position: "absolute", bottom: 22, left: 22, display: "flex", flexDirection: "column", gap: 3, userSelect: "none" }}>
        {log.map((entry, i) => (
          <div key={i} style={{ color: `rgba(255,255,255,${i === 0 ? 0.7 : Math.max(0.06, 0.25 - i * 0.05)})`, fontSize: 11, letterSpacing: "0.08em" }}>
            {entry}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 22, right: 22, color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.1em", userSelect: "none" }}>
        X {String(coords.x).padStart(4, "0")} Y {String(coords.y).padStart(4, "0")}
      </div>
    </div>
  );
}

