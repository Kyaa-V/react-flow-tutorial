import React, { useState, useRef, useEffect } from "react";

// Komponen Custom Dropdown
const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  // Tutup saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard support
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          padding: "8px 12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
          userSelect: "none",
          transition: "all 0.2s",
          boxShadow: isOpen ? "0 0 0 2px #3b82f6" : "none",
        }}
      >
        <span style={{ color: value ? "#000" : "#888" }}>{selectedLabel}</span>
        <span style={{ fontSize: "12px", transition: "transform 0.2s" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginTop: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                background: value === opt.value ? "#ebf5ff" : "transparent",
                color: value === opt.value ? "#1d4ed8" : "#000",
                fontWeight: value === opt.value ? "600" : "normal",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = value === opt.value ? "#ebf5ff" : "transparent")}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Form
export default function FormRequest({ onClose, onSubmit }) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    { id: Date.now(), name: "", type: "text", nullable: false },
  ]);

  const dataTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Boolean" },
  ];

  const addColumn = () => {
    setColumns([
      ...columns,
      { id: Date.now(), name: "", type: "text", nullable: false },
    ]);
  };

  const removeColumn = (id) => {
    if (columns.length > 1) {
      setColumns(columns.filter((col) => col.id !== id));
    }
  };

  const updateColumn = (id, field, value) => {
    setColumns(
      columns.map((col) =>
        col.id === id ? { ...col, [field]: value } : col
      )
    );
  };

  const handleSubmit = () => {
    if (!tableName.trim()) return alert("Nama tabel wajib diisi!");

    const validColumns = columns.filter((col) => col.name.trim() !== "");
    if (validColumns.length === 0) return alert("Minimal satu kolom harus diisi!");

    console.log(validColumns)

    onSubmit({
      tableName: tableName.trim(),
      columns: validColumns.map(({ id, ...col }) => col),
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px 40px",
          borderRadius: "12px",
          minWidth: "560px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: "600" }}>
          Create Table
        </h2>

        {/* Nama Tabel */}
        <label style={{ display: "block", marginBottom: "12px" }}>
          <span style={{ fontWeight: "500", fontSize: "14px" }}>Nama Tabel</span>
          <input
            type="text"
            placeholder="users, products, orders..."
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginTop: "6px",
              fontSize: "14px",
            }}
          />
        </label>

        {/* Kolom Dinamis */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <strong style={{ fontSize: "14px" }}>Kolom</strong>
            <button
              onClick={addColumn}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(59,130,246,0.3)",
              }}
            >
              +
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {columns.map((col, idx) => (
              <div
                key={col.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1fr auto",
                  gap: "10px",
                  alignItems: "center",
                  padding: "8px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                }}
              >
                {/* Nama Kolom */}
                <input
                  type="text"
                  placeholder={`Kolom ${idx + 1}`}
                  value={col.name}
                  onChange={(e) => updateColumn(col.id, "name", e.target.value)}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />

                {/* Custom Dropdown */}
                <CustomDropdown
                  value={col.type}
                  onChange={(val) => updateColumn(col.id, "type", val)}
                  options={dataTypes}
                  placeholder="Pilih tipe..."
                />

                {/* Nullable */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={col.nullable}
                    onChange={(e) => updateColumn(col.id, "nullable", e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                  <span>Nullable</span>
                </label>

                {/* Hapus */}
                <button
                  onClick={() => removeColumn(col.id)}
                  disabled={columns.length === 1}
                  style={{
                    background: columns.length === 1 ? "#fee2e2" : "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    width: "32px",
                    height: "32px",
                    cursor: columns.length === 1 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    opacity: columns.length === 1 ? 0.6 : 1,
                  }}
                >
                  −
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Buat Tabel
          </button>
        </div>
      </div>
    </div>
  );
}