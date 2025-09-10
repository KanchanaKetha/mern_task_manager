import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editInput, setEditInput] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  }, []);

  // Add new task
  const addTask = () => {
    if (!taskInput) return;

    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskInput }),
    })
      .then((res) => res.json())
      .then((newTask) => setTasks([...tasks, newTask]))
      .catch((err) => console.log(err));

    setTaskInput("");
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    const task = tasks.find((t) => t._id === id);
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      })
      .catch((err) => console.log(err));
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => setTasks(tasks.filter((t) => t._id !== id)))
      .catch((err) => console.log(err));
  };

  // Edit task
  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditInput(task.title);
  };

  const saveEdit = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editInput }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
        setEditTaskId(null);
        setEditInput("");
      })
      .catch((err) => console.log(err));
  };

  // Completed and remaining counts
  const completedTasks = tasks.filter((t) => t.completed).length;
  const remainingTasks = tasks.length - completedTasks;

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div className="task-input">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <h3>
        ✅ Completed: {completedTasks} | ⏳ Remaining: {remainingTasks}
      </h3>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            {editTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
                <button className="save-btn" onClick={() => saveEdit(task._id)}>
                  💾
                </button>
              </>
            ) : (
              <>
                <span onClick={() => toggleComplete(task._id)}>
                  {task.title}
                </span>
                <div className="task-buttons">
                  <button className="edit-btn" onClick={() => startEdit(task)}>
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

