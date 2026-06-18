import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const C = {
  bg: "#09090F",
  surface: "#12121C",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  purple: "#7C5CFC",
  blue: "#5B8DEF",
  purpleLight: "#A98EFF",
  textPrimary: "white",
  textSecondary: "rgba(255,255,255,0.65)",
};

const grad = "linear-gradient(135deg, #7C5CFC, #5B8DEF)";

const s = {
  app: { display:"flex", height:"100vh", background:C.bg, color:"white", fontFamily:"'DM Sans',sans-serif", overflow:"hidden" },
  main: { flex:1, overflowY:"auto", padding:32, background:C.bg },
  card: { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24 },
  input: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"13px 16px", borderRadius:10, width:"100%", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" },
  btnPrimary: { background:grad, border:"none", color:"white", padding:"13px 24px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif", width:"100%" },
  btnSecondary: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" },
};

function Login({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    if (!email || !pass) { setError("Ingresa email y contrasena."); return; }
    setCargando(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (err) setError("Email o contrasena incorrectos.");
    setCargando(false);
  };

  const handleRegistro = async () => {
    if (!email || !pass) { setError("Ingresa email y contrasena."); return; }
    if (pass !== pass2) { setError("Las contrasenias no coinciden."); return; }
    if (pass.length < 6) { setError("La contrasena debe tener al menos 6 caracteres."); return; }
    setCargando(true); setError("");
    const { error: err } = await supabase.auth.signUp({ email, password: pass });
    if (err) setError(err.message);
    else setMensaje("Cuenta creada. Revisa tu email para confirmar.");
    setCargando(false);
  };

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.bg }}>
      <div style={{ width:380, padding:32 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:38, fontWeight:800, color:C.purpleLight, marginBottom:6 }}>KENARAU</div>
          <div style={{ fontSize:13, color:C.textSecondary }}>Videos con IA. Sin camara.</div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:24, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:4 }}>
          {["login","registro"].map(m => (
            <button key={m} onClick={() => { setModo(m); setError(""); setMensaje(""); }} style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:modo===m ? grad : "transparent", color:modo===m ? "white" : C.textSecondary }}>{m==="login" ? "Ingresar" : "Crear cuenta"}</button>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.textSecondary, marginBottom:8 }}>Email</div>
          <input style={s.input} type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:12, color:C.textSecondary, marginBottom:8 }}>Contrasena</div>
          <div style={{ position:"relative" }}>
            <input style={{ ...s.input, paddingRight:44 }} type={verPass ? "text" : "password"} placeholder="........" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter" && (modo==="login" ? handleLogin() : handleRegistro())} />
            <button onClick={() => setVerPass(!verPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.textSecondary, cursor:"pointer", fontSize:17 }}>{verPass ? "ocultar" : "ver"}</button>
          </div>
        </div>
        {modo==="login" && <div style={{ textAlign:"right", marginBottom:16 }}><button onClick={async () => { if (!email) { alert("Ingresa tu email primero."); return; } await supabase.auth.resetPasswordForEmail(email, { redirectTo:"https://kenarau-app.vercel.app" }); alert("Email enviado. Revisa tu correo."); }} style={{ background:"none", border:"none", color:C.purpleLight, fontSize:12, cursor:"pointer" }}>Olvidaste tu contrasena?</button></div>}
        {modo==="registro" && <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.textSecondary, marginBottom:8 }}>Confirmar contrasena</div>
          <input style={s.input} type={verPass ? "text" : "password"} placeholder="........" value={pass2} onChange={e => setPass2(e.target.value)} />
        </div>}
        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:16 }}>{error}</div>}
        {mensaje && <div style={{ color:"#6bffb8", fontSize:13, marginBottom:16 }}>{mensaje}</div>}
        <button style={{ ...s.btnPrimary, opacity:cargando ? 0.7 : 1 }} onClick={modo==="login" ? handleLogin : handleRegistro} disabled={cargando}>{cargando ? "Cargando..." : modo==="login" ? "Ingresar" : "Crear cuenta"}</button>
      </div>
    </div>
  );
}

