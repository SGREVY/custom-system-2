
import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Perfil from "./pages/Perfil";
import Calendario from "./pages/Calendario";
import Vacaciones from "./pages/Vacaciones";
import RecursosHumanos from "./pages/RecursosHumanos";

function App() {

    // Datos del inicio de sesión
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Usuario autenticado
    const [usuario, setUsuario] = useState(null);

    // Información del empleado
    const [empleado, setEmpleado] = useState(null);
    const [cargandoEmpleado, setCargandoEmpleado] = useState(false);
    const [errorEmpleado, setErrorEmpleado] = useState("");

    // Sección actual
    const [seccion, setSeccion] = useState("inicio");

    // Cambiar sección
    function cambiarSeccion(nuevaSeccion) {
        setSeccion(nuevaSeccion);
    }

    // Cerrar sesión
    function cerrarSesion() {
        setUsuario(null);
        setEmpleado(null);
        setSeccion("inicio");
        setCorreo("");
        setContrasena("");
        setError("");
    }

    // Iniciar sesión
    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setCargando(true);

        try {
            const response = await fetch(
                "https://custom-backend-cxj5.onrender.com/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo,
                        contrasena
                    })
                }
            );

            if (!response.ok) {
                setError("Correo o contraseña incorrectos");
                return;
            }

            const data = await response.json();

            setUsuario(data);
            setEmpleado(null);
            setSeccion("inicio");
            setContrasena("");

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");

        } finally {
            setCargando(false);
        }
    }

    // Cargar información del empleado
    useEffect(() => {

        if (!usuario) {
            setEmpleado(null);
            return;
        }

        // RH no necesita perfil de empleado
        if (usuario.rol === "RH") {
            setEmpleado(null);
            setCargandoEmpleado(false);
            return;
        }

        async function cargarEmpleado() {
            setCargandoEmpleado(true);
            setErrorEmpleado("");

            try {
                const response = await fetch(
                    `https://custom-backend-cxj5.onrender.com/api/perfil/${usuario.id}`
                );

                if (!response.ok) {
                    throw new Error("No se pudo obtener el perfil del empleado");
                }

                const data = await response.json();
                setEmpleado(data);

            } catch (error) {
                console.error(error);
                setErrorEmpleado(error.message);

            } finally {
                setCargandoEmpleado(false);
            }
        }

        cargarEmpleado();

    }, [usuario]);

    // ==========================================
    // PANEL DEL ERP
    // ==========================================

    if (usuario) {

        const esRH = usuario.rol === "RH";

        return (
            <div className="app-layout">

                <Sidebar
                    onNavigate={cambiarSeccion}
                    rol={usuario.rol}
                    cerrarSesion={cerrarSesion}
                />

                <main className="dashboard">

                    {/* INICIO */}
                    {seccion === "inicio" && (
                        <div>
                            <h1>
                                Bienvenido, {usuario.nombre}
                            </h1>

                            {esRH ? (
                                <p>
                                    Panel de Recursos Humanos de Ñustom Ñystem.
                                </p>
                            ) : (
                                <p>
                                    Bienvenido a Ñustom Ñystem.
                                </p>
                            )}
                        </div>
                    )}

                    {/* PERFIL DEL EMPLEADO */}
                    {seccion === "perfil" && !esRH && (
                        <Perfil usuario={usuario} />
                    )}

                    {/* CALENDARIO */}
                    {seccion === "calendario" && (
                        esRH ? (
                            <div>
                                <h1>Calendario general</h1>
                                <p>
                                    Consulta los horarios y vacaciones de los empleados.
                                </p>
                            </div>
                        ) : (
                            cargandoEmpleado
                                ? <p>Cargando información del empleado...</p>
                                : errorEmpleado
                                    ? <p>{errorEmpleado}</p>
                                    : empleado
                                        ? <Calendario empleado={empleado} />
                                        : <p>No se encontró el empleado.</p>
                        )
                    )}

                    {/* VACACIONES DEL EMPLEADO */}
                    {seccion === "vacaciones" && !esRH && (
                        <Vacaciones
                            usuario={usuario}
                            empleado={empleado}
                        />
                    )}

                    {/* ADMINISTRACIÓN DE RH */}
                    {seccion === "solicitudes" && esRH && (
                        <RecursosHumanos usuario={usuario} />
                    )}

                </main>

            </div>
        );
    }

    // ==========================================
    // LOGIN
    // ==========================================

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Ñustom Ñystem</h1>
                <p>Inicia sesión en tu cuenta</p>

                <form onSubmit={handleSubmit}>

                    <label>Correo</label>

                    <input
                        type="email"
                        value={correo}
                        onChange={(event) => setCorreo(event.target.value)}
                        placeholder="correo@empresa.com"
                        required
                    />

                    <label>Contraseña</label>

                    <input
                        type="password"
                        value={contrasena}
                        onChange={(event) => setContrasena(event.target.value)}
                        placeholder="Contraseña"
                        required
                    />

                    {error && (
                        <p style={{ color: "red" }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default App;
