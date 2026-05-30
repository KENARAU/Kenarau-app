import { useState } from "react";

const C = {
  bg: "#09090F",
  surface: "#12121C",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  purple: "#7C5CFC",
  blue: "#5B8DEF",
  purpleLight: "#A98EFF",
  textPrimary: "white",
  textSecondary: "rgba(255,255,255,0.45)",
};

const gradPurple = `linear-gradient(135deg, #7C5CFC, #5B8DEF)`;

const LOOKS = [
  { id: "profesional", label: "Profesional", icon: "👔", desc: "Traje, fondo corporativo" },
  { id: "casual", label: "Casual", icon: "👕", desc: "Ropa cómoda, fondo neutro" },
  { id: "dinamica", label: "Dinámica", icon: "⚡", desc: "Outfit moderno, fondo urbano" },
  { id: "elegante", label: "Elegante", icon: "✨", desc: "Vestimenta formal, fondo premium" },
];

const FORMATOS = [
  { id: "reels", label: "Instagram Reels", icon: "📱" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "youtube", label: "YouTube Short", icon: "▶️" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
];

const PLANES = [
  { n: "Starter", p: "$19", v: "5 videos/mes", f: ["1 modelo virtual", "2 looks", "Formatos básicos"], pop: false },
  { n: "Pro", p: "$49", v: "20 videos/mes", f: ["1 modelo virtual", "4 looks", "Todos los formatos", "Guiones IA ilimitados"], pop: true },
  { n: "Business", p: "$149", v: "Ilimitados", f: ["3 modelos virtuales", "Todos los looks", "API access", "Soporte prioritario"], pop: false },
];

const s = {
  app: { display: "flex", height: "100vh", background: C.bg, color: "white", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" },
  sidebar: { width: 180, background: "#0E0E18", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" },
  main: { flex: 1, overflowY: "auto", padding: 24, background: C.bg },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px 16px", borderRadius: 10, width: "100%", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  btnPrimary: { background: gradPurple, border: "none", color: "white", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", width: "100%" },
  btnSecondary: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  badge: { background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.3)", color: C.purpleLight, borderRadius: 20, padding: "4px 12px", fontSize: 11, display: "inline-block" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
};

// ── FUNCIÓN PRINCIPAL: llama a Claude API real ──
async function generarGuionConClaude(descripcion, objetivo) {
  const objetivoTexto = {
    curso: "vender un curso online",
    asesoria: "ofrecer servicios de asesoría profesional",
    producto: "vender un producto físico",
    marca: "construir marca personal",
  }[objetivo] || "promocionar un producto o servicio";

  const prompt = `Eres un experto en marketing de contenidos para emprendedores latinos en redes sociales.

Crea un guión de video corto (45-60 segundos) para ${objetivoTexto}.

Descripción del negocio/producto: ${descripcion}

El guión debe tener exactamente esta estructura:
1. HOOK (primera oración impactante que enganche en 3 segundos)
2. PROBLEMA (el dolor que resuelve)
3. SOLUCIÓN (tu producto/servicio)
4. PRUEBA SOCIAL (resultado o testimonio breve)
5. CTA (llamada a la acción clara y directa)

Escribe SOLO el guión, sin títulos ni numeración. Usa emojis estratégicamente. Máximo 80 palabras. Tono cercano y latino.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error("Error al conectar con Claude API");
  }

  const data = await response.json();
  return data.content[0].text;
}

function NavBtn({ label, screen, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "rgba(124,92,252,0.2)" : "none",
      border: active ? "1px solid rgba(124,92,252,0.3)" : "1px solid transparent",
      color: active ? C.purpleLight : C.textSecondary,
      borderRadius: 8, padding: "8px 10px", cursor: "pointer",
      fontSize: 11, fontFamily: "'DM Sans',sans-serif", textAlign: "left",
      width: "100%", transition: "all 0.2s"
    }}>{label}</button>
  );
}

function Home({ setScreen }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: gradPurple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✨</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Hola, Carlos 👋</div>
          <div style={{ fontSize: 13, color: C.textSecondary }}>Tu modelo: <span style={{ color: C.purpleLight }}>Luna</span> · Plan Pro</div>
        </div>
      </div>
      <div style={{ ...s.grid2, marginBottom: 16 }}>
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.purpleLight }}>12</div>
          <div style={{ fontSize: 12, color: C.textSecondary }}>Videos este mes</div>
        </div>
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.blue }}>3</div>
          <div style={{ fontSize: 12, color: C.textSecondary }}>Looks disponibles</div>
        </div>
      </div>
      <div style={{ ...s.card, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>Mi modelo virtual</div>
        <div style={{ display: "flex", gap: 10 }}>
          {["👔 Profesional", "👕 Casual", "⚡ Dinámica"].map(l => (
            <div key={l} style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.purpleLight }}>{l}</div>
          ))}
        </div>
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("nuevo")}>+ Crear nuevo video</button>
    </div>
  );
}

function Avatar1({ setScreen }) {
  return (
    <div>
      <div style={{ ...s.badge, marginBottom: 16 }}>Paso 1 de 4 · Foto de referencia</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Crea tu modelo virtual</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>Sube una foto de referencia. La IA creará una modelo similar pero única.</div>
      <div style={{ ...s.card, textAlign: "center", padding: 40, marginBottom: 16, border: "2px dashed rgba(124,92,252,0.3)", cursor: "pointer" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 8 }}>Arrastra tu foto aquí o haz clic</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>JPG, PNG · Máx 5MB</div>
      </div>
      <div style={{ ...s.card, marginBottom: 20, background: "rgba(91,141,239,0.08)", borderColor: "rgba(91,141,239,0.2)" }}>
        <div style={{ fontSize: 12, color: "rgba(91,141,239,0.8)" }}>🔒 Tu foto no se almacena. La modelo generada es ficticia y única.</div>
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("avatar2")}>Continuar →</button>
    </div>
  );
}

function Avatar2({ setScreen }) {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("26–32");
  return (
    <div>
      <div style={{ ...s.badge, marginBottom: 16 }}>Paso 2 de 4 · Rasgos</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Define los rasgos de tu modelo</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>Nombre de tu modelo</div>
        <input style={s.input} placeholder="Ej: Luna, Valentina, Sofia..." value={nombre} onChange={e => setNombre(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>Edad aproximada</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["20–25", "26–32", "33–40", "41–50"].map(o => (
            <button key={o} onClick={() => setEdad(o)} style={{ background: edad === o ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${edad === o ? "rgba(124,92,252,0.4)" : "rgba(255,255,255,0.1)"}`, color: edad === o ? C.purpleLight : C.textSecondary, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{o}</button>
          ))}
        </div>
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("avatar3")}>Continuar →</button>
    </div>
  );
}

