
import { useEffect, useState } from "react";

const API_URL = "https://custom-backend-cxj5.onrender.com";

function Vacaciones({ usuario }) {
    const [solicitudes, setSolicitudes] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    async function cargarSolicitudes() {
        try {
            setCargando(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/vacaciones/${usuario.id}`
            );

            if (!response.ok) {
                throw new Error("No se pudieron cargar las solicitudes.");
            }

            const data = await response.json();
            setSolicitudes(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarSolicitudes();
    }, [usuario.id]);

    async function solicitarVacaciones(event) {
        event.preventDefault();

        setMensaje("");
        setError("");

        if (fechaFin < fechaInicio) {
            setError("La fecha final no puede ser anterior a la inicial.");
            return;
        }

        try {
            setEnviando(true);

            const response = await fetch(
                `${API_URL}/api/vacaciones`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuarioId: usuario.id,
                        fechaInicio,
                        fechaFin
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensaje || "No se pudo enviar la solicitud."
                );
            }

            setMensaje("Tu solicitud fue enviada correctamente.");
            setFechaInicio("");
            setFechaFin("");

            await cargarSolicitudes();

        } catch (error) {
            setError(error.message);
        } finally {
            setEnviando(false);
        }
    }

    function obtenerClaseEstado(estado) {
        switch (estado) {
            case "APROBADA":
                return "estado-aprobada";
            case "RECHAZADA":
                return "estado-rechazada";
            default:
                return "estado-pendiente";
        }
    }

    if (cargando) {
        return <p>Cargando solicitudes...</p>;
    }

    return (
        <div className="vacaciones-container">

            <h1>Mis vacaciones</h1>
            <p>Solicita tus días de vacaciones.</p>

            <form
                className="vacaciones-form"
                onSubmit={solicitarVacaciones}
            >
                <label>Fecha de inicio</label>
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                />

                <label>Fecha de fin</label>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    min={fechaInicio || undefined}
                    required
                />

                <button type="submit" disabled={enviando}>
                    {enviando ? "Enviando..." : "Solicitar vacaciones"}
                </button>
            </form>

            {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            {error && <p className="mensaje-error">{error}</p>}

            <h2>Mis solicitudes</h2>

            {solicitudes.length === 0 ? (
                <p>Aún no tienes solicitudes de vacaciones.</p>
            ) : (
                <div className="solicitudes-lista">
                    {solicitudes.map((solicitud) => (
                        <div className="solicitud-card" key={solicitud.id}>
                            <p>
                                <strong>Desde:</strong>{" "}
                                {solicitud.fechaInicio}
                            </p>

                            <p>
                                <strong>Hasta:</strong>{" "}
                                {solicitud.fechaFin}
                            </p>

                            <span className={obtenerClaseEstado(solicitud.estado)}>
                                {solicitud.estado}
                            </span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Vacaciones;
