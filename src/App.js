import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const size = 10; // 10x10 grid
  const targetCount = 100; // Target dataset size
  const [grid, setGrid] = useState(Array(size * size).fill(0));
  const [label, setLabel] = useState("");
  const [dataset, setDataset] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Toggle cell on draw
  const toggleCell = (index) => {
    setGrid((prev) => {
      const newGrid = [...prev];
      newGrid[index] = 1; // always set to 1 when drawing
      return newGrid;
    });
  };

  // Mouse events
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

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    const index = getCellIndexFromTouch(e);
    if (index !== null) {
      setIsDrawing(true);
      toggleCell(index);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isDrawing) {
      const index = getCellIndexFromTouch(e);
      if (index !== null) {
        toggleCell(index);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  // Helper: get index from touch position
  const getCellIndexFromTouch = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset && element.dataset.index) {
      return parseInt(element.dataset.index, 10);
    }
    return null;
  };

  // Save a sample
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

  // Download JSON file
  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dataset.json";
    link.click();
  };

  // Add global mouse/touch up listeners
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
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
          touchAction: "none", // Prevent scroll during touch draw
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {grid.map((cell, idx) => (
          <div
            key={idx}
            data-index={idx} // Needed for touch detection
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

      <p>
        Samples collected: {dataset.length} / {targetCount}
      </p>
    </div>
  );
}