function Avatar3({ setScreen }) {
  const [sel, setSel] = useState(["profesional", "casual"]);
  const toggle = id => setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div>
      <div style={{ ...s.badge, marginBottom: 16 }}>Paso 3 de 4 · Looks</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Elige los looks de tu modelo</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>Cada look es una versión para distintos contextos.</div>
      {LOOKS.map(k => (
        <div key={k.id} onClick={() => toggle(k.id)} style={{ ...s.card, display: "flex", alignItems: "center", gap: 16, marginBottom: 12, borderColor: sel.includes(k.id) ? "rgba(124,92,252,0.4)" : C.border, background: sel.includes(k.id) ? "rgba(124,92,252,0.08)" : C.card, cursor: "pointer" }}>
          <div style={{ fontSize: 28 }}>{k.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: sel.includes(k.id) ? C.purpleLight : "white" }}>{k.label}</div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>{k.desc}</div>
          </div>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: sel.includes(k.id) ? gradPurple : "transparent", border: sel.includes(k.id) ? "none" : "2px solid rgba(255,255,255,0.2)" }} />
        </div>
      ))}
      <button style={{ ...s.btnPrimary, marginTop: 8 }} onClick={() => setScreen("avatar4")}>Generar mi modelo →</button>
    </div>
  );
}

