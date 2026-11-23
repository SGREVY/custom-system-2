
import { useEffect, useState } from "react";
import "../css/Perfil.css";

function Perfil({ usuario }) {

    const [empleado, setEmpleado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarPerfil() {
            try {
                const response = await fetch(
                    `http://localhost:5202/api/perfil/${usuario.id}`
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

    // Mientras carga la información
    if (cargando) {
        return <div className="perfil-container">Cargando perfil...</div>;
    }

    // Si ocurre un error
    if (error) {
        return <div className="perfil-container">{error}</div>;
    }

    // Si no existe información
    if (!empleado) {
        return <div className="perfil-container">No se encontró el perfil.</div>;
    }

    // Calcular antigüedad aproximada
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

    
return (
    <div className="perfil-container">

        {/* Encabezado del perfil */}
        <div className="perfil-user">
            <div className="perfil-avatar">
                <span>
                    {empleado.nombre.charAt(0).toUpperCase()}
                </span>
            </div>

            <div className="perfil-user-info">
                <h1>{empleado.nombre} {empleado.apellido}</h1>
                <p>{usuario.correo}</p>
                <span className={empleado.activo ? "estado-activo" : "estado-inactivo"}>
                    {empleado.activo ? "Activo" : "Inactivo"}
                </span>
            </div>
        </div>

        {/* Información personal */}
        <div className="perfil-information">
            <h2>Información personal</h2>

            <div className="perfil-field">
                <span>Teléfono</span>
                <strong>{empleado.telefono || "No registrado"}</strong>
            </div>

            <div className="perfil-field">
                <span>Puesto</span>
                <strong>{empleado.puesto || "No registrado"}</strong>
            </div>

            <div className="perfil-field">
                <span>Departamento</span>
                <strong>{empleado.departamento || "No registrado"}</strong>
            </div>

            <div className="perfil-field">
                <span>Fecha de ingreso</span>
                <strong>{fechaIngreso.toLocaleDateString("es-MX")}</strong>
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
                    <span>Según días correspondientes y vacaciones utilizadas</span>
                </div>

                <div className="perfil-resumen-card antiguedad">
                    <div className="perfil-resumen-icono">
                        <span>◷</span>
                    </div>
                    <h3>Antigüedad laboral</h3>
                    <p className="perfil-number">{anios} años</p>
                    <span>Tiempo de servicio en la empresa</span>
                </div>

            </div>
        </div>

    </div>
);

}

export default Perfil;
