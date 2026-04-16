// src/App.jsx
import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import MeshGrid, { StateComparison } from './components/MeshGrid';
import ComplexityPanel from './components/ComplexityPanel';
import {
  initData, rowShiftAmount, colShiftAmount,
  applyRowShiftAmount, applyColShiftAmount
} from './utils/shiftLogic';
import './App.css';

const DELAY_MS = 1200;

export default function App() {
  const [simState, setSimState] = useState({
    p: null, q: null,
    data: [],
    stage: 'idle',
    before: null,
    afterStage1: null,
    afterStage2: null,
    rowShift: 0,
    colShift: 0,
    animatedNodes: new Set(),
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [liveP, setLiveP] = useState(16);
  const [liveQ, setLiveQ] = useState(5);

  const handleRun = useCallback(async (p, q) => {
    setIsAnimating(true);
    setLiveP(p); setLiveQ(q);

    const initial = initData(p);
    const rs = rowShiftAmount(p, q);
    const cs = colShiftAmount(p, q);

    // Show initial state
    setSimState(s => ({
      ...s, p, q,
      data: [...initial],
      stage: 'idle',
      before: [...initial],
      afterStage1: null,
      afterStage2: null,
      rowShift: rs, colShift: cs,
      animatedNodes: new Set(),
    }));

    await sleep(DELAY_MS);

    // Stage 1 — Row Shift
    const allNodes = new Set(Array.from({ length: p }, (_, i) => i));
    setSimState(s => ({
      ...s, stage: 'stage1',
      animatedNodes: rs > 0 ? allNodes : new Set(),
    }));

    await sleep(DELAY_MS);

    const afterRow = applyRowShiftAmount(initial, p, rs);
    setSimState(s => ({
      ...s,
      data: afterRow,
      afterStage1: [...afterRow],
      animatedNodes: new Set(),
    }));

    await sleep(DELAY_MS);

    // Stage 2 — Column Shift
    setSimState(s => ({
      ...s, stage: 'stage2',
      animatedNodes: cs > 0 ? allNodes : new Set(),
    }));

    await sleep(DELAY_MS);

    const afterCol = applyColShiftAmount(afterRow, p, cs);
    setSimState(s => ({
      ...s,
      data: afterCol,
      afterStage2: [...afterCol],
      animatedNodes: new Set(),
    }));

    await sleep(DELAY_MS);

    // Done
    setSimState(s => ({ ...s, stage: 'done', animatedNodes: new Set() }));
    setIsAnimating(false);
  }, []);

  const handleReset = useCallback(() => {
    setSimState({
      p: null, q: null,
      data: [],
      stage: 'idle',
      before: null,
      afterStage1: null,
      afterStage2: null,
      rowShift: 0, colShift: 0,
      animatedNodes: new Set(),
    });
    setIsAnimating(false);
  }, []);

  const handleParamChange = (p, q) => { setLiveP(p); setLiveQ(q); };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-icon">⬡</div>
          <div>
            <h1 className="app-title">Mesh Circular Shift Visualizer</h1>
            <p className="app-subtitle">2D Mesh Topology · Circular q-Shift · Step-by-Step Animation</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="left-col">
          <ControlPanel
            onRun={handleRun}
            onReset={handleReset}
            isAnimating={isAnimating}
            onParamChange={handleParamChange}
          />
          <ComplexityPanel p={liveP} q={liveQ} />
        </div>

        <div className="right-col">
          <MeshGrid
            data={simState.data}
            p={simState.p}
            stage={simState.stage}
            rowShift={simState.rowShift}
            colShift={simState.colShift}
            animatedNodes={simState.animatedNodes}
          />

          <StateComparison
            before={simState.before}
            afterStage1={simState.afterStage1}
            afterStage2={simState.afterStage2}
            p={simState.p}
          />
        </div>
      </main>

      <footer className="app-footer">
        Mesh Circular Shift Visualizer · Parallel Computing Assignment
      </footer>
    </div>
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