function Avatar4({ setScreen }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Generando tu modelo...</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 32 }}>La IA está creando tus looks. Esto toma 30–60 segundos.</div>
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 6, marginBottom: 32, overflow: "hidden" }}>
        <div style={{ width: "70%", height: "100%", background: gradPurple, borderRadius: 100 }} />
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("mimodelo")}>Ver mi modelo ✓</button>
    </div>
  );
}

function MiModelo({ setScreen }) {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Mi modelo: Luna</div>
      <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: gradPurple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👩</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Luna</div>
          <div style={{ fontSize: 13, color: C.textSecondary }}>Castaño · Tono medio · Estilo natural</div>
          <span style={s.badge}>2 looks activos</span>
        </div>
      </div>
      <div style={{ ...s.grid2, marginBottom: 20 }}>
        {[{ i: "👔", l: "Profesional", v: 4 }, { i: "👕", l: "Casual", v: 8 }].map(k => (
          <div key={k.l} style={{ ...s.card, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{k.i}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{k.l}</div>
            <div style={{ fontSize: 11, color: C.textSecondary }}>{k.v} videos</div>
          </div>
        ))}
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("nuevo")}>Crear video con Luna →</button>
    </div>
  );
}

// ── NUEVO VIDEO — captura descripción y objetivo ──
function NuevoVideo({ setScreen, setGuionData }) {
  const [desc, setDesc] = useState("");
  const [obj, setObj] = useState("curso");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleGenerar = async () => {
    if (!desc.trim()) {
      setError("Por favor describe tu producto o servicio.");
      return;
    }
    setError("");
    setCargando(true);
    try {
      const guion = await generarGuionConClaude(desc, obj);
      setGuionData({ guion, descripcion: desc, objetivo: obj });
      setScreen("guion");
    } catch (e) {
      setError("Error al generar el guión. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Nuevo video</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>Describe tu producto y la IA generará el guión.</div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>¿Qué quieres promocionar?</div>
        <textarea style={{ ...s.input, height: 100, resize: "none" }} placeholder="Ej: Vendo un curso online de fotografía para principiantes..." value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>Objetivo del video</div>
        <div style={s.grid2}>
          {[{ id: "curso", i: "🎓", l: "Vender curso" }, { id: "asesoria", i: "🤝", l: "Asesoría" }, { id: "producto", i: "📦", l: "Producto" }, { id: "marca", i: "✨", l: "Marca personal" }].map(o => (
            <button key={o.id} onClick={() => setObj(o.id)} style={{ background: obj === o.id ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${obj === o.id ? "rgba(124,92,252,0.4)" : "rgba(255,255,255,0.1)"}`, color: obj === o.id ? C.purpleLight : C.textSecondary, borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}>{o.i} {o.l}</button>
          ))}
        </div>
      </div>
      {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <button style={{ ...s.btnPrimary, opacity: cargando ? 0.7 : 1 }} onClick={handleGenerar} disabled={cargando}>
        {cargando ? "✨ Generando guión..." : "Generar guión con IA →"}
      </button>
    </div>
  );
}

// ── GUION — muestra el guión real generado por Claude ──
function Guion({ setScreen, guionData, setGuionData }) {
  const [texto, setTexto] = useState(guionData?.guion || "");
  const [editando, setEditando] = useState(false);
  const [regenerando, setRegenerando] = useState(false);

  const handleRegenerar = async () => {
    setRegenerando(true);
    try {
      const nuevoGuion = await generarGuionConClaude(guionData.descripcion, guionData.objetivo);
      setTexto(nuevoGuion);
      setGuionData({ ...guionData, guion: nuevoGuion });
    } catch (e) {
      alert("Error al regenerar. Intenta de nuevo.");
    } finally {
      setRegenerando(false);
    }
  };

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Guión generado por IA</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>Revisa y edita antes de grabar.</div>
      <div style={{ ...s.card, marginBottom: 16, background: "rgba(124,92,252,0.05)", borderColor: "rgba(124,92,252,0.2)" }}>
        <div style={{ fontSize: 12, color: C.purpleLight, marginBottom: 12 }}>✨ Generado por IA · Claude Sonnet</div>
        {editando ? (
          <textarea
            style={{ ...s.input, height: 200, resize: "vertical", lineHeight: 1.8 }}
            value={texto}
            onChange={e => setTexto(e.target.value)}
          />
        ) : (
          <div style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.85)", whiteSpace: "pre-wrap" }}>
            {texto}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button style={{ ...s.btnSecondary, flex: 1, opacity: regenerando ? 0.7 : 1 }} onClick={handleRegenerar} disabled={regenerando}>
          {regenerando ? "Regenerando..." : "Regenerar"}
        </button>
        <button style={{ ...s.btnSecondary, flex: 1 }} onClick={() => setEditando(!editando)}>
          {editando ? "Guardar" : "Editar"}
        </button>
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("formato")}>Elegir formato →</button>
    </div>
  );
}

function Formato({ setScreen }) {
  const [formato, setFormato] = useState("reels");
  const [look, setLook] = useState("profesional");
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Formato y modelo</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>Elige el formato y el look de Luna.</div>
      <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 10 }}>Red social</div>
      <div style={{ ...s.grid2, marginBottom: 20 }}>
        {FORMATOS.map(f => (
          <button key={f.id} onClick={() => setFormato(f.id)} style={{ background: formato === f.id ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${formato === f.id ? "rgba(124,92,252,0.4)" : "rgba(255,255,255,0.1)"}`, color: formato === f.id ? C.purpleLight : C.textSecondary, borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}>{f.icon} {f.label}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 10 }}>Look de Luna</div>
      <div style={{ ...s.grid2, marginBottom: 24 }}>
        {[{ id: "profesional", i: "👔", l: "Profesional" }, { id: "casual", i: "👕", l: "Casual" }].map(k => (
          <div key={k.id} onClick={() => setLook(k.id)} style={{ ...s.card, textAlign: "center", cursor: "pointer", borderColor: look === k.id ? "rgba(124,92,252,0.4)" : C.border }}>
            <div style={{ fontSize: 24 }}>{k.i}</div>
            <div style={{ fontSize: 12, color: look === k.id ? C.purpleLight : C.textSecondary }}>{k.l}</div>
          </div>
        ))}
      </div>
      <button style={s.btnPrimary} onClick={() => setScreen("generando")}>Generar video →</button>
    </div>
  );
}

function Generando({ setScreen }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Generando tu video...</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 32 }}>Luna está grabando tu Reel de 45 segundos.</div>
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 8, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ width: "60%", height: "100%", background: gradPurple, borderRadius: 100 }} />
      </div>
      <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 32 }}>60% · ~30 segundos restantes</div>
      <button style={s.btnPrimary} onClick={() => setScreen("listo")}>Ver resultado →</button>
    </div>
  );
}

