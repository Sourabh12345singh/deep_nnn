import React, { useState } from "react";
import "./App.css";

export default function App() {
  const size = 10; // 10x10 grid
  const targetCount = 100 ; // Target dataset size
  const [grid, setGrid] = useState(Array(size * size).fill(0));
  const [label, setLabel] = useState("");
  const [dataset, setDataset] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const toggleCell = (index) => {
    setGrid((prev) => {
      const newGrid = [...prev];
      newGrid[index] = 1; // draw mode always sets to 1
      return newGrid;
    });
  };

  const handleMouseDown = (index) => {
    setIsDrawing(true);
    toggleCell(index);
  };

  const handleMouseEnter = (index) => {
    if (isDrawing) toggleCell(index);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const saveSample = () => {
    if (label === "") {
      alert("Enter a label first!");
      return;
    }

    const newData = [...dataset, { grid, label: parseInt(label) }];
    setDataset(newData);
    setGrid(Array(size * size).fill(0));
    setLabel("");

    if (newData.length >= targetCount) {
      alert(`🎉 You reached ${targetCount} samples! Saving file...`);
      downloadJSON(newData);
    }
  };

  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dataset.json";
    link.click();
  };

  return (
    <div
      style={{ textAlign: "center", padding: "20px" }}
      onMouseUp={handleMouseUp}
    >
      <h2>Reinforcement Learning Grid Collector</h2>

      <button
        onClick={() => alert(`Current samples: ${dataset.length}`)}
        style={{ marginBottom: "10px" }}
      >
        Count Samples
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 30px)`,
          gap: "2px",
          margin: "20px auto",
          width: "max-content",
        }}
      >
        {grid.map((cell, idx) => (
          <div
            key={idx}
            onMouseDown={() => handleMouseDown(idx)}
            onMouseEnter={() => handleMouseEnter(idx)}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: cell ? "black" : "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              userSelect: "none",
            }}
          />
        ))}
      </div>

      <input
        type="number"
        placeholder="Enter label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <button onClick={saveSample} style={{ marginLeft: "10px" }}>
        Save
      </button>

      <p>Samples collected: {dataset.length} / {targetCount}</p>
    </div>
  );
}
