import React, { useState, useRef, useEffect } from "react";

export default function CustomDropdown ({ value, onChange, options, placeholder }){
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;


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
          padding: "0px 10px",
          height: "40px",
          position: "relative",
          width: "100px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
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
            zIndex:2000,
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginTop: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
              onMouseLeave={(e) =>
                (e.target.style.background =
                  value === opt.value ? "#ebf5ff" : "transparent")
              }
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};