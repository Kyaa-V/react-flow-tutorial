import React from "react";

export default function Sidebar({ show, setShow }) {
  return (
    <div
      style={{
        width: "220px",
        background: "#1e293b",
        color: "white",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>⚙️ Tools</h2>

      <button
        onClick={() => setShow(!show)}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "0.5rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ➕ Tambah Node
      </button>

      <button
        onClick={() => setSelectedTool("clear")}
        style={{
          background: "#dc2626",
          color: "white",
          padding: "0.5rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        🗑️ Hapus Semua
      </button>
    </div>
  );
}
