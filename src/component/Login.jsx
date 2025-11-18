import "./Login.css";
import Nabvar from "./Nabvar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const { login, logout, usuario, token } = useAuth();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("doctor"); // paciente, doctor, admin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistro, setIsRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !contraseña) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el login");
        return;
      }

      login(data.token, data.usuario);
      setSuccess("¡Login exitoso!");

      setTimeout(() => {
        if (data.usuario.rol === "admin") {
          navigate("/pacientes");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setError("Error de conexión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombre || !email || !contraseña) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (contraseña.length < 6) {
      setError("Contraseña: mínimo 6 caracteres");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contraseña, rol }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el registro");
        setLoading(false);
        return;
      }

      setSuccess("¡Registro exitoso! Inicia sesión");
      setTimeout(() => {
        setIsRegistro(false);
        setNombre("");
        setEmail("");
        setContraseña("");
      }, 1500);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail("");
    setContraseña("");
  };

  const isLoggedIn = !!token;

  return (
    <div className="login-container">
      <Nabvar />

      {isLoggedIn && (
        <div className="alert alert-info">
          <strong>Autenticado: {usuario?.nombre}</strong>
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="login-card-container">
        {!isRegistro ? (
          <div className="login-card">
            <h2>🔐 LOGIN</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input type="password" placeholder="••••••" value={contraseña} onChange={(e) => setContraseña(e.target.value)} disabled={loading} required />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select value={rol} onChange={(e) => setRol(e.target.value)} disabled={loading}>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                  <option value="paciente">Paciente</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "ENTRAR"}
              </button>
            </form>
            <p className="toggle-link">
              ¿Sin cuenta? <button type="button" onClick={() => setIsRegistro(true)} className="link-button">Regístrate</button>
            </p>
          </div>
        ) : (
          <div className="login-card">
            <h2>📝 REGISTRO</h2>
            <form onSubmit={handleRegistro}>
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={loading} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input type="password" placeholder="Mínimo 6 caracteres" value={contraseña} onChange={(e) => setContraseña(e.target.value)} disabled={loading} required />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select value={rol} onChange={(e) => setRol(e.target.value)} disabled={loading}>
                  <option value="doctor">Doctor</option>
                  <option value="paciente">Paciente</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Registrando..." : "REGISTRARSE"}
              </button>
            </form>
            <p className="toggle-link">
              ¿Ya tienes cuenta? <button type="button" onClick={() => setIsRegistro(false)} className="link-button">Inicia sesión</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
