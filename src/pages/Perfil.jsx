
import { useEffect, useState } from "react";
import "../css/Perfil.css";

// Imágenes personalizadas por empleado
const imagenesPorEmpleado = {
    1: {
        fondo: "/images/fondo-ivan.jpg",
        perfil: "/images/ivan.jpg"
    },
    2: {
        fondo: "/images/jefe_maestro.jpg",
        perfil: "/images/kratos_babo.JPG"
    }
};

function Perfil({ usuario }) {

    const [empleado, setEmpleado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarPerfil() {
            setCargando(true);
            setError("");

            try {
                const response = await fetch(
                    `https://custom-backend-cxj5.onrender.com/api/perfil/${usuario.id}`
                );

                if (!response.ok) {
                    throw new Error("No se pudo obtener el perfil");
                }

                const data = await response.json();
                setEmpleado(data);

            } catch (error) {
                console.error(error);
                setError(error.message);

            } finally {
                setCargando(false);
            }
        }

        cargarPerfil();

    }, [usuario.id]);

    if (cargando) {
        return <div className="perfil-container">Cargando perfil...</div>;
    }

    if (error) {
        return <div className="perfil-container">{error}</div>;
    }

    if (!empleado) {
        return <div className="perfil-container">No se encontró el perfil.</div>;
    }

    // Calcular antigüedad laboral
    const fechaIngreso = new Date(empleado.fechaIngreso);
    const hoy = new Date();

    let anios = hoy.getFullYear() - fechaIngreso.getFullYear();

    const aniversario = new Date(
        hoy.getFullYear(),
        fechaIngreso.getMonth(),
        fechaIngreso.getDate()
    );

    if (hoy < aniversario) {
        anios--;
    }

    // Obtener imágenes del empleado
    const imagenes = imagenesPorEmpleado[empleado.id] || {
        fondo: "",
        perfil: ""
    };

    return (
        <div className="perfil-container">

            {/* Encabezado con fondo personalizado */}
            <div className="perfil-encabezado">

                <div
                    className="perfil-fondo"
                    style={{
                        backgroundImage: imagenes.fondo
                            ? `url(${imagenes.fondo})`
                            : "linear-gradient(135deg, #1e293b, #475569)"
                    }}
                />

                <div className="perfil-user">

                    <div className="perfil-avatar">

                        {imagenes.perfil ? (
                            <img
                                src={imagenes.perfil}
                                alt={`Fotografía de ${empleado.nombre}`}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <span>
                                {empleado.nombre.charAt(0).toUpperCase()}
                            </span>
                        )}

                    </div>

                    <div className="perfil-user-info">

                        <h1>
                            {empleado.nombre} {empleado.apellido}
                        </h1>

                        <p>{usuario.correo}</p>

                        <span className={
                            empleado.activo
                                ? "estado-activo"
                                : "estado-inactivo"
                        }>
                            {empleado.activo ? "Activo" : "Inactivo"}
                        </span>

                    </div>

                </div>

            </div>

            {/* Información personal */}
            <div className="perfil-information">

                <h2>Información personal</h2>

                <div className="perfil-field">
                    <span>Teléfono</span>
                    <strong>
                        {empleado.telefono || "No registrado"}
                    </strong>
                </div>

                <div className="perfil-field">
                    <span>Puesto</span>
                    <strong>
                        {empleado.puesto || "No registrado"}
                    </strong>
                </div>

                <div className="perfil-field">
                    <span>Departamento</span>
                    <strong>
                        {empleado.departamento || "No registrado"}
                    </strong>
                </div>

                <div className="perfil-field">
                    <span>Fecha de ingreso</span>
                    <strong>
                        {fechaIngreso.toLocaleDateString("es-MX")}
                    </strong>
                </div>

            </div>

            {/* Resumen laboral */}
            <div className="perfil-resumen">

                <h2>Resumen laboral</h2>

                <div className="perfil-resumen-grid">

                    <div className="perfil-resumen-card vacaciones">

                        <div className="perfil-resumen-icono">
                            <span>▦</span>
                        </div>

                        <h3>Vacaciones disponibles</h3>

                        <p className="perfil-number">Pendiente</p>

                        <span>
                            Según días correspondientes y vacaciones utilizadas
                        </span>

                    </div>

                    <div className="perfil-resumen-card antiguedad">

                        <div className="perfil-resumen-icono">
                            <span>◷</span>
                        </div>

                        <h3>Antigüedad laboral</h3>

                        <p className="perfil-number">
                            {anios} años
                        </p>

                        <span>
                            Tiempo de servicio en la empresa
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Perfil;
