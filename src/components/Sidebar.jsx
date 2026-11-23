
import "./Sidebar.css";

function Sidebar({ onNavigate }) {

    return (
        <aside className="sidebar">

            <h2 className="sidebar-logo">Ñustom Ñystem</h2>

            <ul className="sidebar-menu">

                <li onClick={() => onNavigate("inicio")}>
                    Inicio
                </li>

                <li onClick={() => onNavigate("perfil")}>
                    Mi perfil
                </li>

                <li>Usuarios</li>
                <li>Inventario</li>
                <li>Compras</li>
                <li>Ventas</li>
                <li>Reportes</li>
                <li>Configuración</li>

            </ul>

        </aside>
    );
}

export default Sidebar;