function Step1({ onNext }) {
  const [descripcion, setDescripcion] = useState("");
  return (
    <div style={{ maxWidth:600, margin:"0 auto" }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <div style={{ fontSize:11, color:C.purpleLight, letterSpacing:3, marginBottom:12 }}>PASO 1 DE 3</div>
        <div style={{ fontSize:26, fontWeight:700, marginBottom:8 }}>Que quieres promocionar?</div>
        <div style={{ fontSize:14, color:C.textSecondary }}>Describelo en tus propias palabras. No necesitas saber de tecnologia.</div>
      </div>
      <div style={{ ...s.card, marginBottom:16 }}>
        <textarea style={{ ...s.input, minHeight:140, resize:"vertical", lineHeight:1.6 }} placeholder="Ejemplo: Tengo una empresa de instalacion de geomembranas HDPE para mineria. Quiero mostrar como instalamos las membranas en terreno." value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      </div>
      <button style={{ ...s.btnPrimary, opacity:descripcion.length < 10 ? 0.5 : 1 }} onClick={() => descripcion.length >= 10 && onNext(descripcion)} disabled={descripcion.length < 10}>Continuar</button>
    </div>
  );
}

function Step2({ onNext }) {
  const [tipo, setTipo] = useState("");
  const [detalle, setDetalle] = useState("");
  return (
    <div style={{ maxWidth:600, margin:"0 auto" }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <div style={{ fontSize:11, color:C.purpleLight, letterSpacing:3, marginBottom:12 }}>PASO 2 DE 3</div>
        <div style={{ fontSize:26, fontWeight:700, marginBottom:8 }}>Elige tu modelo virtual</div>
        <div style={{ fontSize:14, color:C.textSecondary }}>Esta modelo sera exclusivamente tuya.</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {[{ id:"mujer", label:"Modelo mujer", desc:"Voz y figura femenina", icon:"M" }, { id:"hombre", label:"Modelo hombre", desc:"Voz y figura masculina", icon:"H" }].map(op => (
          <button key={op.id} onClick={() => setTipo(op.id)} style={{ ...s.card, border:`1px solid ${tipo===op.id ? C.purple : C.border}`, cursor:"pointer", textAlign:"center", padding:20, background:tipo===op.id ? "rgba(124,92,252,0.12)" : C.card }}>
            <div style={{ fontSize:32, marginBottom:8, color:C.purpleLight }}>{op.icon}</div>
            <div style={{ fontSize:14, fontWeight:600, color:"white" }}>{op.label}</div>
            <div style={{ fontSize:12, color:C.textSecondary, marginTop:4 }}>{op.desc}</div>
          </button>
        ))}
      </div>
      {tipo && <div style={{ ...s.card, marginBottom:24 }}>
        <div style={{ fontSize:12, color:C.textSecondary, marginBottom:8 }}>Describe como quieres que sea tu modelo (opcional)</div>
        <input style={s.input} placeholder="Ejemplo: cabello oscuro, 30 anos, estilo profesional" value={detalle} onChange={e => setDetalle(e.target.value)} />
      </div>}
      <button style={{ ...s.btnPrimary, opacity:!tipo ? 0.5 : 1 }} onClick={() => tipo && onNext(tipo, detalle)} disabled={!tipo}>Generar mi modelo</button>
    </div>
  );
}

async function generarImagenFlux(prompt) {
  const response = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
    method:"POST",
    headers: { "Authorization":`Key ${import.meta.env.VITE_FAL_API_KEY}`, "Content-Type":"application/json" },
    body: JSON.stringify({ prompt, image_size:"portrait_4_3", num_inference_steps:28, guidance_scale:3.5, num_images:1, safety_tolerance:"2" })
  });
  const data = await response.json();
  return data.images[0].url;
}

async function generarGuion(descripcion) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers: { "Content-Type":"application/json", "x-api-key":import.meta.env.VITE_CLAUDE_API_KEY, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:400, messages:[{ role:"user", content:`Eres experto en marketing latino. Crea un guion de video de 45 segundos para: ${descripcion}. Escribe SOLO el guion corrido, sin titulos, sin parentesis, sin numeracion. Maximo 80 palabras. Tono cercano, latino, conversacional. Que fluya natural como si una persona lo dijera en camara.` }] })
  });
  const data = await response.json();
  return data.content[0].text;
}

