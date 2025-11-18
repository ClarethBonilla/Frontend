import React, { useState, useEffect } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, addDays, isSameDay, isBefore, startOfDay } from "date-fns";
import "./Calendar.css";
import Nabvar from "./Nabvar";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

export default function CalendarGoogleStyle() {
  const { usuario, token } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [citas, setCitas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    paciente: "",
    tratamiento: "",
    hora: "09:00",
    reminderMethod: "email",
    notas: "",
    telefono: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotOrder, setSlotOrder] = useState("popular");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonthModal, setCurrentMonthModal] = useState(new Date());

  const nextMonthModal = () => setCurrentMonthModal(addMonths(currentMonthModal, 1));
  const prevMonthModal = () => setCurrentMonthModal(subMonths(currentMonthModal, 1));

  // Calendar for modal: similar to generateCalendar but doesn't open/close modal
  const generateCalendarForModal = () => {
    const monthStart = startOfMonth(currentMonthModal);
    const monthEnd = endOfMonth(currentMonthModal);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let day = weekStart;

    while (day <= weekEnd) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const citasDelDia = getCitasDelDia(day);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = startOfMonth(day).getMonth() === currentMonthModal.getMonth();

        days.push(
          <div
            key={day.toString()}
            className={`calendar-cell ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""}`}
            onClick={() => handleModalSelectDate(new Date(day))}
            style={{ cursor: "pointer" }}
          >
            <div className="calendar-number">{format(day, "d")}</div>
            <div className="calendar-events">
              {citasDelDia.slice(0, 2).map(c => (
                <div key={c._id} className="event-dot" title={c.paciente}>
                  {c.paciente.split(" ")[0]}
                </div>
              ))}
              {citasDelDia.length > 2 && <div className="event-more">+{citasDelDia.length - 2}</div>}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="calendar-row" key={day.toString()}>
          {days}
        </div>
      );
    }

    return <div className="calendar-grid modal-mini">{rows}</div>;
  };

  const handleModalSelectDate = (date) => {
    setSelectedDate(date);
    setCurrentMonthModal(startOfMonth(date));
    // do not close modal; prefill form date
    setFormData({ ...formData });
  };

  // Cargar citas desde la API
  useEffect(() => {
    if (token) {
      cargarCitas();
    }
  }, [token]);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/citas`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Error cargando citas");
      const data = await response.json();
      setCitas(data);
    } catch (err) {
      console.error("Error cargando citas:", err);
      setError("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Obtener citas de un día específico
  const getCitasDelDia = (date) => {
    return citas.filter(c => isSameDay(new Date(c.fecha), date));
  };

  // Seleccionar fecha en mini-calendario sin abrir el modal
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    // don't open form when selecting from mini calendar
    setShowForm(false);
    setError("");
  };

  // Manejar clic en fecha
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({ paciente: "", tratamiento: "", hora: "09:00", reminderMethod: "email", notas: "", telefono: "", email: "" });
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  // Fetch available slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!token || !selectedDate) return;
      try {
        const fechaISO = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(`${API_BASE_URL}/api/citas/horarios?fecha=${fechaISO}&slot=30&order=${slotOrder}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Error cargando horarios");
        const data = await response.json();
        setAvailableSlots(data);
      } catch (err) {
        console.error(err);
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [token, selectedDate, slotOrder]);

  // Guardar cita
  const handleSaveCita = async (e) => {
    e.preventDefault();
    if (!formData.paciente || !formData.tratamiento || !selectedDate) {
      setError("Por favor completa paciente, tratamiento y fecha");
      return;
    }

    try {
      setLoading(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `${API_BASE_URL}/api/citas/${editingId}`
        : `${API_BASE_URL}/api/citas`;

      const fechaISO = format(selectedDate, "yyyy-MM-dd");
      const body = {
        ...formData,
        fecha: fechaISO
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error guardando cita");
      }

      await cargarCitas();
      setShowForm(false);
      setSelectedDate(null);
      setFormData({ paciente: "", tratamiento: "", hora: "09:00", reminderMethod: "email", notas: "", telefono: "", email: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Editar cita
  const handleEditCita = (cita) => {
    const citaDate = new Date(cita.fecha);
    setSelectedDate(citaDate);
    setFormData({
      paciente: cita.paciente,
      tratamiento: cita.tratamiento,
      hora: cita.hora,
      reminderMethod: cita.reminderMethod || "email",
      notas: cita.notas || "",
      telefono: cita.telefono || "",
      email: cita.email || ""
    });
    setEditingId(cita._id);
    setError("");
    setShowForm(true);
  };

  // Eliminar cita
  const handleDeleteCita = async (id) => {
    if (window.confirm("¿Eliminar esta cita?")) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/citas/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error eliminando cita");
        await cargarCitas();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Generar celdas del calendario
  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let day = weekStart;

    while (day <= weekEnd) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const citasDelDia = getCitasDelDia(day);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = startOfMonth(day).getMonth() === currentMonth.getMonth();

        days.push(
          <div
            key={day.toString()}
            className={`calendar-cell ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""}`}
            onClick={() => isCurrentMonth && (viewMode === 'agenda' ? handleSelectDate(new Date(day)) : handleDateClick(new Date(day)))}
            style={{ cursor: "pointer" }}
          >
            <div className="calendar-number">{format(day, "d")}</div>
            <div className="calendar-events">
              {citasDelDia.slice(0, 2).map(c => (
                <div key={c._id} className="event-dot" title={c.paciente}>
                  {c.paciente.split(" ")[0]}
                </div>
              ))}
              {citasDelDia.length > 2 && <div className="event-more">+{citasDelDia.length - 2}</div>}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="calendar-row" key={day.toString()}>
          {days}
        </div>
      );
    }

    return <div className="calendar-grid">{rows}</div>;
  };

  // Vista de agenda de próximas citas
  const nextSevenDays = () => {
    const today = startOfDay(new Date());
    return citas
      .filter(c => !isBefore(new Date(c.fecha), today) && c.estado !== 'cancelada')
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(0, 10);
  };

  if (!usuario) {
    return (
      <div className="calendar-wrapper">
        <Nabvar />
        <div className="calendar-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '16px', color: '#999' }}>Por favor inicia sesión para ver tus citas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-wrapper">
      <Nabvar />

      <div className="calendar-container">
        {error && <div className="alert alert-danger">{error}</div>}

        {/* TOP BAR */}
        <div className="calendar-header">
          <div className="header-left">
            <button className="btn btn-light" onClick={() => setCurrentMonth(new Date())}>
              Hoy
            </button>
            <button className="btn-arrow" onClick={prevMonth}>◀</button>
            <button className="btn-arrow" onClick={nextMonth}>▶</button>
            <h3 className="calendar-title">{format(currentMonth, "MMMM yyyy")}</h3>
          </div>

          <div className="header-right">
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="btn btn-light">
              <option value="month">Mes</option>
              <option value="agenda">Agenda</option>
            </select>
          </div>
        </div>

        {viewMode === "month" ? (
          <>
            {/* WEEK DAYS */}
            <div className="calendar-weekdays">
              {["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"].map((d) => (
                <div key={d} className="weekday">{d}</div>
              ))}
            </div>

            {/* GRID */}
            {generateCalendar()}
          </>
        ) : (
          <div className="agenda-view two-column">
            <div className="agenda-left">
              <div className="mini-cal-header">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn btn-light" onClick={() => setCurrentMonth(new Date())}>Hoy</button>
                  <button className="btn-arrow" onClick={prevMonth}>◀</button>
                  <button className="btn-arrow" onClick={nextMonth}>▶</button>
                </div>
                <h5 style={{ marginTop: '8px' }}>{format(currentMonth, 'MMMM yyyy')}</h5>
              </div>
              {/** Reuse calendar grid as a mini calendar */}
              <div className="mini-calendar">{generateCalendar()}</div>
            </div>

            <div className="agenda-right">
              <h4>Próximas citas</h4>
              <div style={{ marginBottom: 12 }}>
                <button className="btn btn-primary" onClick={() => { setFormData({ ...formData, hora: '09:00' }); setShowForm(true); }} disabled={!selectedDate}>Nueva cita</button>
              </div>
              {selectedDate && (
                <div className="available-slots">
                  <h5>Horarios disponibles</h5>
                  {availableSlots && availableSlots.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {availableSlots.map(s => (
                        <button
                          key={s.iso}
                          className={`btn btn-outline-secondary ${selectedSlot === s.time ? 'slot-selected' : ''}`}
                          onClick={() => { setSelectedSlot(s.time); setFormData({ ...formData, hora: s.time }); setShowForm(true); }}
                        >
                          {s.time}{s.count ? ` (${s.count})` : ''}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginBottom: 12 }}>
                      <p>No hay horarios disponibles para esta fecha.</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedDate(new Date(selectedDate.getTime() + 24*60*60*1000)); setSelectedSlot(null); }}>Ver siguiente día</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => { setSelectedDate(new Date(selectedDate.getTime() - 24*60*60*1000)); setSelectedSlot(null); }}>Ver día anterior</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedDate ? (
                <div className="agenda-list">
                  {getCitasDelDia(selectedDate).length > 0 ? (
                    getCitasDelDia(selectedDate).map(cita => (
                      <div key={cita._id} className="agenda-item">
                        <div className="agenda-date">{format(new Date(cita.fecha), "dd MMM yyyy")}</div>
                        <div className="agenda-time">{cita.hora}</div>
                        <div className="agenda-details">
                          <strong>{cita.paciente}</strong>
                          <p>{cita.tratamiento}</p>
                          {cita.notas && <p className="notes">{cita.notas}</p>}
                          <span className={`badge badge-${cita.estado}`}>{cita.estado}</span>
                        </div>
                        <div className="agenda-actions">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEditCita(cita)} disabled={loading}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCita(cita._id)} disabled={loading}>🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-events">No hay citas para {format(selectedDate, 'dd/MM/yyyy')}</p>
                  )}
                </div>
              ) : (
                <div className="agenda-list">
                  {nextSevenDays().length > 0 ? (
                    nextSevenDays().map(cita => (
                      <div key={cita._id} className="agenda-item">
                        <div className="agenda-date">{format(new Date(cita.fecha), "dd MMM yyyy")}</div>
                        <div className="agenda-time">{cita.hora}</div>
                        <div className="agenda-details">
                          <strong>{cita.paciente}</strong>
                          <p>{cita.tratamiento}</p>
                          {cita.notas && <p className="notes">{cita.notas}</p>}
                          <span className={`badge badge-${cita.estado}`}>{cita.estado}</span>
                        </div>
                        <div className="agenda-actions">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEditCita(cita)} disabled={loading}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCita(cita._id)} disabled={loading}>🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-events">No hay citas próximas</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE FORMULARIO */}
      {showForm && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{editingId ? "Editar cita" : "Nueva cita"}</h4>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSaveCita} className="cita-form">
              <div className="modal-calendar-row">
                <div className="modal-calendar-controls">
                  <button type="button" className="btn btn-light" onClick={() => setCurrentMonthModal(new Date())}>Hoy</button>
                  <button type="button" className="btn-arrow" onClick={prevMonthModal}>◀</button>
                  <button type="button" className="btn-arrow" onClick={nextMonthModal}>▶</button>
                  <h6 style={{ marginLeft: 8 }}>{format(currentMonthModal, 'MMMM yyyy')}</h6>
                </div>
                <div className="modal-calendar">{generateCalendarForModal()}</div>
              </div>
              <div className="form-group">
                <label>Fecha: {format(selectedDate, "dd/MM/yyyy")}</label>
              </div>

              <div className="form-group">
                <label htmlFor="paciente">Paciente:</label>
                <input
                  type="text"
                  id="paciente"
                  placeholder="Nombre del paciente"
                  value={formData.paciente}
                  onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tratamiento">Tratamiento:</label>
                <select
                  id="tratamiento"
                  value={formData.tratamiento}
                  onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                  required
                >
                  <option value="">Selecciona un tratamiento</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Blanqueamiento">Blanqueamiento</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Extracción">Extracción</option>
                  <option value="Implante">Implante</option>
                  <option value="Consulta general">Consulta general</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ordenar horarios:</label>
                <select value={slotOrder} onChange={(e) => setSlotOrder(e.target.value)} className="form-control">
                  <option value="popular">Por demanda (más solicitados)</option>
                  <option value="spread">Menos solicitados</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hora">Hora:</label>
                <select
                  id="hora"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {availableSlots.map((s) => (
                    <option key={s.iso || s.time} value={s.time}>{s.time}{s.count ? ` (${s.count})` : ''}</option>
                  ))}
                  {editingId && formData.hora && !availableSlots.find(s => s.time === formData.hora) && (
                    <option value={formData.hora}>{formData.hora} (actual)</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reminderMethod">Recordatorio:</label>
                <select
                  id="reminderMethod"
                  value={formData.reminderMethod}
                  onChange={(e) => setFormData({ ...formData, reminderMethod: e.target.value })}
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="both">Ambos</option>
                  <option value="none">Ninguno</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  placeholder="Teléfono del paciente"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email del paciente"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notas">Notas:</label>
                <textarea
                  id="notas"
                  placeholder="Notas adicionales..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : editingId ? "Actualizar" : "Agendar"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={loading}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
