import React, { useState, useEffect } from "react";
import "./Pacientes.css";
import Nabvar from "./Nabvar";
import { API_BASE_URL } from "../config/api";

function Pacientes() {
  const initialPatients = [
    {
      nombre: "Juan Pérez",
      ultimaCita: "2 Nov 2025",
      id: "#MS-2045",
      historia: "Antecedentes: Alergia a la penicilina. Tratamientos: limpieza y blanqueamiento.",
      actividad: [
        { id: 1, titulo: "Consulta general", fecha: "2025-11-05", notas: "Revisión y limpieza." },
      ],
    },
    {
      nombre: "Laura Gómez",
      ultimaCita: "28 Oct 2025",
      id: "#MS-2046",
      historia: "Antecedentes: Sin alergias. Tratamientos: ortodoncia en curso.",
      actividad: [
        { id: 2, titulo: "Ortodoncia - control", fecha: "2025-11-12", notas: "Ajuste de brackets." },
      ],
    },
  ];

  const [pacientes, setPacientes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar pacientes desde el backend
  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes iniciar sesión para ver pacientes");
        setPacientes(initialPatients);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/pacientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          setPacientes(initialPatients);
        } else {
          throw new Error("Error al cargar pacientes");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPacientes(data.length > 0 ? data : initialPatients);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando pacientes:", err);
      setError("Error de conexión. Mostrando datos de ejemplo.");
      setPacientes(initialPatients);
      setLoading(false);
    }
  };

  // Form state for adding a new patient
  const [newNombre, setNewNombre] = useState("");
  const [newUltimaCita, setNewUltimaCita] = useState("");
  const [newId, setNewId] = useState("");

  // Edit state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editUltimaCita, setEditUltimaCita] = useState("");
  const [editId, setEditId] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNombre.trim()) {
      alert("❌ Error: El nombre es requerido");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Error de autenticación: Debes iniciar sesión para agregar pacientes.");
        return;
      }

      const nuevoPaciente = {
        nombre: newNombre.trim(),
        ultimaCita: newUltimaCita.trim() || "-",
        id: newId.trim() || `#MS-${Math.floor(Math.random() * 9000) + 1000}`,
      };

      const response = await fetch(`${API_BASE_URL}/api/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoPaciente),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("❌ Error de autenticación: Tu sesión ha expirado.\n\nPor favor, inicia sesión nuevamente.");
        } else if (response.status === 409) {
          alert("❌ Error: Ya existe un paciente con ese ID o nombre.");
        } else {
          alert(`❌ Error al agregar paciente: ${data.error || "Error desconocido"}`);
        }
        return;
      }

      alert("✅ Paciente agregado con éxito");
      setNewNombre("");
      setNewUltimaCita("");
      setNewId("");
      cargarPacientes();
    } catch (err) {
      console.error("Error agregando paciente:", err);
      alert("❌ Error de conexión: No se pudo conectar con el servidor.");
    }
  };

  const startEdit = (index) => {
    const p = pacientes[index];
    setEditingIndex(index);
    setEditNombre(p.nombre);
    setEditUltimaCita(p.ultimaCita);
    setEditId(p.id);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditNombre("");
    setEditUltimaCita("");
    setEditId("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (editingIndex === null) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Error de autenticación: Debes iniciar sesión.");
        return;
      }

      const paciente = pacientes[editingIndex];
      const pacienteActualizado = {
        ...paciente,
        nombre: editNombre,
        ultimaCita: editUltimaCita,
        id: editId,
      };

      const response = await fetch(`${API_BASE_URL}/api/pacientes/${paciente._id || paciente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteActualizado),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401 || response.status === 403) {
          alert("❌ Error de autenticación: Tu sesión ha expirado.");
        } else {
          alert(`❌ Error al actualizar paciente: ${data.error || "Error desconocido"}`);
        }
        return;
      }

      alert("✅ Paciente actualizado con éxito");
      cancelEdit();
      cargarPacientes();
    } catch (err) {
      console.error("Error actualizando paciente:", err);
      alert("❌ Error de conexión: No se pudo conectar con el servidor.");
    }
  };

  const deletePatient = async (index) => {
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Error de autenticación: Debes iniciar sesión.");
        return;
      }

      const paciente = pacientes[index];
      const response = await fetch(`${API_BASE_URL}/api/pacientes/${paciente._id || paciente.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401 || response.status === 403) {
          alert("❌ Error de autenticación: Tu sesión ha expirado.");
        } else {
          alert(`❌ Error al eliminar paciente: ${data.error || "Error desconocido"}`);
        }
        return;
      }

      alert("✅ Paciente eliminado con éxito");
      // if deleting currently edited item, cancel edit
      if (editingIndex === index) cancelEdit();
      // adjust selectedIndex if needed
      setSelectedIndex((prev) => {
        if (index === prev) return null;
        if (index < prev) return prev - 1;
        return prev;
      });
      cargarPacientes();
    } catch (err) {
      console.error("Error eliminando paciente:", err);
      alert("❌ Error de conexión: No se pudo conectar con el servidor.");
    }
  };

  // Detail / historia edit
  const [detalleEditing, setDetalleEditing] = useState(false);
  const [detalleText, setDetalleText] = useState("");

  const startDetalleEdit = () => {
    const p = pacientes[selectedIndex];
    setDetalleText(p?.historia || "");
    setDetalleEditing(true);
  };

  const cancelDetalleEdit = () => {
    setDetalleEditing(false);
    setDetalleText("");
  };

  const saveDetalle = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;
    setPacientes((prev) => prev.map((p, i) => i === selectedIndex ? { ...p, historia: detalleText } : p));
    setDetalleEditing(false);
  };

  // Local state for simplified actividad fields
  const [consultaEditing, setConsultaEditing] = useState(false);
  const [consultaDate, setConsultaDate] = useState("");
  const [tratamientoEditing, setTratamientoEditing] = useState(false);
  const [tratamientoTipoLocal, setTratamientoTipoLocal] = useState("");
  const [tratamientoEstadoLocal, setTratamientoEstadoLocal] = useState("En curso");
  const [proximaEditing, setProximaEditing] = useState(false);
  const [proximaDate, setProximaDate] = useState("");

  // Sync local fields when selection changes
  useEffect(() => {
    if (selectedIndex === null || !pacientes[selectedIndex]) {
      setConsultaDate("");
      setTratamientoTipoLocal("");
      setTratamientoEstadoLocal("En curso");
      setProximaDate("");
      return;
    }
    const p = pacientes[selectedIndex];
    setConsultaDate(p.consultaFecha || "");
    setTratamientoTipoLocal(p.tratamientoTipo || "");
    setTratamientoEstadoLocal(p.tratamientoEstado || "En curso");
    setProximaDate(p.proximaCita || "");
  }, [selectedIndex, pacientes]);

  const saveConsulta = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;
    setPacientes(prev => prev.map((p, i) => i === selectedIndex ? { ...p, consultaFecha: consultaDate } : p));
    setConsultaEditing(false);
  };

  const saveTratamiento = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;
    setPacientes(prev => prev.map((p, i) => i === selectedIndex ? { ...p, tratamientoTipo: tratamientoTipoLocal, tratamientoEstado: tratamientoEstadoLocal } : p));
    setTratamientoEditing(false);
  };

  const saveProxima = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;
    setPacientes(prev => prev.map((p, i) => i === selectedIndex ? { ...p, proximaCita: proximaDate } : p));
    setProximaEditing(false);
  };

  // Actividad clínica state (formularios) y lógica - REMOVED for now (unused)

  return (
    <div className="pacientes-container">
      <Nabvar />

      {/* CONTENIDO */}
      <div className="contenido">
        <div className="lista-pacientes">
          <h2>PACIENTES</h2>

          {error && (
            <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              Cargando pacientes...
            </div>
          )}

          {/* Form: Agregar paciente */}
          <form className="agregar-paciente-form" onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Nombre"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              className="buscador"
              style={{ marginRight: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Última cita"
              value={newUltimaCita}
              onChange={(e) => setNewUltimaCita(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="ID (opcional)"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>

          <input
            type="text"
            placeholder="🔍 Buscar paciente"
            className="buscador"
          />

          {pacientes.map((p, i) => (
            <div key={i} className="paciente-item" onClick={() => setSelectedIndex(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: selectedIndex === i ? '#f0f8ff' : 'transparent', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar"></div>
                <div>
                  {editingIndex === i ? (
                    <form onSubmit={saveEdit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} />
                      <input value={editUltimaCita} onChange={(e) => setEditUltimaCita(e.target.value)} />
                      <input value={editId} onChange={(e) => setEditId(e.target.value)} />
                      <button className="btn btn-sm btn-success" type="submit">Guardar</button>
                      <button className="btn btn-sm btn-secondary" type="button" onClick={cancelEdit}>Cancelar</button>
                    </form>
                  ) : (
                    <>
                      <strong>{p.nombre}</strong>
                      <p style={{ margin: 0 }}>Última cita: {p.ultimaCita}</p>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {editingIndex !== i && <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); startEdit(i); }}>Editar</button>}
                <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); deletePatient(i); }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE PACIENTE */}
        <div className="detalle">
          <h4>Detalle del paciente</h4>
          {selectedIndex === null || pacientes[selectedIndex] == null ? (
            <p>Selecciona un paciente para ver los detalles.</p>
          ) : (
            <>
              <div className="detalle-header">
                <div className="avatar-grande"></div>
                <div>
                  <strong>{pacientes[selectedIndex].nombre}</strong>
                  <p>ID: {pacientes[selectedIndex].id}</p>
                </div>
              </div>

              <h5>Historia clínica</h5>
              {detalleEditing ? (
                <form onSubmit={saveDetalle}>
                  <textarea value={detalleText} onChange={(e) => setDetalleText(e.target.value)} rows={6} style={{ width: '100%' }} />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button className="btn btn-sm btn-success" type="submit">Guardar</button>
                    <button className="btn btn-sm btn-secondary" type="button" onClick={cancelDetalleEdit} style={{ marginLeft: '0.5rem' }}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: '0.75rem', borderRadius: '6px' }}>{pacientes[selectedIndex].historia || 'Sin historia clínica registrada.'}</div>
                  <button className="btn btn-sm btn-outline-primary" style={{ marginTop: '0.5rem' }} onClick={startDetalleEdit}>Editar historia clínica</button>
                </>
              )}

              <h5 style={{ marginTop: '1rem' }}>Actividad Clínica</h5>

              <div className="actividad">
                {/* Consulta general */}
                <div className="card" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <h6>🦷 Consulta general</h6>
                  {consultaEditing ? (
                    <form onSubmit={saveConsulta} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="date" value={consultaDate} onChange={(e) => setConsultaDate(e.target.value)} />
                      <button className="btn btn-sm btn-success" type="submit">Guardar</button>
                      <button className="btn btn-sm btn-secondary" type="button" onClick={() => { setConsultaEditing(false); setConsultaDate(pacientes[selectedIndex]?.consultaFecha || ""); }}>Cancelar</button>
                    </form>
                  ) : (
                    <>
                      <div>{consultaDate ? `Fecha: ${consultaDate}` : 'Sin fecha registrada.'}</div>
                      <button className="btn btn-sm btn-outline-primary" style={{ marginTop: '0.5rem' }} onClick={() => setConsultaEditing(true)}>Agregar/Editar fecha</button>
                    </>
                  )}
                </div>

                {/* Tratamiento de ortodoncia */}
                <div className="card" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <h6>🩺 Tratamiento de ortodoncia</h6>
                  {tratamientoEditing ? (
                    <form onSubmit={saveTratamiento} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input placeholder="Tipo" value={tratamientoTipoLocal} onChange={(e) => setTratamientoTipoLocal(e.target.value)} />
                      <select value={tratamientoEstadoLocal} onChange={(e) => setTratamientoEstadoLocal(e.target.value)}>
                        <option>En curso</option>
                        <option>Terminado</option>
                      </select>
                      <button className="btn btn-sm btn-success" type="submit">Guardar</button>
                      <button className="btn btn-sm btn-secondary" type="button" onClick={() => { setTratamientoEditing(false); setTratamientoTipoLocal(pacientes[selectedIndex]?.tratamientoTipo || ""); setTratamientoEstadoLocal(pacientes[selectedIndex]?.tratamientoEstado || "En curso"); }}>Cancelar</button>
                    </form>
                  ) : (
                    <>
                      <div>{tratamientoTipoLocal ? `Tipo: ${tratamientoTipoLocal}` : 'Tipo: -'}</div>
                      <div>{tratamientoEstadoLocal ? `Estado: ${tratamientoEstadoLocal}` : 'Estado: -'}</div>
                      <button className="btn btn-sm btn-outline-primary" style={{ marginTop: '0.5rem' }} onClick={() => setTratamientoEditing(true)}>Editar tratamiento</button>
                    </>
                  )}
                </div>

                {/* Próxima cita */}
                <div className="card" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <h6>📅 Próxima cita</h6>
                  {proximaEditing ? (
                    <form onSubmit={saveProxima} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="date" value={proximaDate} onChange={(e) => setProximaDate(e.target.value)} />
                      <button className="btn btn-sm btn-success" type="submit">Guardar</button>
                      <button className="btn btn-sm btn-secondary" type="button" onClick={() => { setProximaEditing(false); setProximaDate(pacientes[selectedIndex]?.proximaCita || ""); }}>Cancelar</button>
                    </form>
                  ) : (
                    <>
                      <div>{proximaDate ? `Fecha: ${proximaDate}` : 'Sin próxima cita.'}</div>
                      <button className="btn btn-sm btn-outline-primary" style={{ marginTop: '0.5rem' }} onClick={() => setProximaEditing(true)}>Agregar/Editar fecha</button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pacientes;