function Listo({ setScreen }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>¡Tu video está listo!</div>
        <div style={{ fontSize: 13, color: C.textSecondary }}>Luna · Look Profesional · 45 seg</div>
      </div>
      <div style={{ ...s.card, textAlign: "center", padding: 40, marginBottom: 16, background: "rgba(124,92,252,0.05)", borderColor: "rgba(124,92,252,0.2)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>▶️</div>
        <div style={{ fontSize: 13, color: C.textSecondary }}>Vista previa del video</div>
      </div>
      <div style={{ ...s.grid2, marginBottom: 12 }}>
        <button style={s.btnPrimary}>⬇ Descargar MP4</button>
        <button style={s.btnSecondary}>📤 Compartir</button>
      </div>
      <button style={{ ...s.btnSecondary, width: "100%" }} onClick={() => setScreen("nuevo")}>+ Crear otro video</button>
    </div>
  );
}

function Planes() {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Planes KENARAU</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>Sin cámara, sin vergüenza. Tu modelo trabaja por ti.</div>
      {PLANES.map(p => (
        <div key={p.n} style={{ ...s.card, marginBottom: 12, borderColor: p.pop ? "rgba(124,92,252,0.4)" : C.border }}>
          {p.pop && <div style={{ fontSize: 10, color: C.purpleLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>⭐ MÁS POPULAR</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>{p.v}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: p.pop ? C.purpleLight : "white" }}>{p.p}</div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>/mes</div>
            </div>
          </div>
          {p.f.map(f => <div key={f} style={{ fontSize: 12, color: C.textSecondary, padding: "3px 0" }}>✓ {f}</div>)}
          <button style={{ ...p.pop ? s.btnPrimary : s.btnSecondary, marginTop: 12 }}>Elegir {p.n}</button>
        </div>
      ))}
    </div>
  );
}

function Login({ setScreen }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={{ maxWidth: 360, margin: "0 auto", paddingTop: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.purpleLight, marginBottom: 8 }}>KENARAU</div>
        <div style={{ fontSize: 13, color: C.textSecondary }}>Videos con IA. Sin cámara.</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>Email</div>
        <input style={s.input} type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>Contraseña</div>
        <input style={s.input} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
      </div>
      <button style={{ ...s.btnPrimary, marginBottom: 12 }} onClick={() => setScreen("home")}>Ingresar →</button>
      <button style={{ ...s.btnSecondary, width: "100%" }}>Crear cuenta gratis</button>
    </div>
  );
}

