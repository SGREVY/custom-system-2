
import { useEffect, useState } from "react";
import "../css/Calendario.css";

const API_URL = "https://custom-backend-cxj5.onrender.com";

const diasSemana = [
    "Lunes", "Martes", "Miércoles", "Jueves",
    "Viernes", "Sábado", "Domingo"
];

const meses = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function Calendario() {
    const fechaActual = new Date();

    const [mes, setMes] = useState(fechaActual.getMonth() + 1);
    const [anio, setAnio] = useState(fechaActual.getFullYear());

    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarCalendario() {
            setCargando(true);
            setError("");

            try {
                const response = await fetch(
                    `${API_URL}/api/calendario?anio=${anio}&mes=${mes}`
                );

                if (!response.ok) {
                    throw new Error("No se pudo cargar el calendario");
                }

                const data = await response.json();
                setEmpleados(data.empleados);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }

        cargarCalendario();
    }, [mes, anio]);

    function cambiarMes(direccion) {
        const nuevaFecha = new Date(anio, mes - 1 + direccion, 1);

        setMes(nuevaFecha.getMonth() + 1);
        setAnio(nuevaFecha.getFullYear());
    }

    // Obtener cantidad de días del mes
    const diasDelMes = new Date(anio, mes, 0).getDate();

    // Obtener el día de la semana del primer día
    // Convertimos domingo (0) en 6 para comenzar en lunes
    const primerDia = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;

    // Crear las casillas del calendario
    const casillas = [
        ...Array(primerDia).fill(null),
        ...Array.from({ length: diasDelMes }, (_, i) => i + 1)
    ];

    function obtenerEventos(dia) {
        const fecha = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const eventos = [];

        empleados.forEach(empleado => {
            // Descanso semanal
            const diaSemana = new Date(anio, mes - 1, dia).getDay();

            if (empleado.diaDescanso === diaSemana) {
                eventos.push({
                    tipo: "descanso",
                    texto: `${empleado.nombre} ${empleado.apellido}`
                });
            }

            // Guardia mensual
            if (empleado.guardia === fecha) {
                eventos.push({
                    tipo: "guardia",
                    texto: `${empleado.nombre} ${empleado.apellido}`
                });
            }

            // Vacaciones aprobadas
            empleado.vacaciones?.forEach(vacacion => {
                if (
                    fecha >= vacacion.fechaInicio &&
                    fecha <= vacacion.fechaFin
                ) {
                    eventos.push({
                        tipo: "vacaciones",
                        texto: `${empleado.nombre} ${empleado.apellido}`
                    });
                }
            });
        });

        return eventos;
    }

    if (cargando) {
        return <p>Cargando calendario...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="calendario-container">
            <h1>Calendario general</h1>
            <p>Descansos, guardias y vacaciones de los empleados.</p>

            <div className="calendario-controles">
                <button onClick={() => cambiarMes(-1)}>Anterior</button>

                <h2>{meses[mes - 1]} {anio}</h2>

                <button onClick={() => cambiarMes(1)}>Siguiente</button>
            </div>

            <div className="calendario-leyenda">
                <span className="leyenda-descanso">Descanso</span>
                <span className="leyenda-guardia">Guardia</span>
                <span className="leyenda-vacaciones">Vacaciones</span>
            </div>

            <div className="calendario-grid">
                {diasSemana.map(dia => (
                    <div className="calendario-dia-nombre" key={dia}>
                        {dia}
                    </div>
                ))}

                {casillas.map((dia, index) => (
                    <div className="calendario-celda" key={index}>
                        {dia && (
                            <>
                                <strong className="numero-dia">{dia}</strong>

                                <div className="eventos-dia">
                                    {obtenerEventos(dia).map((evento, i) => (
                                        <div
                                            key={i}
                                            className={`evento evento-${evento.tipo}`}
                                        >
                                            {evento.texto}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="calendario-empleados">
                <h3>Empleados registrados: {empleados.length}</h3>

                {empleados.map(empleado => (
                    <p key={empleado.empleadoId}>
                        {empleado.nombre} {empleado.apellido} — {empleado.puesto}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Calendario;
