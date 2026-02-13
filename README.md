# 🫘 Beaned-Charts

[![npm version](https://badge.fury.io/js/beaned-charts.svg)](https://badge.fury.io/js/beaned-charts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Minimalist, zero-dependency SVG chart library for modern web applications.** Create beautiful, responsive charts with pure JavaScript - no frameworks required!

## 📸 Preview

### Professional BarChart with Customizable Dimensions
![BarChart Preview](https://cdn.gamma.app/0q3kwkx42ofh0ga/38506d30ac964d58a4cba64041f54107/original/image.png)

*Professional bars with customizable dimensions, gradients, dynamic tooltips, and hover effects.*

## 🚀 Quick Start

```javascript
const { BarChart, LineChart, PieChart } = require('beaned-charts');

// Fully customizable BarChart
const barChart = new BarChart(data, {
  width: 600,
  height: 400,
  theme: 'dark',
  backgroundColor: '#1a1a1a',
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
  fontFamily: 'Inter, sans-serif',
  showGrid: true,
  gridColor: '#333',
  barSpacing: 0.3,
  barBorderRadius: 4,
  yAxisLabelFormat: (val) => `$${val.toLocaleString()}`,
  tooltipValueFormat: (val) => `$${val.toFixed(2)}`,
  hoverEffects: true,
  animationDuration: 400
});

document.body.innerHTML += barChart.render();
```

## 📊 Chart Types

### Bar Chart

The most customizable bar chart with extensive styling options:

```javascript
const chart = new BarChart(data, {
  // Core dimensions
  width: 600,
  height: 400,
  padding: 40,

  // Theme & colors
  theme: 'dark', // 'light' or 'dark' (auto-sets defaults)
  backgroundColor: '#1a1a1a',
  gridColor: '#333333',
  axisColor: '#cccccc',
  textColor: '#ffffff',
  barColor: '#ff6b6b', // Override default colors
  barHoverColor: '#ff5252',
  tooltipBackgroundColor: '#2a2a2a',
  tooltipTextColor: '#ffffff',
  tooltipBorderColor: '#555555',

  // Fonts & text
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  axisLabelFontSize: 10,
  tooltipFontSize: 11,
  xAxisLabelFormat: (label) => label.toUpperCase(),
  yAxisLabelFormat: (val) => `$${val.toLocaleString()}`,
  tooltipValueFormat: (val) => `$${val.toFixed(2)}`,
  tooltipLabelFormat: (label) => label.toUpperCase(),

  // Display options
  showBackground: true,
  showGrid: true,
  showXAxis: true,
  showYAxis: true,
  showLabels: true,
  showTooltips: true,
  hoverEffects: true,

  // Bar customization
  barWidth: 40, // Fixed width or array of widths
  barHeight: undefined, // Fixed height or array of heights
  minBarWidth: 20,
  maxBarWidth: 100,
  minBarHeight: 10,
  maxBarHeight: undefined,
  barSpacing: 0.2, // 0-1 spacing between bars
  barBorderRadius: 3,
  barOpacity: 0.9,
  barHoverOpacity: 0.8,

  // Grid & axis
  gridLines: 5,
  gridDashArray: '4,4',
  gridOpacity: 0.5,
  axisLineWidth: 1,

  // Animation
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Data range
  minValue: undefined, // Custom min value
  maxValue: undefined, // Custom max value
  valuePadding: 0.1 // Padding around data range
});
```

### Line Chart

Smooth, interactive line charts with extensive customization:

```javascript
const chart = new LineChart(data, {
  // Core dimensions
  width: 600,
  height: 400,
  padding: 40,

  // Theme & colors
  theme: 'dark',
  backgroundColor: '#1a1a1a',
  gridColor: '#333333',
  axisColor: '#cccccc',
  textColor: '#ffffff',
  lineColor: '#4ecdc4',
  pointColor: '#4ecdc4',
  pointStrokeColor: '#cccccc',
  crosshairColor: '#666666',
  tooltipBackgroundColor: '#2a2a2a',
  tooltipTextColor: '#ffffff',
  tooltipBorderColor: '#555555',

  // Fonts & text
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  axisLabelFontSize: 10,
  tooltipFontSize: 11,
  xAxisLabelFormat: (label) => label.toUpperCase(),
  yAxisLabelFormat: (val) => `$${val.toLocaleString()}`,
  tooltipValueFormat: (val) => `$${val.toFixed(2)}`,
  tooltipDateFormat: (date) => date.toLocaleDateString(),

  // Display options
  showBackground: true,
  showGrid: true,
  showXAxis: true,
  showYAxis: true,
  showLabels: true,
  showTooltips: true,
  showCrosshair: true,
  showPoints: true,

  // Line customization
  strokeWidth: 3,
  lineOpacity: 1,
  lineDashArray: undefined, // '5,5' for dashed lines
  smooth: true, // Catmull-Rom curves

  // Point customization
  pointRadius: 4,
  pointOpacity: 1,
  pointStrokeWidth: 2,

  // Grid & axis
  gridLines: 5,
  gridDashArray: '4,4',
  gridOpacity: 0.5,
  axisLineWidth: 1,

  // Animation
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Data
  xAxisLabels: ['Jan', 'Feb', 'Mar'], // Custom X-axis labels
  dateFormat: (date) => new Date(date).toLocaleDateString(),

  // Data range
  minValue: undefined,
  maxValue: undefined,
  valuePadding: 0.1
});
```

### Pie Chart

Interactive pie/donut charts with full customization:

```javascript
const chart = new PieChart(data, {
  // Core dimensions
  width: 400,
  height: 400,

  // Theme & colors
  theme: 'dark',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  sliceColor: undefined, // Override default colors
  tooltipBackgroundColor: '#2a2a2a',
  tooltipTextColor: '#ffffff',
  tooltipBorderColor: '#555555',

  // Fonts & text
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  percentageFontSize: 12,
  tooltipFontSize: 11,
  tooltipValueFormat: (val) => `$${val.toFixed(2)}`,
  tooltipLabelFormat: (label) => label.toUpperCase(),
  tooltipPercentageFormat: (pct) => `${pct}%`,

  // Display options
  showBackground: true,
  showLabels: true,
  showTooltips: true,
  showCenterLabel: true,

  // Pie customization
  holeSize: 0.3, // 0 = pie, 0.3 = donut
  sliceBorderWidth: 2,
  sliceBorderColor: '#ffffff',
  sliceOpacity: 1,
  explodeSlices: true,
  explodeOffset: 5,

  // Animation
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  hoverEffects: true,

  // Center label (donut charts)
  centerLabelText: 'Total Sales',
  centerLabelFontSize: 14,
  centerLabelColor: '#ffffff'
});
```

## 🎨 Customization Guide

### Colors & Themes
- **theme**: `'light'` or `'dark'` - automatically sets appropriate defaults
- **backgroundColor**: CSS color for chart background (e.g., `'#1a1a1a'`, `'white'`)
- **Custom colors**: Override any color with CSS values

### Fonts & Typography
- **fontFamily**: CSS font-family string
- **fontSize**: Base font size in pixels
- **axisLabelFontSize**: Size for axis labels
- **tooltipFontSize**: Size for tooltip text

### Layout & Dimensions
- **width/height**: Chart dimensions in pixels
- **padding**: Space around chart content
- **showGrid/showXAxis/showYAxis**: Toggle display elements

### Data Formatting
- **yAxisLabelFormat**: Function to format Y-axis values
- **xAxisLabelFormat**: Function to format X-axis labels
- **tooltipValueFormat**: Function to format tooltip values
- **tooltipLabelFormat**: Function to format tooltip labels

### Interactions
- **hoverEffects**: Enable/disable hover animations
- **showTooltips**: Show/hide tooltips
- **animationDuration**: Animation timing in milliseconds
- **animationEasing**: CSS animation easing function

### Advanced Features
- **minValue/maxValue**: Control data range display
- **valuePadding**: Add padding around data range
- **Custom arrays**: Pass arrays for individual bar widths/heights, colors, etc.

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