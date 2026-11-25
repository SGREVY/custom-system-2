
import "./Sidebar.css";

function Sidebar({ onNavigate, rol, cerrarSesion }) {

    const esRH = rol === "RH";

    return (
        <aside className="sidebar">

            <h2 className="sidebar-logo">Ñustom Ñystem</h2>

            <ul className="sidebar-menu">

                <li onClick={() => onNavigate("inicio")}>
                    Inicio
                </li>

                {esRH ? (
                    <>
                        <li onClick={() => onNavigate("calendario")}>
                            Calendario general
                        </li>

                        <li onClick={() => onNavigate("solicitudes")}>
                            Solicitudes de vacaciones
                        </li>
                    </>
                ) : (
                    <>
                        <li onClick={() => onNavigate("perfil")}>
                            Mi perfil
                        </li>

                        <li onClick={() => onNavigate("calendario")}>
                            Calendario
                        </li>

                        <li onClick={() => onNavigate("vacaciones")}>
                            Mis vacaciones
                        </li>
                    </>
                )}

            </ul>

            <div className="sidebar-bottom">
                <button
                    className="sidebar-logout"
                    onClick={cerrarSesion}
                >
                    Cerrar sesión
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;