function Step3({ descripcion, tipo, detalle, onVolver }) {
  const [estado, setEstado] = useState("generando");
  const [imagenUrl, setImagenUrl] = useState("");
  const [guion, setGuion] = useState("");
  const [guionEditado, setGuionEditado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const generar = async () => {
      try {
        const genero = tipo === "mujer" ? "woman" : "man";
        const desc = detalle ? detalle : (tipo === "mujer" ? "professional elegant woman 30 years old" : "professional confident man 35 years old");
        const prompt = `Photorealistic portrait of a ${desc}, ${genero}, professional lighting, 8k quality, elegant background, marketing photo`;
        const [img, g] = await Promise.all([generarImagenFlux(prompt), generarGuion(descripcion)]);
        setImagenUrl(img);
        setGuion(g);
        setGuionEditado(g);
        setEstado("listo");
      } catch(e) {
        setError("Error al generar. Intenta de nuevo.");
        setEstado("error");
      }
    };
    generar();
  }, []);

  if (estado === "generando") return (
    <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", paddingTop:60 }}>
      <div style={{ fontSize:48, marginBottom:24 }}>*</div>
      <div style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Creando tu modelo exclusiva...</div>
      <div style={{ fontSize:14, color:C.textSecondary, marginBottom:32 }}>Esto toma entre 30 y 60 segundos.</div>
    </div>
  );

  if (estado === "error") return (
    <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", paddingTop:60 }}>
      <div style={{ color:"#ff6b6b", fontSize:16, marginBottom:24 }}>{error}</div>
      <button style={s.btnPrimary} onClick={onVolver}>Volver a intentar</button>
    </div>
  );

  return (
    <div style={{ maxWidth:600, margin:"0 auto" }}>
      <div style={{ marginBottom:24, textAlign:"center" }}>
        <div style={{ fontSize:11, color:C.purpleLight, letterSpacing:3, marginBottom:12 }}>PASO 3 DE 3</div>
        <div style={{ fontSize:26, fontWeight:700, marginBottom:8 }}>Tu modelo esta lista</div>
        <div style={{ fontSize:14, color:C.textSecondary }}>Esta modelo es unica y exclusivamente tuya.</div>
      </div>
      {imagenUrl && <div style={{ ...s.card, marginBottom:20, textAlign:"center" }}>
        <img src={imagenUrl} style={{ width:"100%", borderRadius:10, maxHeight:380, objectFit:"cover" }} />
      </div>}
      <div style={{ ...s.card, marginBottom:20 }}>
        <div style={{ fontSize:12, color:C.purpleLight, marginBottom:8, fontWeight:600 }}>GUION GENERADO</div>
        <textarea style={{ ...s.input, minHeight:120, resize:"vertical", lineHeight:1.6, marginTop:8 }} value={guionEditado} onChange={e => setGuionEditado(e.target.value)} />
        <div style={{ fontSize:11, color:C.textSecondary, marginTop:6 }}>Puedes editar el guion antes de generar el video.</div>
      </div>
      <button style={{ ...s.btnPrimary, marginBottom:12 }}>Generar video con esta modelo</button>
      <button style={{ ...s.btnSecondary, width:"100%" }} onClick={onVolver}>Volver al inicio</button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
  }, []);

  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.bg, color:"white" }}>Cargando...</div>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={s.app}>
      <div style={{ width:200, background:"#0E0E18", borderRight:`1px solid ${C.border}`, padding:"20px 16px", display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.purpleLight, marginBottom:4 }}>KENARAU</div>
        <div style={{ fontSize:10, color:C.textSecondary, marginBottom:32 }}>v1.0</div>
        <button onClick={() => setPaso(1)} style={{ ...s.btnSecondary, marginBottom:8, textAlign:"left", background:"rgba(124,92,252,0.15)", border:"1px solid rgba(124,92,252,0.3)", color:C.purpleLight }}>Crear video</button>
        <div style={{ marginTop:"auto" }}>
          <div style={{ fontSize:11, color:C.textSecondary, marginBottom:8 }}>{user.email}</div>
          <button onClick={() => supabase.auth.signOut()} style={{ ...s.btnSecondary, width:"100%", fontSize:11 }}>Cerrar sesion</button>
        </div>
      </div>
      <div style={s.main}>
        {paso === 1 && <Step1 onNext={(d) => { setDescripcion(d); setPaso(2); }} />}
        {paso === 2 && <Step2 onNext={(t, det) => { setTipo(t); setDetalle(det); setPaso(3); }} />}
        {paso === 3 && <Step3 descripcion={descripcion} tipo={tipo} detalle={detalle} onVolver={() => setPaso(1)} />}
      </div>
    </div>
  );
}

export default App;