import React, { useState } from "react";
import {
  Handle,
  NodeResizer,
  Position,
  NodeToolbar,
  useReactFlow,
} from "@xyflow/react";

export default function TableNode({ data, id, selected }) {
  const { TableName, columns } = data;
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });

  const { getEdges } = useReactFlow();
  const edges = getEdges();

  console.log(edges);
  const handleEditOptionsClick = (e) => {
    e.stopPropagation();
    setShowEditOptions(true);
    setEditPosition({ x: e.clientX, y: e.clientY });
  };

  const randomColor = React.useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 35%)`;
  }, []);

  // Handle edit button click
  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditForm(true);
    setShowEditOptions(false);
  };

  // Handle form submit
  const handleFormSubmit = (updatedData) => {
    console.log("updatedData handle submit", updatedData);
    // Update node data here
    if (data.onEdit) {
      data.onEdit(id, updatedData);
      console.log(`updatedData: ${JSON.stringify(updatedData)}`);
    }
    setShowEditForm(false);
  };

  // Close all when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowEditOptions(false);
      setShowEditForm(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={Position.Top}
        align={"end"}
      >
        {/* Edit Options Popup */}
        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            minWidth: "120px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleEditClick}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Edit Table
          </button>
          <button
            onClick={() => {
              if (data.onDelete) {
                data.onDelete(id);
              }
              setShowEditOptions(false);
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "4px",
              fontSize: "12px",
            }}
          >
            Delete Table
          </button>
        </div>
      </NodeToolbar>
      <div
        style={{
          width: "100%",
          border: selected ? "2px solid #3b82f6" : "1px solid #94a3b8",
          borderRadius: "6px",
          background: "white",
          minWidth: 150,
          padding: "8px",
          fontFamily: "monospace",
          cursor: "pointer",
          position: "relative",
        }}
        // onClick={handleTableClick}
      >
        <div
          style={{
            background: randomColor,
            color: "white",
            padding: "6px",
            fontWeight: "bold",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          {TableName}
        </div>
        <div style={{ paddingTop: "4px" }}>
          {columns.map((col, idx) => {
            const sourceHandleId = `${TableName}_${col.name}_source`;
            const targetHandleId = `${TableName}_${col.name}_target`;
            const rowHeight = 30;
            const topOffset = idx * rowHeight + rowHeight + 10;

            // Cek apakah kolom ini punya koneksi masuk (sebagai target)
            const hasTargetConnection = edges.some(
              (edge) => edge.targetHandle === targetHandleId
            );

            // Cek apakah kolom ini punya koneksi keluar (sebagai source)
            const hasSourceConnection = edges.some(
              (edge) => edge.sourceHandle === sourceHandleId
            );

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  width: "100%",
                  borderBottom: "1px dashed #e2e8f0",
                }}
              >
                {/* 🟥 HANDLE TARGET: hanya tampil kalau ada relasi ke sini */}
                {(col.index === "@FK" || col.index === "@id") &&
                  hasTargetConnection ? (
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={targetHandleId}
                      style={{
                        top: topOffset,
                        position: "absolute",
                        transform: "translateX(-50%)",
                        background: "#ef4444",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                      }}
                    />
                  ) :                     
                  <Handle
                      type="target"
                      position={Position.Left}
                      id={targetHandleId}
                      style={{
                        top: topOffset,
                        position: "absolute",
                        transform: "translateX(-50%)",
                        background: "#ef4444",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                      }}
                    />}

                {/* Nama kolom */}
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    margin: "0px 10px",
                  }}
                >
                  <strong>{col.name}</strong>
                  <strong>{col.index}</strong>
                  <span> ({col.type})</span>
                </span>

                {/* 🟩 HANDLE SOURCE: hanya tampil kalau belum punya target relasi */}
                {(col.index === "@id" || col.index === "@FK") &&
                  !hasTargetConnection && (
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={sourceHandleId}
                      style={{
                        top: topOffset,
                        position: "absolute",
                        transform: "translateX(50%)",
                        background: "#10b981",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                      }}
                    />
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Form Popup */}
      {showEditForm && (
        <EditForm
          nodeData={data}
          position={editPosition}
          onSubmit={handleFormSubmit}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}

// Edit Form Component
// Edit Form Component - FIXED VERSION
function EditForm({ nodeData, position, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    TableName: nodeData.TableName || "",
    columns: nodeData.columns ? [...nodeData.columns] : [],
  });

  console.log(formData);

  // FIXED: Handle submit dengan proper event prevention
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  // FIXED: updateColumn dengan proper state update
  const updateColumn = (index, field, value) => {
    setFormData((prev) => {
      const updatedColumns = [...prev.columns];
      updatedColumns[index] = {
        ...updatedColumns[index],
        [field]: value,
      };
      return {
        ...prev,
        columns: updatedColumns,
      };
    });
    console.log(`Updated column ${index}, ${field}:`, value);
  };

  // FIXED: addColumn dengan default values yang proper
  const addColumn = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          name: `column_${prev.columns.length + 1}`,
          type: "varchar",
          index: "",
          nullable: true,
        },
      ],
    }));
    console.log("Added new column");
  };

  // FIXED: removeColumn dengan validation
  const removeColumn = (index, e) => {
    e.stopPropagation();
    if (formData.columns.length <= 1) {
      alert("Table must have at least one column");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
    console.log(`Removed column at index: ${index}`);
  };

  // FIXED: Handle input changes dengan better event handling
  const handleTableNameChange = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      TableName: e.target.value,
    }));
  };

  const handleColumnNameChange = (index, e) => {
    e.stopPropagation();
    updateColumn(index, "name", e.target.value);
  };

  const handleColumnTypeChange = (index, e) => {
    e.stopPropagation();
    updateColumn(index, "type", e.target.value);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1001,
        minWidth: "300px",
        maxWidth: "400px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 style={{ margin: "0 0 16px 0" }}>Edit Table</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}
          >
            Table Name:
          </label>
          <input
            type="text"
            value={formData.TableName}
            onChange={handleTableNameChange}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <label style={{ fontSize: "14px" }}>Columns:</label>
            <button
              type="button"
              onClick={addColumn}
              style={{
                padding: "4px 8px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              + Add Column
            </button>
          </div>

          {formData.columns.map((col, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Column name"
                value={col.name}
                onChange={(e) => handleColumnNameChange(index, e)}
                style={{
                  flex: 1,
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <select
                value={col.type}
                // autoFocus={true}
                onChange={(e) => handleColumnTypeChange(index, e)}
                style={{
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="TEXT">TEXT</option>
                <option value="DATE">DATE</option>
                <option value="DATETIME">DATETIME</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="FLOAT">FLOAT</option>
              </select>
              <button
                type="button"
                onClick={(e) => removeColumn(index, e)}
                style={{
                  padding: "6px 8px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              padding: "8px 16px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
