import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";

const TaskForm = () => {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim() !== "") {
      await addDoc(collection(db, "tasks"), {
        description,
        status: "Programado",
        date: new Date().toISOString(),
      });
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="taskDescription">Descripción</label>
        <input
          type="text"
          className="form-control"
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Agregar Tarea
      </button>
    </form>
  );
};

export default TaskForm;
