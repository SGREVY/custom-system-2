
import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Perfil from "./pages/Perfil";
import Calendario from "./pages/Calendario";

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

    // Sección actual del ERP
    const [seccion, setSeccion] = useState("inicio");

    // Cambiar sección
    function cambiarSeccion(nuevaSeccion) {
        setSeccion(nuevaSeccion);
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
            setSeccion("inicio");
            setContrasena("");

        } catch (error) {
            console.error(error);
            setError("No se pudo conectar con el servidor");

        } finally {
            setCargando(false);
        }
    }

    // Obtener información del empleado
    useEffect(() => {

        if (!usuario) return;

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

    // Si el usuario inició sesión, mostrar ERP
    if (usuario) {
        return (
            <div className="app-layout">

                <Sidebar onNavigate={cambiarSeccion} />

                <main className="dashboard">

                    {seccion === "inicio" && (
                        <div>
                            <h1>Bienvenido, {usuario.nombre}</h1>
                            <p>Bienvenido a Ñustom Ñystem.</p>
                        </div>
                    )}

                    {seccion === "perfil" && (
                        <Perfil usuario={usuario} />
                    )}

                    {seccion === "calendario" && (
                        cargandoEmpleado
                            ? <p>Cargando información del empleado...</p>
                            : errorEmpleado
                                ? <p>{errorEmpleado}</p>
                                : empleado
                                    ? <Calendario empleado={empleado} />
                                    : <p>No se encontró el empleado.</p>
                    )}

                </main>

            </div>
        );
    }

    // Pantalla de inicio de sesión
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
                        <p style={{ color: "red" }}>{error}</p>
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
