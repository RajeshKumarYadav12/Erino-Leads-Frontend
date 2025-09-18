import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      nav("/leads");
    } catch (error) {
      setErr(
        error?.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  return (
    <div className="container mt-8">
      <div className="card mx-auto max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className="w-full p-2 border rounded"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-sky-600 text-white p-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
