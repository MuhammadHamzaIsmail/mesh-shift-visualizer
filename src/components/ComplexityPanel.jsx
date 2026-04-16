// src/components/ComplexityPanel.jsx
import React from 'react';
import { rowShiftAmount, colShiftAmount, meshSteps, ringSteps } from '../utils/shiftLogic';

const COMPARISON_TABLE = [
  { p: 16, q: 3 }, { p: 16, q: 5 }, { p: 16, q: 7 },
  { p: 64, q: 3 }, { p: 64, q: 5 }, { p: 64, q: 7 },
];

export default function ComplexityPanel({ p, q }) {
  const isValid = p && q && q >= 1 && q < p;

  const rs = isValid ? rowShiftAmount(p, q) : 0;
  const cs = isValid ? colShiftAmount(p, q) : 0;
  const mesh = isValid ? meshSteps(p, q) : 0;
  const ring = isValid ? ringSteps(p, q) : 0;
  const savings = ring > 0 ? (((ring - mesh) / ring) * 100).toFixed(1) : 0;
  const maxBar = Math.max(mesh, ring, 1);

  return (
    <div className="complexity-panel">
      <h2 className="panel-title">📊 Complexity Analysis</h2>

      {isValid ? (
        <>
          <div className="complexity-stats">
            <Stat label="Row Shift" value={rs} unit="steps" color="#f59e0b" />
            <Stat label="Col Shift" value={cs} unit="steps" color="#06b6d4" />
            <Stat label="Mesh Total" value={mesh} unit="steps" color="#22c55e" />
            <Stat label="Ring Steps" value={ring} unit="steps" color="#f43f5e" />
          </div>

          <div className="formula-comparison">
            <div className="formula-row">
              <span className="f-label ring">Ring</span>
              <span className="f-expr">min(q, p−q) = min({q}, {p - q}) = <strong>{ring}</strong></span>
            </div>
            <div className="formula-row">
              <span className="f-label mesh">Mesh</span>
              <span className="f-expr">(q mod √p) + ⌊q/√p⌋ = {rs} + {cs} = <strong>{mesh}</strong></span>
            </div>
          </div>

          <div className="bar-comparison">
            <div className="bar-title">Step Count Comparison</div>
            <BarRow label="Mesh" value={mesh} max={maxBar} color="#22c55e" />
            <BarRow label="Ring" value={ring} max={maxBar} color="#f43f5e" />
          </div>

          {ring > mesh && (
            <div className="savings-badge">
              🚀 Mesh saves <strong>{savings}%</strong> vs Ring
            </div>
          )}
          {ring === mesh && (
            <div className="savings-badge equal">
              ≈ Mesh and Ring equal for these values
            </div>
          )}
          {ring < mesh && (
            <div className="savings-badge worse">
              ⚠ Ring faster for this (q, p) pair
            </div>
          )}
        </>
      ) : (
        <div className="complexity-placeholder">
          Enter valid p and q to see analysis
        </div>
      )}

      <div className="comparison-table-wrap">
        <div className="table-title">Mesh vs Ring — Reference Table</div>
        <table className="cmp-table">
          <thead>
            <tr>
              <th>p</th><th>q</th><th>√p</th>
              <th>Row</th><th>Col</th><th>Mesh</th><th>Ring</th><th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_TABLE.map(({ p: tp, q: tq }) => {
              const trs = rowShiftAmount(tp, tq);
              const tcs = colShiftAmount(tp, tq);
              const tm = meshSteps(tp, tq);
              const tr = ringSteps(tp, tq);
              const ts = tr > 0 ? (((tr - tm) / tr) * 100).toFixed(0) : 0;
              const highlight = isValid && tp === p && tq === q;
              return (
                <tr key={`${tp}-${tq}`} className={highlight ? 'row-highlight' : ''}>
                  <td>{tp}</td><td>{tq}</td><td>{Math.sqrt(tp)}</td>
                  <td>{trs}</td><td>{tcs}</td>
                  <td className="mesh-val">{tm}</td>
                  <td className="ring-val">{tr}</td>
                  <td className={tm < tr ? 'save-pos' : 'save-neg'}>{ts}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-unit">{unit}</div>
    </div>
  );
}

function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="bar-num">{value}</div>
    </div>
  );
}
