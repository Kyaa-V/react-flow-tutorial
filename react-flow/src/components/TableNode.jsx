// TableNode.jsx
import React, { useState } from "react";
import { Handle, NodeResizer, Position, NodeToolbar } from "@xyflow/react";

export default function TableNode({ data, id, selected }) {
  const { TableName, columns } = data;
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });

  console.log()

  const randomColor = React.useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 35%)`;
  }, []);

  // Handle klik pada tabel
  const handleTableClick = (e) => {
    e.stopPropagation();
    
    // Dapatkan posisi mouse relatif terhadap viewport
    const rect = e.currentTarget.getBoundingClientRect();
    setEditPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 5 // 10px di bawah tabel
    });
    
    setShowEditOptions(true);
  };

  // Handle edit button click
  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditForm(true);
    setShowEditOptions(false);
  };

  // Handle form submit
  const handleFormSubmit = (updatedData) => {
    // Update node data here
    if (data.onEdit) {
      data.onEdit(id, updatedData);
    }
    setShowEditForm(false);
  };

  // Close all when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowEditOptions(false);
      setShowEditForm(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
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
        onClick={handleTableClick}
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
            const topOffset = (idx * rowHeight + rowHeight) + 10;

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
                <Handle
                  type="target"
                  position={Position.Left}
                  id={targetHandleId}
                  style={{
                    top: topOffset,
                    position: "absolute",
                    transform: "translateX(-50%)",
                    background: "#ef4444",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                  }}
                />
                <span style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "0px 10px" }}>
                  <strong>{col.name}</strong>
                  <strong>{col.index}</strong>
                  <span> ({col.type})</span>
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={sourceHandleId}
                  style={{
                    top: topOffset,
                    position: "absolute",
                    transform: "translateX(50%)",
                    background: "#10b981",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Options Popup */}
        {/* <div
        //   style={{
        //     position: "fixed",
        //     left: editPosition.x,
        //     top: editPosition.y,
        //     transform: "translateX(-50%)",
        //     background: "white",
        //     border: "1px solid #ddd",
        //     borderRadius: "8px",
        //     padding: "8px",
        //     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        //     zIndex: 1000,
        //     minWidth: "120px",
        //   }}
        //   onClick={(e) => e.stopPropagation()}
        // >
        //   <button
        //     onClick={handleEditClick}
        //     style={{
        //       width: "100%",
        //       padding: "8px 12px",
        //       background: "#3b82f6",
        //       color: "white",
        //       border: "none",
        //       borderRadius: "4px",
        //       cursor: "pointer",
        //       fontSize: "12px",
        //     }}
        //   >
        //     Edit Table
        //   </button>
        //   <button
        //     onClick={() => {
        //       if (data.onDelete) {
        //         data.onDelete(id);
        //       }
        //       setShowEditOptions(false);
        //     }}
        //     style={{
        //       width: "100%",
        //       padding: "8px 12px",
        //       background: "#ef4444",
        //       color: "white",
        //       border: "none",
        //       borderRadius: "4px",
        //       cursor: "pointer",
        //       marginTop: "4px",
        //       fontSize: "12px",
        //     }}
        //   >
        //     Delete Table
        //   </button>
        // </div> */}

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
function EditForm({ nodeData, position, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    TableName: nodeData.TableName,
    columns: nodeData.columns.map(col => ({ ...col }))
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateColumn = (index, field, value) => {
    const updatedColumns = [...formData.columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, columns: updatedColumns }));
  };

  const addColumn = () => {
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, { name: "", type: "varchar", index: "", nullable: true }]
    }));
  };

  const removeColumn = (index) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
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
          <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>
            Table Name:
          </label>
          <input
            type="text"
            value={formData.TableName}
            onChange={(e) => setFormData(prev => ({ ...prev, TableName: e.target.value }))}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
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
            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Column name"
                value={col.name}
                onChange={(e) => updateColumn(index, "name", e.target.value)}
                style={{
                  flex: 1,
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <select
                value={col.type}
                onChange={(e) => updateColumn(index, "type", e.target.value)}
                style={{
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <option value="varchar">varchar</option>
                <option value="int">int</option>
                <option value="text">text</option>
                <option value="date">date</option>
                <option value="datetime">datetime</option>
              </select>
              <button
                type="button"
                onClick={() => removeColumn(index)}
                style={{
                  padding: "6px",
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

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
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
            Save
          </button>
        </div>
      </form>
    </div>
  );
}