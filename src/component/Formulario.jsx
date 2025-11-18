import sura from './../assets/img/sura.png'
import nuevaEPS from './../assets/img/nuevaEPS.png'
import sanitas from './../assets/img/sanitas.png'
import sonrisa from './../assets/img/sonrisa.png'
import Nabvar from './Nabvar'
import Footer from './Footer'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import './Formulario.css'
import { API_BASE_URL } from './../config/api'

function Formulario() {
    const [fecha, setFecha] = useState(new Date());
    const [ocupadas, setOcupadas] = useState([]);

    const [paciente, setPaciente] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [tratamiento, setTratamiento] = useState("");
    const [eps, setEps] = useState("");
    const [notas, setNotas] = useState("");
    const [reminderMethod, setReminderMethod] = useState("email");

    const ahora = new Date();

    // Fetch de fechas ocupadas
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/citas/ocupadas`)
            .then((res) => res.json())
            .then((data) => {
                const fechasConvertidas = data.map((cita) => new Date(cita.fecha));
                setOcupadas(fechasConvertidas);
            })
            .catch((err) => console.error(err));
    }, []);

    // 🟦 ENVIAR CITA AL BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paciente || !telefono || !tratamiento || !fecha) {
            alert("Paciente, teléfono, tratamiento y fecha son requeridos");
            return;
        }

        // Validar que la fecha sea futura
        if (fecha < ahora) {
            alert("No puedes agendar citas en el pasado");
            return;
        }

        // Formato requerido por backend:
        const fechaISO = fecha.toISOString().split("T")[0]; // → “2025-02-20”
        const hora = fecha.toTimeString().slice(0, 5);       // → “14:30”

        const datos = {
            paciente,
            telefono,
            email,
            tratamiento,
            fecha: fechaISO,
            hora,
            eps,
            notas,
            reminderMethod
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/citas/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // si usas login
                },
                body: JSON.stringify(datos),
            });

            const respuesta = await res.json();

            if (!res.ok) {
                alert(respuesta.error || "Error al crear la cita");
                return;
            }

            alert("Cita creada con éxito");
            // Limpiar formulario
            setPaciente("");
            setTelefono("");
            setEmail("");
            setTratamiento("");
            setEps("");
            setNotas("");
            setFecha(new Date());
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    };

    return (
        <>
            <Nabvar />
            <div class="row p-5">
                <div class="col px-5">
                    <p class="fs-1 fw-bold">¡Agenda tu cita en segundos!</p>
                    <p class="fs-5">
                        Completa este sencillo formulario y nuestro equipo se pondrá en contacto contigo para confirmar tu
                        visita. Tu sonrisa lo merece.
                    </p>
                    <p class="text-primary fs-3 fw-bold">CONVENIOS CON EPS</p>
                    <div class="d-flex"></div>
                    <img src={nuevaEPS} class="img-fluid w-25" alt="..." />
                    <img src={sura} class="img-fluid w-25" alt="..." />
                    <img src={sanitas} class="img-fluid w-25" alt="..." />
                </div>
                <div class="col text-center">
                    <img src={sonrisa} class="img-fluid w-75" alt="..." />
                </div>
            </div>
            <div class="row p-5 justify-content-center">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <form className="card border-primary-subtle" onSubmit={handleSubmit}>
                        <div className="card-body">
                            <h5 className="card-title text-center text-primary fw-bold fs-2">AGENDA TU CITA</h5>
                            <p className="card-text text-center text-primary">Completa los siguientes campos</p>

                            {/* NOMBRE */}
                            <div className="mb-3">
                                <label className="form-label">NOMBRE COMPLETO</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={paciente}
                                    onChange={(e) => setPaciente(e.target.value)}
                                    placeholder="Ingresa tu nombre"
                                />
                            </div>

                            {/* TELEFONO */}
                            <div className="mb-3">
                                <label className="form-label">TELÉFONO</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="Ingresa tu número telefónico"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="mb-3">
                                <label className="form-label">CORREO ELECTRÓNICO</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Ingresa tu correo"
                                />
                            </div>

                            {/* TIPO DE SERVICIO */}
                            <div className="mb-3">
                                <label className="form-label">TIPO DE SERVICIO</label>
                                <select
                                    className="form-select"
                                    value={tratamiento}
                                    onChange={(e) => setTratamiento(e.target.value)}
                                >
                                    <option disabled value="">Servicio requerido</option>
                                    <option value="Limpieza">Limpieza</option>
                                    <option value="Ortodoncia">Ortodoncia</option>
                                    <option value="Blanqueamiento">Blanqueamiento</option>
                                    <option value="Urgencias">Urgencias</option>
                                </select>
                            </div>

                            {/* FECHA Y HORA */}
                            <div className="mb-3">
                                <label className="form-label">FECHA Y HORA</label>
                                <DatePicker
                                    selected={fecha}
                                    onChange={(date) => setFecha(date)}
                                    showTimeSelect
                                    dateFormat="MMMM yyyy   HH:mm"
                                    minDate={ahora}
                                    minTime={fecha.toDateString() === ahora.toDateString() ? ahora : new Date(0, 0, 0)}
                                    maxTime={new Date(0, 0, 0, 23, 59)}
                                    locale={es}
                                />
                            </div>

                            {/* EPS */}
                            <div className="mb-3">
                                <label className="form-label">CONVENIO CON EPS</label>
                                <select
                                    className="form-select"
                                    value={eps}
                                    onChange={(e) => setEps(e.target.value)}
                                >
                                    <option disabled value="">Ingresa tu EPS</option>
                                    <option value="Nueva EPS">Nueva EPS</option>
                                    <option value="Sura">Sura</option>
                                    <option value="Sanitas">Sanitas</option>
                                </select>
                            </div>

                            {/* NOTAS */}
                            <div className="mb-3">
                                <label className="form-label">NOTAS ADICIONALES</label>
                                <textarea
                                    className="form-control"
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Cuéntanos cualquier detalle importante..."
                                    rows="3"
                                />
                            </div>

                            {/* MÉTODO DE RECORDATORIO */}
                            <div className="mb-3">
                                <label className="form-label">RECORDATORIO</label>
                                <select
                                    className="form-select"
                                    value={reminderMethod}
                                    onChange={(e) => setReminderMethod(e.target.value)}
                                >
                                    <option value="email">Correo Electrónico</option>
                                    <option value="sms">SMS</option>
                                    <option value="whatsapp">WhatsApp</option>
                                </select>
                            </div>
                        </div>

                        <div className="card-footer text-center py-3">
                            <button type="submit" className="btn btn-secondary w-75 border-primary-subtle">
                                CONFIRMA TU CITA
                            </button>
                        </div>
                    </form>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default Formulario