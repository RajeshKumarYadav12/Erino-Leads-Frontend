import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-xl font-semibold">
            Erino Leads
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Link to="/leads" className="px-3 py-1 rounded hover:bg-gray-100">
                Leads
              </Link>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-sky-600 text-white rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
