// src/components/MeshGrid.jsx
import React from 'react';

const STAGE_LABELS = {
  idle:    { label: 'Initial State',   color: '#64748b' },
  stage1:  { label: 'Stage 1 — Row Shift',  color: '#f59e0b' },
  stage2:  { label: 'Stage 2 — Column Shift', color: '#06b6d4' },
  done:    { label: 'Final State ✓',   color: '#22c55e' },
};

export default function MeshGrid({ data, p, stage, rowShift, colShift, animatedNodes }) {
  if (!data || data.length === 0) return (
    <div className="mesh-empty">
      <div className="mesh-empty-icon">⬡</div>
      <div>Set parameters and click <strong>Run Simulation</strong></div>
    </div>
  );

  const sqrtP = Math.floor(Math.sqrt(p));
  const stageInfo = STAGE_LABELS[stage] || STAGE_LABELS.idle;

  const getArrowLabel = (row, col) => {
    if (stage === 'stage1' && rowShift > 0) {
      return { show: true, dir: '→', label: `+${rowShift}`, axis: 'row' };
    }
    if (stage === 'stage2' && colShift > 0) {
      return { show: true, dir: '↓', label: `+${colShift}`, axis: 'col' };
    }
    return { show: false };
  };

  return (
    <div className="mesh-section">
      <div className="stage-badge" style={{ borderColor: stageInfo.color, color: stageInfo.color }}>
        {stageInfo.label}
      </div>

      {stage !== 'idle' && (
        <div className="shift-info-bar">
          {stage === 'stage1' && <span>Row shift: <strong>{rowShift}</strong> positions →</span>}
          {stage === 'stage2' && <span>Column shift: <strong>{colShift}</strong> positions ↓</span>}
          {stage === 'done'   && <span>Circular q-shift complete! Each node i now holds data from node (i−q+p) mod p</span>}
        </div>
      )}

      <div
        className="mesh-grid"
        style={{ gridTemplateColumns: `repeat(${sqrtP}, 1fr)` }}
      >
        {data.map((val, idx) => {
          const row = Math.floor(idx / sqrtP);
          const col = idx % sqrtP;
          const isAnimated = animatedNodes && animatedNodes.has(idx);
          const arrow = getArrowLabel(row, col);

          return (
            <div
              key={idx}
              className={`mesh-node ${isAnimated ? 'node-animated' : ''} stage-${stage}`}
              style={{
                '--node-color': stageInfo.color,
              }}
            >
              <div className="node-index">Node {idx}</div>
              <div className="node-value">{val}</div>
              {arrow.show && (
                <div className={`node-arrow arrow-${arrow.axis}`}>
                  {arrow.dir}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Row/Col labels */}
      <div className="mesh-labels">
        {Array.from({ length: sqrtP }, (_, i) => (
          <span key={i} className="mesh-label">Row {i}</span>
        ))}
      </div>
    </div>
  );
}

export function StateComparison({ before, afterStage1, afterStage2, p }) {
  if (!before) return null;
  const sqrtP = Math.floor(Math.sqrt(p));

  return (
    <div className="comparison-section">
      <h3 className="section-title">Before / After Comparison</h3>
      <div className="comparison-grid">
        <StateTable title="Before" data={before} sqrtP={sqrtP} color="#64748b" />
        {afterStage1 && <StateTable title="After Stage 1" data={afterStage1} sqrtP={sqrtP} color="#f59e0b" />}
        {afterStage2 && <StateTable title="After Stage 2 (Final)" data={afterStage2} sqrtP={sqrtP} color="#22c55e" />}
      </div>
    </div>
  );
}

function StateTable({ title, data, sqrtP, color }) {
  return (
    <div className="state-table">
      <div className="state-table-title" style={{ color }}>{title}</div>
      <div
        className="state-mini-grid"
        style={{ gridTemplateColumns: `repeat(${sqrtP}, 1fr)` }}
      >
        {data.map((val, idx) => (
          <div key={idx} className="mini-node" style={{ borderColor: color + '55' }}>
            <span className="mini-idx">{idx}</span>
            <span className="mini-val" style={{ color }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
