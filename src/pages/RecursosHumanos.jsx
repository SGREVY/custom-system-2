
import { useEffect, useState } from "react";

function RecursosHumanos() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(null);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const API = "https://custom-backend-cxj5.onrender.com";

    // ==========================================
    // CARGAR SOLICITUDES
    // ==========================================

    async function cargarSolicitudes() {
        try {
            setCargando(true);
            setError("");

            const respuesta = await fetch(
                `${API}/api/vacaciones/solicitudes`
            );

            if (!respuesta.ok) {
                throw new Error(`Error del servidor: ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            setSolicitudes(datos);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    // ==========================================
    // APROBAR O RECHAZAR SOLICITUD
    // ==========================================

    async function actualizarEstado(id, estado) {
        const accion = estado === "APROBADA" ? "aprobar" : "rechazar";

        const confirmar = window.confirm(
            `¿Estás seguro de que deseas ${accion} esta solicitud?`
        );

        if (!confirmar) return;

        try {
            setActualizando(id);
            setError("");
            setMensaje("");

            const respuesta = await fetch(
                `${API}/api/vacaciones/${id}/estado`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        estado: estado
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.mensaje || "No se pudo actualizar la solicitud."
                );
            }

            setMensaje(datos.mensaje || "Solicitud actualizada correctamente.");

            await cargarSolicitudes();

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setActualizando(null);
        }
    }

    // ==========================================
    // CARGAR AL ABRIR LA PÁGINA
    // ==========================================

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    // ==========================================
    // PANTALLA DE CARGA
    // ==========================================

    if (cargando) {
        return <h2>Cargando solicitudes...</h2>;
    }

    // ==========================================
    // INTERFAZ DE RECURSOS HUMANOS
    // ==========================================

    return (
        <div style={{ padding: "20px" }}>

            <h1>Administración de vacaciones - RH</h1>

            <button onClick={cargarSolicitudes}>
                Actualizar solicitudes
            </button>

            {mensaje && (
                <p style={{ color: "green", marginTop: "15px" }}>
                    {mensaje}
                </p>
            )}

            {error && (
                <p style={{ color: "red", marginTop: "15px" }}>
                    Error: {error}
                </p>
            )}

            {!error && solicitudes.length === 0 && (
                <p>No hay solicitudes de vacaciones.</p>
            )}

            {solicitudes.map((solicitud) => (

                <div
                    key={solicitud.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        marginTop: "20px",
                        borderRadius: "10px",
                        maxWidth: "650px"
                    }}
                >

                    <h3>{solicitud.empleado}</h3>

                    <p>
                        <strong>Departamento:</strong>{" "}
                        {solicitud.departamento}
                    </p>

                    <p>
                        <strong>Puesto:</strong>{" "}
                        {solicitud.puesto}
                    </p>

                    <p>
                        <strong>Desde:</strong>{" "}
                        {solicitud.fechaInicio}
                    </p>

                    <p>
                        <strong>Hasta:</strong>{" "}
                        {solicitud.fechaFin}
                    </p>

                    <p>
                        <strong>Fecha de solicitud:</strong>{" "}
                        {solicitud.fechaSolicitud}
                    </p>

                    <p>
                        <strong>Estado:</strong>{" "}
                        <span
                            style={{
                                fontWeight: "bold",
                                color:
                                    solicitud.estado === "APROBADA"
                                        ? "green"
                                        : solicitud.estado === "RECHAZADA"
                                            ? "red"
                                            : "#d97706"
                            }}
                        >
                            {solicitud.estado}
                        </span>
                    </p>

                    {solicitud.estado === "PENDIENTE" && (

                        <div style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "15px"
                        }}>

                            <button
                                onClick={() =>
                                    actualizarEstado(
                                        solicitud.id,
                                        "APROBADA"
                                    )
                                }
                                disabled={actualizando !== null}
                                style={{
                                    background: "#16a34a",
                                    color: "white",
                                    padding: "10px 15px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                {actualizando === solicitud.id
                                    ? "Procesando..."
                                    : "Aprobar"}
                            </button>

                            <button
                                onClick={() =>
                                    actualizarEstado(
                                        solicitud.id,
                                        "RECHAZADA"
                                    )
                                }
                                disabled={actualizando !== null}
                                style={{
                                    background: "#dc2626",
                                    color: "white",
                                    padding: "10px 15px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                {actualizando === solicitud.id
                                    ? "Procesando..."
                                    : "Rechazar"}
                            </button>

                        </div>
                    )}

                </div>
            ))}

        </div>
    );
}

export default RecursosHumanos;
