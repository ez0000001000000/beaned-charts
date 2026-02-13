# 🫘 Beaned-Charts

[![npm version](https://badge.fury.io/js/beaned-charts.svg)](https://badge.fury.io/js/beaned-charts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Minimalist, zero-dependency SVG chart library for modern web applications. Generate beautiful, responsive charts with pure JavaScript - no frameworks required!

## 📸 Previews

### BarChart
![BarChart Preview](https://cdn.gamma.app/0q3kwkx42ofh0ga/38506d30ac964d58a4cba64041f54107/original/image.png)

*Professional BarChart with customizable dimensions, dynamic tooltips, gradients, and hover effects.*

## ✨ Features

- **Zero Dependencies** - Pure JavaScript, no external libraries
- **Lightweight** - Under 5KB gzipped
- **Responsive** - SVG-based, scales perfectly
- **TypeScript Support** - Full type definitions included
- **Modern Design** - Clean, minimalist aesthetic
- **Easy to Use** - Simple API, get started in seconds
- **Interactive** - Rich hover effects, tooltips, and animations
- **Customizable** - Extensive options for colors, styles, and behaviors

## 📦 Installation

```bash
npm install beaned-charts
```

## 🚀 Quick Start

### Simple API (Zero Dependencies)

```javascript
const { BarChart, LineChart, PieChart } = require('beaned-charts');

// Bar Chart
const barChart = new BarChart([
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 190 },
  { label: 'Mar', value: 300 }
], { width: 400, height: 250 });

document.body.innerHTML += barChart.render();
```

### React-Style API (Enhanced Features)

```javascript
const { ReactChartComponents } = require('beaned-charts');

// Multi-Series Area Chart
const areaChart = ReactChartComponents.createAreaChart(data, {
  width: 800,
  height: 400
});

// Enhanced Bar Chart  
const barChart = ReactChartComponents.createBarChart(data, {
  width: 600,
  height: 350
});

// Smooth Line Chart
const lineChart = ReactChartComponents.createLineChart(data, {
  width: 600,
  height: 300,
  smooth: true
});
```

**Choose Your API:**
- **Simple API** - Perfect for basic charts, maximum performance
- **React-Style API** - Modern features, gradients, enhanced interactions

## 📊 Chart Types

### Bar Chart

Perfect for comparing categorical data with automatic scaling and interactive hover effects.

```javascript
const chart = new BarChart(data, {
  width: 500,
  height: 300,
  padding: 40,
  showLabels: true,
  barSpacing: 0.2,
  colors: ['#3b82f6', '#ef4444', '#10b981'],
  showTooltips: true,    // Show tooltips on hover
  hoverEffects: true,     // Enable hover animations
  
  // New customization options
  barWidth: 30,           // Fixed width for all bars (or array for individual widths)
  barHeight: null,        // Fixed height for all bars (or array for individual heights)
  minBarWidth: 20,        // Minimum bar width (default: 20)
  maxBarWidth: null,      // Maximum bar width (optional)
  minBarHeight: 10,       // Minimum bar height (default: 10)
  maxBarHeight: null      // Maximum bar height (optional)
});
```

**Options:**
- `width` (number) - Chart width in pixels
- `height` (number) - Chart height in pixels  
- `padding` (number) - Padding around chart (default: 40)
- `showLabels` (boolean) - Show value/axis labels (default: true)
- `barSpacing` (number) - Spacing between bars 0-1 (default: 0.2)
- `colors` (string[]) - Custom color palette
- `showTooltips` (boolean) - Show tooltips on hover (default: true)
- `hoverEffects` (boolean) - Enable hover animations (default: true)

**Bar Customization Options:**
- `barWidth` (number|number[]) - Fixed width for all bars, or array of widths for each bar
- `barHeight` (number|number[]) - Fixed height for all bars, or array of heights for each bar  
- `minBarWidth` (number) - Minimum allowed bar width (default: 20)
- `maxBarWidth` (number) - Maximum allowed bar width (optional)
- `minBarHeight` (number) - Minimum allowed bar height (default: 10)
- `maxBarHeight` (number) - Maximum allowed bar height (optional)

**Customization Examples:**

```javascript
// Fixed bar width for all bars
const chart1 = new BarChart(data, { barWidth: 40 });

// Individual widths for each bar
const chart2 = new BarChart(data, { barWidth: [20, 40, 60, 30] });

// Fixed bar height with constraints
const chart3 = new BarChart(data, { 
  barHeight: 100, 
  minBarHeight: 50,
  maxBarHeight: 150 
});

// Mixed customization
const chart4 = new BarChart(data, {
  barWidth: [25, 35, 45],  // Individual widths
  barHeight: null,          // Auto-height based on data
  minBarWidth: 20,          // Enforce minimum width
  maxBarWidth: 50           // Enforce maximum width
});
```

**Interactive Features:**
- 🖱️ **Hover Effects** - Bars lift and show shadows on hover
- 💬 **Tooltips** - Display label and value on hover
- 📊 **Value Labels** - Show values above bars on hover
- ✨ **Smooth Animations** - CSS transitions for all interactions

### Line Chart

Perfect for showing trends over time with smooth curves, customizable themes, and interactive crosshair.

```javascript
const chart = new LineChart([
  { value: 100, date: '2024-01-01', label: 'Jan' },
  { value: 120, date: '2024-02-01', label: 'Feb' },
  { value: 180, date: '2024-03-01', label: 'Mar' }
], {
  width: 600,
  height: 300,
  color: '#90EE90',           // Line color
  theme: 'dark',              // 'dark' or 'light' theme
  smooth: true,               // Smooth curved lines
  strokeWidth: 3,             // Line thickness
  pointRadius: 5,             // Data point size
  pointColor: '#90EE90',      // Point fill color
  pointStrokeColor: '#1a1a1a', // Point stroke color
  showGrid: true,             // Show grid lines
  showXAxis: true,            // Show X-axis labels
  showCrosshair: true,        // Show crosshair line
  showTooltip: true,          // Show crosshair tooltip
  xAxisLabels: ['January', 'February', 'March'], // Custom X-axis labels
  dateFormat: (date) => new Date(date).toLocaleDateString() // Date formatting function
});
```

**Options:**
- `width` (number) - Chart width in pixels
- `height` (number) - Chart height in pixels  
- `padding` (number) - Padding around chart (default: 40)
- `color` (string) - Line color (default: '#90EE90')
- `theme` (string) - Theme: 'dark' or 'light' (default: 'dark')
- `backgroundColor` (string) - Custom background color (optional)
- `smooth` (boolean) - Use smooth curves (default: true)
- `strokeWidth` (number) - Line thickness (default: 2)
- `pointRadius` (number) - Data point radius (default: 4)
- `pointColor` (string) - Point fill color (default: line color)
- `pointStrokeColor` (string) - Point stroke color (default: '#1a1a1a')

**Theme & Styling Options:**
- `showGrid` (boolean) - Show grid lines (default: true)
- `gridColor` (string) - Grid line color (theme-based default)
- `axisColor` (string) - Axis text color (theme-based default)
- `crosshairColor` (string) - Crosshair line color (theme-based default)

**Data & Labels Options:**
- `showXAxis` (boolean) - Show X-axis labels (default: true)
- `xAxisLabels` (string[]) - Custom X-axis labels array
- `dateFormat` (function) - Function to format dates for labels
- `showCrosshair` (boolean) - Show vertical crosshair line (default: true)
- `showTooltip` (boolean) - Show crosshair tooltip (default: true)
- `tooltipFormat` (function) - Custom tooltip formatting function

**Interactive Features:**
- �️ **Crosshair Line** - Vertical line follows mouse cursor
- 💬 **Tooltip** - Shows value and date at crosshair position
- � **Data Points** - Interactive points with custom styling
- ✨ **Smooth Animations** - CSS transitions for all interactions

### Pie Chart

Great for showing proportional data with donut chart support and interactive slice effects.

```javascript
const chart = new PieChart(data, {
  width: 400,
  height: 400,
  holeSize: 0.3,  // 0 = pie, 0.3 = donut
  showLabels: true,
  showTooltips: true,     // Show tooltips on hover
  hoverEffects: true,     // Enable hover animations
  explodeSlices: true     // Explode slices on hover
});
```

**Options:**
- `width` (number) - Chart width in pixels
- `height` (number) - Chart height in pixels
- `holeSize` (number) - Donut hole size 0-1 (default: 0)
- `showLabels` (boolean) - Show percentage labels (default: true)
- `colors` (string[]) - Custom color palette
- `showTooltips` (boolean) - Show tooltips on hover (default: true)
- `hoverEffects` (boolean) - Enable hover animations (default: true)
- `explodeSlices` (boolean) - Explode slices on hover (default: false)

**Interactive Features:**
- 🥧 **Slice Effects** - Slices glow and expand on hover
- 💥 **Exploding Slices** - Slices pop out when hovered (optional)
- 💬 **Enhanced Tooltips** - Show labels, values, and percentages
- 🎯 **Center Labels** - For donut charts, show data in center on hover
- ✨ **Smooth Transitions** - CSS animations for all interactions

## 🎨 Data Format

All charts accept an array of data points:

```javascript
const data = [
  { label: 'Category A', value: 100 },  // label is optional
  { value: 75 },
  { label: 'Category C', value: 150 }
];
```

## 🛠️ Utilities

Access low-level utilities for custom implementations:

```javascript
const { getColor, normalizeCoordinate, describeArc, SVGFactory } = require('beaned-charts');

// Get color from palette
getColor(0); // '#3b82f6'

// Map values to coordinate system  
normalizeCoordinate(50, 0, 100, 0, 200); // 100

// Create SVG arc paths
describeArc(50, 50, 40, 0, 90); // SVG path string

// SVG helper methods
SVGFactory.createSVG(400, 300);
SVGFactory.createGroup({ stroke: '#000' });
```

## 📚 Documentation

- **[README.md](./README.md)** - Basic getting started guide
- **[styled-charts.md](./styled-charts.md)** - Comprehensive React-style API documentation
- **[react-test.md](./react-test.md)** - React integration examples
- **[react-demo.js](./react-demo.js)** - Complete React-style demo

## 🎯 Choose Your API

### Simple API (Maximum Performance)
```javascript
const { BarChart, LineChart, PieChart } = require('beaned-charts');
const chart = new BarChart(data, options);
```

### React-Style API (Enhanced Features)
```javascript
const { ReactChartComponents } = require('beaned-charts');
const chart = ReactChartComponents.createAreaChart(data, options);
```

See [styled-charts.md](./styled-charts.md) for detailed React-style API documentation.

Beaned-Charts works in all modern browsers that support SVG:
- Chrome 4+
- Firefox 3.5+
- Safari 3.2+
- Edge 12+
- IE 9+

## 📄 License

MIT License - feel free to use in commercial projects!

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests.

---

**Beaned-Charts** - Simple. Beautiful. Charts. 🚀