const NAV = [
  { label: "🏠 Inicio", screen: "home" },
  { label: "📷 Crear Avatar", screen: "avatar1" },
  { label: "👤 Mi Modelo", screen: "mimodelo" },
  { label: "✨ Nuevo Video", screen: "nuevo" },
  { label: "📝 Guión IA", screen: "guion" },
  { label: "🎬 Formato", screen: "formato" },
  { label: "⚡ Generando", screen: "generando" },
  { label: "✅ Video Listo", screen: "listo" },
  { label: "💎 Planes", screen: "planes" },
  { label: "🔐 Login", screen: "login" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [guionData, setGuionData] = useState(null);

  const renderScreen = () => {
    switch (screen) {
      case "home": return <Home setScreen={setScreen} />;
      case "avatar1": return <Avatar1 setScreen={setScreen} />;
      case "avatar2": return <Avatar2 setScreen={setScreen} />;
      case "avatar3": return <Avatar3 setScreen={setScreen} />;
      case "avatar4": return <Avatar4 setScreen={setScreen} />;
      case "mimodelo": return <MiModelo setScreen={setScreen} />;
      case "nuevo": return <NuevoVideo setScreen={setScreen} setGuionData={setGuionData} />;
      case "guion": return <Guion setScreen={setScreen} guionData={guionData} setGuionData={setGuionData} />;
      case "formato": return <Formato setScreen={setScreen} />;
      case "generando": return <Generando setScreen={setScreen} />;
      case "listo": return <Listo setScreen={setScreen} />;
      case "planes": return <Planes />;
      case "login": return <Login setScreen={setScreen} />;
      default: return <Home setScreen={setScreen} />;
    }
  };

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={{ padding: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.purpleLight }}>KENARAU</div>
          <div style={{ fontSize: 10, color: C.textSecondary }}>v1.0</div>
        </div>
        {NAV.map(n => (
          <NavBtn key={n.screen} label={n.label} screen={n.screen} active={screen === n.screen} onClick={() => setScreen(n.screen)} />
        ))}
      </div>
      <div style={s.main}>
        {renderScreen()}
      </div>
    </div>
  );
}
