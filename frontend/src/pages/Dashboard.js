import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { io } from "socket.io-client";

const BACKEND_URL = "https://collab-kanban-board.onrender.com";
const socket = io(BACKEND_URL);

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [taskRes, logRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}/api/tasks/logs/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setTasks(taskRes.data);
      setLogs(logRes.data);
    } catch (err) {
      alert("❌ Error fetching tasks or logs.");
    }
  };

  useEffect(() => {
    fetchData();
    socket.on("task-updated", fetchData);
    return () => socket.off("task-updated");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const createTask = async (assignSmart = false) => {
    if (!title.trim()) return alert("Please enter a task title");

    let assignedTo = user._id;

    if (assignSmart) {
      const counts = {};
      tasks.forEach((t) => {
        const id = t.assignedTo?._id || t.assignedTo;
        counts[id] = (counts[id] || 0) + 1;
      });
      const least = Object.entries(counts).sort((a, b) => a[1] - b[1])[0]?.[0];
      assignedTo = least || user._id;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/tasks`,
        { title, description, priority, status, assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      fetchData();
    } catch (err) {
      alert("❌ Task creation failed");
    }
  };

  const handleDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination || source.droppableId === destination.droppableId) return;
    try {
      await axios.put(
        `${BACKEND_URL}/api/tasks/${draggableId}`,
        { status: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert("❌ Task move failed");
    }
  };

  const grouped = {
    Todo: [],
    "In Progress": [],
    Done: []
  };
  tasks.forEach((task) => grouped[task.status]?.push(task));

  return (
    <div className="container">
      <div className="topbar">
        <h2>Welcome, {user?.name || "User"}</h2>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h3>Create New Task</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button className="btn btn-primary" onClick={() => createTask(false)}>
          Add
        </button>
        <button className="btn btn-secondary" onClick={() => createTask(true)}>
          Smart Assign
        </button>
      </div>

      <div className="kanban">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(grouped).map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h4>{status}</h4>
                  {grouped[status].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            background: "#f4f4f4",
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: 8,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}
                        >
                          <strong>{task.title}</strong>
                          <p>{task.description}</p>
                          <small>Priority: {task.priority}</small>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>

        <div style={{ width: "25%", paddingLeft: 20 }}>
          <h4>Activity Log</h4>
          <div className="activity-log">
            {logs.map((log) => (
              <div key={log._id}>
                <b>{log.user?.name || "Someone"}</b> {log.action}
                <br />
                <small>{new Date(log.timestamp).toLocaleString()}</small>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

