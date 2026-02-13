# 🫘 Beaned-Charts

[![npm version](https://badge.fury.io/js/beaned-charts.svg)](https://badge.fury.io/js/beaned-charts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Minimalist, zero-dependency SVG chart library for modern web applications.** Create beautiful, responsive charts with pure JavaScript - no frameworks required!

## 📸 Preview

### Professional LineChart with Dark Theme
![LineChart Preview](https://cdn.gamma.app/0q3kwkx42ofh0ga/38506d30ac964d58a4cba64041f54107/original/image.png)

*Smooth curves, crosshair, customizable tooltips, and extensive styling options.*

## 🚀 Quick Start

```javascript
const { BarChart, LineChart, PieChart } = require('beaned-charts');

// LineChart with extensive customization
const chart = new LineChart(data, {
  color: '#90EE90',           // Line color
  theme: 'dark',              // Dark or light theme
  strokeWidth: 3,             // Line thickness
  smooth: true,               // Curved lines
  showCrosshair: true,        // Interactive crosshair
  showTooltip: true,          // Hover tooltips
  yAxisLabelFormat: (val) => `$${val}`, // Custom Y-axis formatting
  tooltipValueFormat: (val) => `$${val.toFixed(2)}` // Custom tooltip formatting
});

document.body.innerHTML += chart.render();
```

## � Chart Types

- **BarChart**: Professional bars with customizable dimensions, gradients, and hover effects
- **LineChart**: Smooth curves with crosshair, themes, and extensive customization
- **PieChart**: Interactive slices with customizable tooltips and themes

## 🎨 Customization

All charts support extensive customization:
- **Themes**: Dark/light with automatic color adaptation
- **Colors**: Custom colors for lines, points, backgrounds, and grids
- **Formatting**: Custom functions for axis labels and tooltips
- **Styling**: Stroke widths, point sizes, grid lines, backgrounds
- **Interactivity**: Hover effects, tooltips, crosshairs

## 📦 Installation

```bash
npm install beaned-charts
```

## 🤝 Contributing

Contributions welcome! Please submit pull requests.

## ⭐ Starred by

Thanks to everyone who starred this repo! Your support means the world.

<img src="https://avatars.githubusercontent.com/u/17413306?s=40&v=4" width="40" height="40" style="border-radius: 50%; margin: 0 4px;" alt="babually" title="babually">
<img src="https://avatars.githubusercontent.com/u/4415580?s=40&v=4" width="40" height="40" style="border-radius: 50%; margin: 0 4px;" alt="pvictor" title="pvictor">
<img src="https://avatars.githubusercontent.com/u/207921618?s=40&v=4" width="40" height="40" style="border-radius: 50%; margin: 0 4px;" alt="as000010000" title="as000010000">

---

**Beaned-Charts** - Simple. Beautiful. Charts. 🚀