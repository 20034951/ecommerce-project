import React, { useState } from "react";
import "./App.css";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5005";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el registro");

      setMsg({
        type: "success",
        text: `Bienvenido, ${data.name}! (ID: ${data.user_id})`,
      });

      // Reset form fields
      setForm({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
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
          name="email"
          placeholder="Correo electrónico"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="phone"
          placeholder="Teléfono (opcional)"
          value={form.phone}
          onChange={onChange}
        />
        <input
          name="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          minLength={8}
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
