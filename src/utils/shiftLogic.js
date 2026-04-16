// src/utils/shiftLogic.js
// Pure shift algorithm — testable, no UI dependencies

/**
 * Validate inputs p and q
 * p must be a perfect square between 4 and 64
 * q must be between 1 and p-1
 */
export function validateInputs(p, q) {
  const errors = [];
  const sqrtP = Math.sqrt(p);
  if (!Number.isInteger(sqrtP)) errors.push("p must be a perfect square (4, 9, 16, 25, 36, 49, 64).");
  if (p < 4 || p > 64) errors.push("p must be between 4 and 64.");
  if (q < 1 || q >= p) errors.push("q must be between 1 and p−1.");
  return errors;
}

/**
 * Generate initial node data array: node i has data value i
 */
export function initData(p) {
  return Array.from({ length: p }, (_, i) => i);
}

/**
 * Compute row shift amount: q mod sqrt(p)
 */
export function rowShiftAmount(p, q) {
  return q % Math.floor(Math.sqrt(p));
}

/**
 * Compute column shift amount: floor(q / sqrt(p))
 */
export function colShiftAmount(p, q) {
  return Math.floor(q / Math.floor(Math.sqrt(p)));
}

/**
 * Total mesh steps = rowShift + colShift
 */
export function meshSteps(p, q) {
  return rowShiftAmount(p, q) + colShiftAmount(p, q);
}

/**
 * Ring steps = min(q, p - q)
 */
export function ringSteps(p, q) {
  return Math.min(q, p - q);
}



/**
 * Apply Stage 1: Row Shift by given amount
 * Each row of sqrt(p) nodes shifts circularly left by rowShift positions
 */
export function applyRowShiftAmount(data, p, rowShift) {
  const sqrtP = Math.floor(Math.sqrt(p));
  const result = [...data];
  for (let row = 0; row < sqrtP; row++) {
    const rowStart = row * sqrtP;
    const rowData = data.slice(rowStart, rowStart + sqrtP);
    for (let col = 0; col < sqrtP; col++) {
      // node at (row, col) receives data from (row, (col - rowShift + sqrtP) % sqrtP)
      result[rowStart + col] = rowData[(col - rowShift + sqrtP) % sqrtP];
    }
  }
  return result;
}

/**
 * Apply Stage 2: Column Shift by given amount
 * Each column of sqrt(p) nodes shifts circularly up by colShift positions
 */
export function applyColShiftAmount(data, p, colShift) {
  const sqrtP = Math.floor(Math.sqrt(p));
  const result = [...data];
  for (let col = 0; col < sqrtP; col++) {
    const colData = [];
    for (let row = 0; row < sqrtP; row++) colData.push(data[row * sqrtP + col]);
    for (let row = 0; row < sqrtP; row++) {
      result[row * sqrtP + col] = colData[(row - colShift + sqrtP) % sqrtP];
    }
  }
  return result;
}

/**
 * Compute full circular shift: node i → node (i + q) mod p
 * Returns expected final data array (for verification)
 */
export function computeExpectedResult(p, q) {
  const data = initData(p);
  const result = new Array(p);
  for (let i = 0; i < p; i++) {
    result[(i + q) % p] = data[i];
  }
  return result;
}

/**
 * Build arrow data for row shift visualization
 * Returns array of {from: nodeIndex, to: nodeIndex, direction: 'right'|'left'}
 */
export function buildRowArrows(p, rowShift) {
  const sqrtP = Math.floor(Math.sqrt(p));
  const arrows = [];
  if (rowShift === 0) return arrows;
  for (let row = 0; row < sqrtP; row++) {
    for (let col = 0; col < sqrtP; col++) {
      const from = row * sqrtP + col;
      const to = row * sqrtP + (col + rowShift) % sqrtP;
      arrows.push({ from, to, direction: 'right' });
    }
  }
  return arrows;
}

/**
 * Build arrow data for column shift visualization
 */
export function buildColArrows(p, colShift) {
  const sqrtP = Math.floor(Math.sqrt(p));
  const arrows = [];
  if (colShift === 0) return arrows;
  for (let col = 0; col < sqrtP; col++) {
    for (let row = 0; row < sqrtP; row++) {
      const from = row * sqrtP + col;
      const to = ((row + colShift) % sqrtP) * sqrtP + col;
      arrows.push({ from, to, direction: 'down' });
    }
  }
  return arrows;
}

/**
 * Get all perfect squares between 4 and 64
 */
export function getPerfectSquares() {
  return [4, 9, 16, 25, 36, 49, 64];
}
