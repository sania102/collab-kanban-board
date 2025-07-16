import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://collab-kanban-board.onrender.com/api/auth/register",
        {
          name,
          email,
          password
        }
      );
      alert("✅ Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration error:", err.message);
      alert("Registration failed. Email may already exist.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
      <p>
        Already have an account?{" "}
        <Link to="/login">
          Login here
        </Link>
      </p>
    </form>
  );
}
