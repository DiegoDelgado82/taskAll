import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Asegúrate de que estás importando correctamente db
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore'; // Para obtener, agregar y actualizar documentos
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Importamos los iconos de FontAwesome
//import Statistics from './Statistics';


const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState("Programado");

    // Función para cargar las tareas de Firestore
    const loadTasks = async () => {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const taskList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setTasks(taskList);
    };

    // Función para agregar una nueva tarea
    const addTask = async (e) => {
        e.preventDefault();

        if (taskDescription === "") {
            Swal.fire({
                icon: 'warning',
                title: '¡Error!',
                text: 'La descripción no puede estar vacía.',
            });
            return;
        }

        // Añadir tarea a Firestore
        await addDoc(collection(db, 'tasks'), {
            description: taskDescription,
            status: taskStatus,
            date: new Date().toISOString(),
        });

        // Limpiar campos
        setTaskDescription("");
        setTaskStatus("Programado"); // Resetear estado
        loadTasks(); // Recargar tareas
    };

    // Función para eliminar una tarea
    const handleDelete = async (taskId) => {
      Swal.fire({
          title: '¿Estás seguro?',
          text: "No podrás deshacer esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminarla!'
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  // Actualizar la tarea en Firestore
                  const taskRef = doc(db, 'tasks', taskId);
                  await updateDoc(taskRef, { status: 'Cancelado' });
  
                  // Actualizar el estado en la interfaz para reflejar el cambio
                  setTasks((prevTasks) =>
                      prevTasks.map((task) =>
                          task.id === taskId ? { ...task, status: 'Cancelado' } : task
                      )
                  );
  
                  // Confirmación de eliminación
                  Swal.fire(
                      'Cancelada!',
                      'La tarea ha sido marcada como cancelada.',
                      'success'
                  );
              } catch (error) {
                  Swal.fire({
                      icon: 'error',
                      title: 'Error al cancelar la tarea',
                      text: error.message,
                  });
              }
          }
      });
  };
  

  const showAlertWithId = (id) => {
    Swal.fire({
      title: 'ID de la tarea',
      text: `El ID es: ${id}`,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  };


    // Función para editar una tarea usando SweetAlert
    const editTask = (task) => {
      // Mostrar SweetAlert con un formulario
      Swal.fire({
          title: 'Editar Tarea',
          html: `
              <input id="taskDescription2" class="swal2-input" value="${task.description}" placeholder="Descripción" />
              <select id="taskStatus2" class="swal2-select">
                  <option value="Programado" ${task.status === "Programado" ? "selected" : ""}>Programado</option>
                  <option value="En Progreso" ${task.status === "En Progreso" ? "selected" : ""}>En Progreso</option>
                  <option value="Completado" ${task.status === "Completado" ? "selected" : ""}>Completado</option>
              </select>
          `,
          showCancelButton: true,
          confirmButtonText: 'Guardar Cambios',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
              // Obtener los valores de los campos dentro de SweetAlert
              const description = document.getElementById('taskDescription2').value;
              const status = document.getElementById('taskStatus2').value;
  
              if (!description.trim()) {
                  // Mostrar mensaje de validación si la descripción está vacía en el formulario de SweetAlert
                  Swal.showValidationMessage('La descripción no puede estar vacía');
                  return false;
              }
  
              // Retornar los valores para ser usados en la actualización
              return { description, status };
          }
      }).then((result) => {
          if (result.isConfirmed) {
              const { description, status } = result.value;
  
              // Actualizar la tarea en Firestore con los nuevos valores
              const taskRef = doc(db, 'tasks', task.id);
              updateDoc(taskRef, {
                  description: description,
                  status: status,
              });
  
              // Recargar las tareas después de la edición
              loadTasks();
          }
      });
  };
  

    // Cargar las tareas al montar el componente
    useEffect(() => {
        loadTasks();
    }, []);

    return (


      
        <div className="container mt-5">
            <h1 className="text-center">Check List Tareas</h1>

            <form onSubmit={addTask}>
                <div className="form-group">
                    <label htmlFor="taskDescription">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        id="taskDescription"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="taskStatus">Estado</label>
                    <select
                        className="form-control"
                        id="taskStatus"
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                    >
                        <option value="Programado">Programado</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Completado">Completado</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Agregar Tarea</button>
            </form>

            <hr />

            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    {tasks.map((task) => {
        let rowClass = '';
        switch (task.status) {
            case 'Programado':
                rowClass = 'table-warning'; // Amarillo tenue
                break;
            case 'En Progreso':
                rowClass = 'table-info'; // Celeste
                break;
            case 'Completado':
                rowClass = 'table-success'; // Verde tenue
                break;
            case 'Cancelado':
                rowClass = 'table-danger'; // Rojo tenue
                break;
            default:
                rowClass = ''; // Sin clase específica
        }
        return (
            <tr key={task.id} className={rowClass}>
                 <td>
      <button 
        className="btn btn-outline-secondary btn-sm" 
        onClick={() => showAlertWithId(task.id)}
        title="Ver ID"
      >
        👁️
      </button>
    </td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.date}</td>
                <td>
                    {(task.status !== 'Cancelado' && task.status !== 'Completado')  && (
                        <>
                            <button
                                className="btn btn-warning"
                                onClick={() => editTask(task)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="btn btn-danger ml-2"
                                onClick={() => handleDelete(task.id)}
                            >
                                <FaTrashAlt />
                            </button>
                        </>
                    )}
                </td>
            </tr>
        );
    })}
</tbody>

            </table>
           
        </div>
    );
};

export default App;
