import React, { useState, useRef, useEffect } from "react";
import CustomDropdown from "./DropDown";

// Main Form
export default function FormRequest({ onClose, onSubmit, nodes }) {
  const [templateName, setTamplateName] = useState("Search Template");
  const [selectedTabel, setSelectedTabel] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const [allTableColumns, setAllTableColumns] = useState([]); // dari addColumnManyTabel
  const [currentStep, setCurrentStep] = useState(0); // tabel ke-0 (users)
  const [ validationNodes, setValidationNodes] = useState([{
    message: "",
    columns: {
      message: ""
    }
  }])

  // console.log(columns);
  // console.log(allTableColumns);
  // console.log(selectedTabel);
  // console.log(validationNodes)
  const dataTypes = [
    { value: "VARCHAR", label: "VARCHAR" },
    { value: "INT", label: "INT" },
    { value: "DATE", label: "DATE" },
    { value: "BOOLEAN", label: "BOOLEAN" },
    { value: "DECIMAL", label: "DECIMAL" },
  ];
  // console.log(selectedTabel);
  const indexTypes = [
    { value: "@id", label: "@id"},
    { value: "@uuid", label: "@uuid"},
    { value: "@unique",label: "@unique"},
    { value: "@primary",  label: "@primary"},
    { value: "@hashed", label: "@hashed"},
    { value: "@index", label: "@index"},
    { value: "@FK", label: "@FK"},
  ];

  // console.log(columns.id);
  const template = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      type: "table",
      data: {
        tableName: "users",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "username", type: "VARCHAR", index: "" },
          { name: "email", type: "VARCHAR", index: "@unique" },
          { name: "password", type: "VARCHAR", index: "@hashed" },
        ],
      },
    },
    {
      id: "2",
      position: { x: 400, y: 100 },
      type: "table",
      data: {
        tableName: "product_items",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "users_id", type: "INT", index: "@FK" },
          { name: "items_id", type: "INT", index: "@FK" },
          { name: "quantity", type: "INT" },
        ],
      },
    },
    {
      id: "3",
      position: { x: 800, y: 0 },
      type: "table",
      data: {
        tableName: "items",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "name", type: "VARCHAR" },
          { name: "price", type: "DECIMAL" },
          { name: "stock", type: "INT" },
          { name: "sold", type: "INT" },
        ],
      },
    },
    {
      id: "4",
      position: { x: 800, y: 0 },
      type: "table",
      data: {
        tableName: "roles",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "name", type: "VARCHAR" },
        ],
      },
    },
    {
      id: "5",
      position: { x: 800, y: 0 },
      type: "table",
      data: {
        tableName: "roles_user",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "users_id", type: "INT", index: "@FK" },
          { name: "roles_id", type: "INT", index: "@FK" },
        ],
      },
    },
    {
      id: "6",
      position: { x: 800, y: 0 },
      type: "table",
      data: {
        tableName: "orders",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "users_id", type: "INT", index: "@FK" },
          { name: "total_price", type: "DECIMAL" },
        ],
      },
    },
    {
      id: "7",
      position: { x: 800, y: 0 },
      type: "table",
      data: {
        tableName: "orders_item",
        columns: [
          { name: "id", type: "INT", index: "@id" },
          { name: "items_id", type: "INT", index: "@FK" },
          { name: "orders_id", type: "INT", index: "@FK" },
          { name: "price", type: "DECIMAL" },
          { name: "quantity", type: "INT" },
        ],
      },
    },
  ];

  const handleSubmit = () => {
    // console.log(nodes)

    const duplicateTables = selectedTabel.filter((table) =>
      nodes.find((node) => node.data.TableName === table.name)
    );

    if (duplicateTables.length > 0) {
      setValidationNodes(
        duplicateTables.map((table) => ({
          message: `Table ${table.name} already exists!`,
        }))
      );
      return
    }

    if (!selectedTabel.length) {
      setValidationNodes([{
        message: "This field is not empty!"
      }])
      return
    }

    const validColumns = allTableColumns.filter((col) =>
      col.map((col) => col.name.trim() !== "")
    );
    if(validColumns.length === 0){
      setValidationNodes([{
        columns: {
          message: "This field is not empty!"
        }
      }])
      return
    }

    onSubmit({
      tableName: selectedTabel,
      columns: validColumns,
    });
    onClose();
  };

  const addColumnToCurrentStep = () => {
    const newCol = {
      id: `${Date.now()}-${Math.random()}`,
      name: "",
      type: "VARCHAR",
      index: "",
      nullable: false,
    };

    setAllTableColumns((prev) => {
      const newTables = [...prev];

      if (!Array.isArray(newTables[currentStep])) {
        newTables[currentStep] = [];
      }

      newTables[currentStep] = [...newTables[currentStep], newCol];
      return newTables;
    });
  };

  const updateColumnInStep = (stepIdx, colId, field, value) => {
    setAllTableColumns((prev) => {
      const newTables = [...prev];
      newTables[stepIdx] = newTables[stepIdx].map((col) =>
        col.id === colId ? { ...col, [field]: value } : col
      );
      return newTables;
    });
  };

  // Hapus kolom
  const removeColumnInStep = (stepIdx, colId) => {
    setAllTableColumns((prev) => {
      const newTables = [...prev];
      newTables[stepIdx] = newTables[stepIdx].filter((col) => col.id !== colId);
      return newTables;
    });
  };

  const removeTableInStep = (stepIdx) => {
    setAllTableColumns((prev) => {
      const newTables = [...prev];
      newTables.splice(stepIdx, 1);
      return newTables;
    });

    setSelectedTabel((prev) => {
      const newTables = [...prev];
      newTables.splice(stepIdx, 1);
      return newTables;
    });

    setCurrentStep(stepIdx - 1 >= 0 ? stepIdx - 1 : 0);
  };

  const addColumnManyTabel = () => {

    const result = selectedTabel.map((tabel) => {
      const matchedTemplate = template.find(
        (temp) => temp.data.tableName === tabel.name
      );

      if (matchedTemplate) {
        return matchedTemplate.data.columns.map((col) => ({
          name: col.name,
          type: col.type,
          index: col.index
        }));
      }

      return [];
    });


    const dataResult = result.map((tableCols) =>
      tableCols.map((col) => ({
        ...col,
        id: `${Date.now()}-${Math.random()}`, // beri ID unik
        nullable: false,
      }))
    );
    // console.log(dataResult);

    setAllTableColumns(dataResult);

    // console.log(result);
    setIsOpen(false);
    return result;
  };

  const updateTableName = (tableName, isChecked) => {
    setSelectedTabel((prev) => {
      if (isChecked) {
        // Tambahkan jika belum ada
        if (!prev.some((t) => t.name === tableName)) {
          return [...prev, { name: tableName }];
        }
        return prev;
      } else {
        return prev.filter((t) => t.name !== tableName);
      }
    });
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
          minWidth: "45vw",
          maxWidth: "45vw",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            alignItems: "center",
          }}
        >
          <h2
            style={{ margin: "0 0 20px", fontSize: "26px", fontWeight: "600" }}
          >
            Create Table
          </h2>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              padding: "10px 15px",
              color: "white",
              right: 0,
              border: "none",
              backgroundColor: "#ef4444",
              borderRadius: "6px",
            }}
          >
            X
          </button>
        </div>

        {/* Template*/}
        <div ref={dropDownRef} style={{ position: "relative" }}>
          <label style={{ display: "flex", margin: "10px" }}>
            <span style={{ fontSize: "24px" }}>Tamplate</span>
          </label>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
              padding: "8px 12px",
              marginBottom: "10px",
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
            }}
          >
            <span>{templateName}</span>
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
                display: "flex",
                height: "250px",
                flexDirection: "column",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginTop: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 150,
              }}
            >
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {template.map((template, index) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      backgroundColor: "white",
                    }}
                  >
                    <div
                      key={template.id}
                      value={template.data.tableName}
                      onClick={() => {
                        setTamplateName(template.data.tableName);
                        setIsOpen(false);
                        const singleTableColumns = template.data.columns.map(
                          (col) => ({
                            ...col,
                            id: Date.now() + Math.random(),
                            nullable: false, // tambah default kalau belum ada
                          })
                        );
                        setSelectedTabel([{ name: template.data.tableName }]);
                        setAllTableColumns([singleTableColumns]);
                      }}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        color: "black",
                        fontWeight: "normal",
                        width: "100%",
                        transition: "background 0.2s",
                      }}
                    >
                      <span>{template.data.tableName}</span>
                    </div>
                    <div style={{ margin: "10px" }}>
                      <input
                        type="checkbox"
                        value={template.data.tableName}
                        checked={selectedTabel.some(
                          (t) => t.name === template.data.tableName
                        )}
                        onChange={(e) =>
                          updateTableName(
                            template.data.tableName,
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => {
                    setSelectedTabel([]);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: "10px 25px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#ef4444",
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={() => addColumnManyTabel()}
                  style={{
                    backgroundColor: "#22c55e",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Nama Tabel */}
        <label style={{ display: "flex",flexDirection: "column", marginBottom: "12px" }}>
          <span style={{ fontWeight: "500", fontSize: "14px" }}>
            Nama Tabel
          </span>
          <input
            type="text"
            placeholder="users, products, orders..."
            value={selectedTabel[currentStep]?.name || ""}
            onChange={(e) => {
              const updatedTabel = [...selectedTabel];
              updatedTabel[currentStep] = {
                ...updatedTabel[currentStep], // pertahankan properti lain
                name: e.target.value,
              };
              setSelectedTabel(updatedTabel);
            }}
            style={{
              width: "95%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginTop: "6px",
              fontSize: "14px",
            }}
          />
          <span style={{ padding: "5px 10px", fontWeight: "500", fontSize: "16px", color: "#ef4444" }}>
            {/* tesing */}
            { validationNodes[currentStep]?.message }
          </span>
        </label>

        {/* Kolom Dinamis */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <strong style={{ fontSize: "14px" }}>Kolom</strong>
            <button
              onClick={addColumnToCurrentStep}
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

          <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            {/* Header: Nama Tabel & Progress */}
            <div style={{ margenBottom: "20px" }}>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: "0 0 8px" }}>
                  Tabel:{" "}
                  <strong>
                    {selectedTabel[currentStep]?.name || "Belum Tersedia"}
                  </strong>
                </h2>
                <button
                  onClick={() => {
                    removeTableInStep(currentStep);
                  }}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "6px",
                    backgroundColor: "#ef4444",
                    border: "none",
                  }}
                >
                  {" "}
                  Delete{" "}
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: "#666" }}>
                  Step {currentStep + 1} of {allTableColumns.length}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {allTableColumns.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      style={{
                        width: "32px",
                        height: "8px",
                        borderRadius: "4px",
                        background: idx === currentStep ? "#22c55e" : "#e5e7eb",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom Tabel Saat Ini */}
            {allTableColumns[currentStep]?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                    overflowY: "auto",
                  width: "100%",
                }}
              >
                {allTableColumns[currentStep].map((col, idx) => (
                  <div
                    key={col.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "max-content",
                      gap: "15px",
                      alignItems: "center",
                      padding: "8px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                    }}
                  >
                    {/* Nama Kolom */}
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) =>
                        updateColumnInStep(
                          currentStep,
                          col.id,
                          "name",
                          e.target.value
                        )
                      }
                      style={{
                        padding: "8px 10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    />
                    {/* Tipe */}
                    <CustomDropdown
                      value={col.type}
                      onChange={(val) =>
                        updateColumnInStep(currentStep, col.id, "type", val)
                      }
                      options={dataTypes}
                    />
                    <CustomDropdown
                      value={col.index}
                      onChange={(val) =>
                        updateColumnInStep(currentStep, col.id, "index", val)
                      }
                      options={indexTypes}
                    />

                    {/* Nullable */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={col.nullable || false}
                        onChange={(e) =>
                          updateColumnInStep(
                            currentStep,
                            col.id,
                            "nullable",
                            e.target.checked
                          )
                        }
                      />
                      <span>Nullable</span>
                    </label>

                    {/* Hapus Kolom */}
                    <button
                      onClick={() => removeColumnInStep(currentStep, col.id)}
                      disabled={allTableColumns[currentStep].length === 1}
                      style={{
                        background:
                          allTableColumns[currentStep].length === 1
                            ? "#fee2e2"
                            : "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      −
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999", textAlign: "center" }}>
                {validationNodes[currentStep]?.columns?.message || "Please add a column"}
              </p>
            )}

            {/* Navigasi */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                  padding: "10px 20px",
                  background: currentStep === 0 ? "#e5e7eb" : "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: currentStep === 0 ? "not-allowed" : "pointer",
                }}
              >
                Sebelumnya
              </button>

              {currentStep < allTableColumns.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  style={{
                    padding: "10px 20px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 20px",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Submit Semua
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
