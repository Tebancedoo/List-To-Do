"use client"

import styles from "./page.module.css";
import { useState } from "react";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTask, setNewTask] = useState("");  // Estado para almacenar la nueva tarea

  // Manejador del evento de selección de fecha
  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
  };

  // Función para agregar una tarea
  const addTask = () => {
    if (newTask) {

      alert("Tarea agregada correctamente: " + newTask)
      setNewTask(""); // Limpiar el campo de texto después de agregar la tarea
    } else {
      alert("No se ha ingresado una tarea");
    }
  };

  // Función que se ejecuta cuando el valor del input cambia
  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  function handleClose() {
    setSelectedDate(null)
  };


  return (
    <main className={styles.main}>
      <div className="grid grid-cols-10">
        <div className="grid grid-cols-8">
          <FullCalendar 
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]} 
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            events={{}}
            nowIndicator={true}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            dateClick={handleDateClick} // Evento al hacer clic en una fecha
          />

          {/* Despliegue de tareas */}
          {selectedDate && (
              <div className="mt-2">
                  <input
                    className="custom-input"
                    type="text"
                    placeholder="Nueva tarea"
                    value={newTask}  // Vincula el estado al valor del input
                    onChange={handleInputChange} // Manejador de cambios en el input
                  />
                  <div className="button-container">
                    <button className="submit-btn" onClick={addTask}>Agregar tarea</button> {/* Botón que agrega la tarea */}
                    <button className="cancel-btn" onClick={handleClose}>Cancelar</button>
                  </div>
                </div>
                
          )}
        </div>
      </div>
    </main>
  );
}
