import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Necesario para evitar problemas con Chart.js

const Statistics = ({ tasks }) => {
    const totalTasks = tasks.length;
    const taskCounts = {
        Programado: tasks.filter((task) => task.status === 'Programado').length,
        'En Progreso': tasks.filter((task) => task.status === 'En Progreso').length,
        Completado: tasks.filter((task) => task.status === 'Completado').length,
        Cancelado: tasks.filter((task) => task.status === 'Cancelado').length,
    };

    const chartData = {
        labels: ['Programado', 'En Progreso', 'Completado', 'Cancelado'],
        datasets: [
            {
                data: Object.values(taskCounts),
                backgroundColor: ['#ffc107', '#17a2b8', '#28a745', '#dc3545'], // Colores Bootstrap
                hoverBackgroundColor: ['#ffca2c', '#20c0e9', '#34d058', '#e4606d'], // Colores para hover
            },
        ],
    };

    return (
        <div className="mt-4">
            <h3>Estadísticas de Tareas</h3>
            <p>Total de tareas: {totalTasks}</p>
            <ul>
                <li>Programadas: {taskCounts.Programado}</li>
                <li>En Progreso: {taskCounts['En Progreso']}</li>
                <li>Completadas: {taskCounts.Completado}</li>
                <li>Canceladas: {taskCounts.Cancelado}</li>
            </ul>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <Pie data={chartData} />
            </div>
        </div>
    );
};

export default Statistics;
