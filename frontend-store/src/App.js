import React, { useState } from "react";
import "./App.css";

// ---- API base: evita localhost (IPv6 ::1) y usa 127.0.0.1 en local
const rawHost = window.location.hostname;
const safeHost = rawHost === "localhost" ? "127.0.0.1" : rawHost;
const API = process.env.REACT_APP_API_BASE || `http://${safeHost}:5005`;

function App() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return; // evita doble submit
    setLoading(true);
    setMsg(null);

    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        roles: [], // backend lo acepta opcional
      };

      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // intenta leer json aun si status != ok
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Error en el registro");
      }

      setMsg({
        type: "success",
        text: `¡Bienvenido, ${data.name}! (ID: ${data.id})`,
      });

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Error de red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "3rem auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Registro de Usuario</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={onChange}
          required
        />
        <input
          name="email"
          placeholder="Correo electrónico"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          minLength={6}
        />

        <button disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Creando..." : "Crear Cuenta"}
        </button>
      </form>

      {msg && (
        <p
          style={{
            marginTop: 16,
            color: msg.type === "error" ? "crimson" : "green",
          }}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}

export default App;
