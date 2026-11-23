
import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Perfil from "./pages/Perfil";

function App() {
    // Datos del inicio de sesión
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Usuario autenticado
    const [usuario, setUsuario] = useState(null);

    // Sección actual del ERP
    const [seccion, setSeccion] = useState("inicio");

    // Cambiar sección
    function cambiarSeccion(nuevaSeccion) {
        console.log("Cambiando sección a:", nuevaSeccion);
        setSeccion(nuevaSeccion);
    }

    // Iniciar sesión
    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setCargando(true);

        try {
            const response = await fetch(
                "http://localhost:5202/api/login",
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
