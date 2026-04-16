// src/components/ControlPanel.jsx
import React, { useState } from 'react';
import { getPerfectSquares, validateInputs } from '../utils/shiftLogic';

export default function ControlPanel({ onRun, onReset, isAnimating }) {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [errors, setErrors] = useState([]);

  const handleRun = () => {
    const errs = validateInputs(Number(p), Number(q));
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onRun(Number(p), Number(q));
  };

  const handleReset = () => {
    setErrors([]);
    onReset();
  };

  return (
    <div className="control-panel">
      <h2 className="panel-title">⚙️ Parameters</h2>

      <div className="input-group">
        <label htmlFor="p-select">
          p — Total Nodes
          <span className="hint">(perfect square, 4–64)</span>
        </label>
        <select
          id="p-select"
          value={p}
          onChange={e => { setP(Number(e.target.value)); setErrors([]); }}
          disabled={isAnimating}
        >
          {getPerfectSquares().map(v => (
            <option key={v} value={v}>{v} ({Math.sqrt(v)}×{Math.sqrt(v)} mesh)</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="q-input">
          q — Shift Amount
          <span className="hint">(1 to p−1)</span>
        </label>
        <input
          id="q-input"
          type="number"
          min={1}
          max={p - 1}
          value={q}
          onChange={e => { setQ(Number(e.target.value)); setErrors([]); }}
          disabled={isAnimating}
        />
      </div>

      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
        </div>
      )}

      <div className="btn-row">
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={isAnimating}
        >
          {isAnimating ? '⏳ Running…' : '▶ Run Simulation'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={isAnimating}
        >
          ↺ Reset
        </button>
      </div>

      <div className="formula-box">
        <div className="formula-title">Algorithm Formulas</div>
        <div className="formula-line">
          Node <em>i</em> → Node <em>(i + q) mod p</em>
        </div>
        <div className="formula-line">
          Stage 1 row shift = <em>q mod √p</em>
        </div>
        <div className="formula-line">
          Stage 2 col shift = <em>⌊q / √p⌋</em>
        </div>
      </div>
    </div>
  );
}
