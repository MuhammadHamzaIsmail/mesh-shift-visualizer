# Mesh Circular Shift Visualizer

An interactive web application that simulates and visualizes **circular q-shift** on a 2D mesh topology, implemented as a two-stage algorithm.

## 🔗 Live Demo

> **[https://mesh-shift-visualizer.vercel.app](https://mesh-shift-visualizer.vercel.app)**  
> *(Replace with your actual Vercel/Netlify URL after deployment)*

---

## 📐 Algorithm Overview

A **circular q-shift** transfers node `i`'s data to node `(i + q) mod p`.

On a 2D mesh (√p × √p), this is done in two stages:

| Stage | Operation | Formula |
|-------|-----------|---------|
| Stage 1 | Row Shift | `q mod √p` positions right |
| Stage 2 | Column Shift | `⌊q / √p⌋` positions down |

**Mesh efficiency** vs Ring: `(q mod √p) + ⌊q/√p⌋` vs `min(q, p−q)`

---

## 🚀 Running Locally

### Prerequisites
- Node.js ≥ 16
- npm or yarn

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/mesh-shift-visualizer.git
cd mesh-shift-visualizer

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open in browser
# → http://localhost:3000
```

### Build for Production

```bash
npm run build
```

This creates an optimized `build/` folder ready for deployment.

---

## 📁 Project Structure

```
mesh-shift-visualizer/
├── public/
│   └── index.html              ← HTML entry point
├── src/
│   ├── components/
│   │   ├── MeshGrid.jsx        ← Grid rendering + animation + state comparison
│   │   ├── ControlPanel.jsx    ← User inputs (p, q) + validation
│   │   └── ComplexityPanel.jsx ← Complexity analysis panel + bar chart + table
│   ├── utils/
│   │   └── shiftLogic.js       ← Pure shift algorithm (testable)
│   ├── App.jsx                 ← Main app + animation state machine
│   ├── App.css                 ← All styles
│   └── index.js                ← React entry point
├── README.md
└── package.json
```

---

## ☁️ Deployment Guide

### Vercel (Recommended)

1. Push your code to GitHub (public repo)
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Framework preset: **Create React App**
5. Click **Deploy** — done!

### Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect GitHub → select repo
3. Build command: `npm run build`
4. Publish directory: `build`
5. Click **Deploy site**

---

## ✨ Features

- **Input Validation** — p must be a perfect square (4–64), q must be 1 to p−1
- **Animated Visualization** — nodes pulse and highlight during each stage
- **Step-by-Step** — Initial → Stage 1 (Row) → Stage 2 (Col) → Final
- **Before/After Tables** — side-by-side comparison of all three states
- **Complexity Panel** — live-updating bar chart and reference table
- **Responsive** — works on mobile, tablet, desktop

---

## 👤 Author

Your Name — Student ID: 23F-XXXX  
FAST NUCES — Parallel Computing Assignment 2
