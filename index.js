// Beaned-Charts: Minimalist SVG Chart Library
// Zero-dependency, lightweight, and responsive

class SVGFactory {
  static createSVG(width, height, viewBox = null) {
    const vb = viewBox || `0 0 ${width} ${height}`;
    return `<svg width="${width}" height="${height}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">`;
  }

  static closeSVG() {
    return '</svg>';
  }

  static createGroup(attributes = {}) {
    const attrs = Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<g ${attrs}>`;
  }

  static closeGroup() {
    return '</g>';
  }
}

function normalizeCoordinate(value, min, max, targetMin, targetMax) {
  return ((value - min) / (max - min)) * (targetMax - targetMin) + targetMin;
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function getColor(index) {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red  
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316'  // orange
  ];
  return colors[index % colors.length];
}

class BarChart {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.padding = options.padding || 40;
    this.colors = options.colors || [];
    this.showLabels = options.showLabels !== false;
    this.barSpacing = options.barSpacing || 0.2;
    this.showTooltips = options.showTooltips !== false;
    this.hoverEffects = options.hoverEffects !== false;
    
    // New customizable bar dimensions
    this.barWidth = options.barWidth; // Custom width for all bars, or array of widths
    this.barHeight = options.barHeight; // Custom height for all bars, or array of heights
    this.minBarWidth = options.minBarWidth || 20; // Minimum bar width
    this.maxBarWidth = options.maxBarWidth; // Maximum bar width
    this.minBarHeight = options.minBarHeight || 10; // Minimum bar height
    this.maxBarHeight = options.maxBarHeight; // Maximum bar height
  }

  render() {
    const maxY = Math.max(...this.data.map(d => d.value));
    const minY = Math.min(...this.data.map(d => d.value));
    const chartWidth = this.width - 2 * this.padding;
    const chartHeight = this.height - 2 * this.padding;
    
    // Calculate or use custom bar dimensions
    let barWidths = [];
    let barHeights = [];
    
    if (Array.isArray(this.barWidth)) {
      // Individual widths for each bar
      barWidths = this.barWidth.map(w => Math.max(this.minBarWidth || 0, Math.min(this.maxBarWidth || w, w)));
    } else if (this.barWidth) {
      // Same width for all bars
      barWidths = new Array(this.data.length).fill(Math.max(this.minBarWidth || 0, Math.min(this.maxBarWidth || this.barWidth, this.barWidth)));
    } else {
      // Auto-calculate widths
      const defaultBarWidth = (chartWidth / this.data.length) * (this.barSpacing || 0.8);
      barWidths = new Array(this.data.length).fill(Math.max(this.minBarWidth || 0, defaultBarWidth));
    }
    
    if (Array.isArray(this.barHeight)) {
      // Individual heights for each bar
      barHeights = this.barHeight.map(h => Math.max(this.minBarHeight || 0, Math.min(this.maxBarHeight || h, h)));
    } else if (this.barHeight) {
      // Same height for all bars
      barHeights = new Array(this.data.length).fill(Math.max(this.minBarHeight || 0, Math.min(this.maxBarHeight || this.barHeight, this.barHeight)));
    } else {
      // Auto-calculate heights based on data
      barHeights = this.data.map(item => normalizeCoordinate(item.value, minY, maxY, this.minBarHeight || 0, Math.max(this.maxBarHeight || chartHeight, this.minBarHeight || 10)));
    }
    
    // Calculate spacing based on bar widths
    const totalBarWidth = barWidths.reduce((sum, w) => sum + w, 0);
    const totalSpacing = chartWidth - totalBarWidth;
    const spacing = totalSpacing / (this.data.length + 1);

    let svg = SVGFactory.createSVG(this.width, this.height);
    
    // Professional styling with recharts-inspired design
    svg += `<style>
      .bar-chart {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        font-size: 12px;
        color: #666;
      }
      
      .grid-line {
        stroke: #f0f0f0;
        stroke-width: 1;
        opacity: 0.7;
      }
      
      .axis-line {
        stroke: #ddd;
        stroke-width: 1;
      }
      
      .bar {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1));
        rx: 3;
      }
      
      .bar:hover {
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.15));
        transform: translateY(-2px);
      }
      
      .bar-group:hover .bar {
        fill-opacity: 0.9;
      }
      
      .value-label {
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
        font-size: 11px;
        fill: #333;
        text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        dominant-baseline: middle;
      }
      
      .bar-group:hover .value-label {
        opacity: 1;
        transform: translateY(-8px);
      }
      
      .tooltip {
        opacity: 0;
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }
      
      .bar-group:hover .tooltip {
        opacity: 1;
      }
      
      .x-axis-label {
        font-size: 11px;
        fill: #666;
        text-anchor: middle;
        font-weight: 500;
      }
      
      .y-axis-label {
        font-size: 10px;
        fill: #999;
        text-anchor: end;
        dominant-baseline: middle;
      }
    </style>`;

    svg += SVGFactory.createGroup();
    
    this.data.forEach((item, index) => {
      const barHeight = barHeights[index] || normalizeCoordinate(item.value, minY, maxY, this.minBarHeight || 0, chartHeight);
      const barWidth = barWidths[index];
      const x = this.padding + spacing + index * (barWidth + spacing);
      const y = this.height - this.padding - barHeight;
      
      // Professional color gradients
      const gradientId = `bar-gradient-${index}`;
      const colors = this.colors[index] || getColor(index);
      const hoverColor = this.adjustColorBrightness(colors, -0.1); // Slightly darker for hover
      
      // Add gradient definition
      svg += `<defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${colors};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${colors};stop-opacity:0.7" />
        </linearGradient>
      </defs>`;
      
      svg += SVGFactory.createGroup({ class: 'bar-group' });
      
      // Main bar with gradient
      svg += `<rect class="bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
              fill="url(#${gradientId})" rx="3" />`;
      
      // Add hover value label
      if (this.hoverEffects) {
        svg += `<text class="value-label" x="${x + barWidth/2}" y="${y - 8}" 
                text-anchor="middle" fill="#333" font-weight="bold" font-size="12">
                ${item.value}
                </text>`;
      }
      
      // Add tooltip - positioned inside bar when possible
      if (this.showTooltips) {
        // Calculate text dimensions
        const labelText = item.label || `Item ${index + 1}`;
        const valueText = item.value.toString();
        const maxCharsPerLine = 12; // Approximate characters that fit comfortably
        
        // Calculate number of lines needed
        const labelLines = Math.ceil(labelText.length / maxCharsPerLine);
        const valueLines = Math.ceil(valueText.length / maxCharsPerLine);
        const totalLines = labelLines + valueLines;
        
        // Calculate dynamic height (base height + extra for each line)
        const baseHeight = 20;
        const lineHeight = 14;
        const padding = 8;
        const tooltipHeight = baseHeight + (totalLines - 1) * lineHeight + padding;
        
        // Check if text fits inside bar
        const textWidth = Math.max(labelText.length, valueText.length) * 6 + 20;
        const fitsInside = barHeight > tooltipHeight + 10 && barWidth > textWidth + 20;
        
        let tooltipX, tooltipY, tooltipWidth;
        
        if (fitsInside) {
          // Position inside the bar
          tooltipX = x + barWidth/2 - 40;
          tooltipY = y + barHeight/2 - tooltipHeight/2;
          tooltipWidth = Math.max(textWidth, 80);
        } else {
          // Position above the bar (fallback)
          tooltipX = x + barWidth/2 - 40;
          tooltipY = y - tooltipHeight - 5;
          tooltipWidth = Math.max(textWidth, 80);
        }
        
        svg += `<g class="tooltip">
          <rect x="${tooltipX}" y="${tooltipY}" width="${tooltipWidth}" height="${tooltipHeight}" 
                fill="white" rx="4" stroke="#e1e5e9" stroke-width="1" 
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.1))" />
          <text x="${x + barWidth/2}" y="${tooltipY + 15}" text-anchor="middle" 
                fill="#374151" font-size="11" font-weight="500">
            ${labelText}
          </text>
          <text x="${x + barWidth/2}" y="${tooltipY + 15 + (labelLines * lineHeight)}" text-anchor="middle" 
                fill="#111827" font-size="12" font-weight="600">
            ${valueText}
          </text>
        </g>`;
      }
      
      if (this.showLabels && item.label) {
        svg += `<text class="x-axis-label" x="${x + barWidth/2}" y="${this.height - this.padding + 15}" 
                text-anchor="middle" font-size="12" fill="#666">${item.label}</text>`;
      }
      
      svg += SVGFactory.closeGroup();
    });

    svg += SVGFactory.closeGroup();
    svg += SVGFactory.closeSVG();
    
    return svg;
  }

  adjustColorBrightness(hex, percent) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse r, g, b values
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);
    
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}

class LineChart {
  constructor(data, options = {}) {
    this.data = data;
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.padding = options.padding || 40;
    this.color = options.color || '#90EE90';
    this.theme = options.theme || 'dark'; // 'dark' or 'light'
    this.showGrid = options.showGrid !== false; // Show grid lines
    this.gridColor = options.gridColor || '#333'; // Grid line color
    this.axisColor = options.axisColor || '#666'; // Axis text color
    this.backgroundColor = options.backgroundColor; // Optional custom background
    this.showXAxis = options.showXAxis !== false; // Show X-axis labels
    this.xAxisLabels = options.xAxisLabels || []; // Custom X-axis labels
    this.dateFormat = options.dateFormat; // Date formatting function
    this.showCrosshair = options.showCrosshair !== false; // Show crosshair line
    this.crosshairColor = options.crosshairColor || '#666'; // Crosshair color
    this.showTooltip = options.showTooltip !== false; // Show crosshair tooltip
    this.tooltipFormat = options.tooltipFormat; // Custom tooltip formatting
    this.smooth = options.smooth !== false; // Use smooth curves
    this.strokeWidth = options.strokeWidth || 2; // Line width
    this.pointRadius = options.pointRadius || 4; // Data point radius
    this.pointColor = options.pointColor || this.color; // Point color
    this.pointStrokeColor = options.pointStrokeColor || '#1a1a1a'; // Point stroke color
  }

  render() {
    const maxY = Math.max(...this.data.map(d => d.value));
    const minY = Math.min(...this.data.map(d => d.value));
    const chartWidth = this.width - 2 * this.padding;
    const chartHeight = this.height - 2 * this.padding;

    let svg = SVGFactory.createSVG(this.width, this.height);
    
    // Theme-based styling
    const isDark = this.theme === 'dark';
    const bgColor = this.backgroundColor || (isDark ? '#0a0a0a' : '#ffffff');
    const textColor = this.axisColor || (isDark ? '#666' : '#333');
    const gridColor = this.gridColor || (isDark ? '#333' : '#e5e5e5');
    const crosshairColor = this.crosshairColor || (isDark ? '#666' : '#ccc');
    
    svg += `<style>
      .chart-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      .grid-line {
        stroke: ${gridColor};
        stroke-width: 1;
        stroke-dasharray: 4,4;
        opacity: 0.5;
      }
      .axis-text {
        fill: ${textColor};
        font-size: 12px;
        font-weight: 500;
      }
      .x-axis-text {
        fill: ${textColor};
        font-size: 11px;
        font-weight: 500;
        text-anchor: middle;
      }
      .chart-line { 
        fill: none;
        stroke: ${this.color};
        stroke-width: ${this.strokeWidth};
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .data-point { 
        fill: ${this.pointColor};
        stroke: ${this.pointStrokeColor};
        stroke-width: 2;
      }
      .crosshair-line {
        stroke: ${crosshairColor};
        stroke-width: 1;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease-out;
      }
      .chart-area:hover .crosshair-line {
        opacity: 0.8;
      }
      .crosshair-tooltip {
        opacity: 0;
        transition: opacity 0.15s ease-out;
        pointer-events: none;
      }
      .chart-area:hover .crosshair-tooltip {
        opacity: 1;
      }
    </style>`;

    // Background
    svg += `<rect width="${this.width}" height="${this.height}" fill="${bgColor}" rx="8" />`;
    
    svg += SVGFactory.createGroup({ 
      class: 'chart-area',
      onmousemove: `event.preventDefault(); const rect = this.getBoundingClientRect(); const x = event.clientX - rect.left; const line = this.querySelector('.crosshair-line'); const tooltip = this.querySelector('.crosshair-tooltip'); if (line && x >= ${this.padding} && x <= ${this.width - this.padding}) { line.setAttribute('x1', x); line.setAttribute('x2', x); if (tooltip) { tooltip.setAttribute('transform', 'translate(' + (x + 10) + ', ' + (event.clientY - rect.top - 30) + ')'); } }`,
      onmouseout: `const line = this.querySelector('.crosshair-line'); const tooltip = this.querySelector('.crosshair-tooltip'); if (line) { line.setAttribute('x1', '0'); line.setAttribute('x2', '0'); } if (tooltip) { tooltip.setAttribute('transform', 'translate(0,0)'); }`
    });
    
    // Add grid lines and Y-axis labels
    if (this.showGrid) {
      const gridCount = 5;
      for (let i = 0; i <= gridCount; i++) {
        const y = this.padding + (i * chartHeight / gridCount);
        const value = Math.round(maxY - (i * (maxY - minY) / gridCount));
        
        // Horizontal grid line
        svg += `<line class="grid-line" x1="${this.padding}" y1="${y}" x2="${this.width - this.padding}" y2="${y}" />`;
        
        // Y-axis label
        svg += `<text class="axis-text" x="${this.padding - 10}" y="${y + 4}" text-anchor="end">${value}</text>`;
      }
    }
    
    // Add crosshair line
    if (this.showCrosshair) {
      svg += `<line class="crosshair-line" x1="0" y1="${this.padding}" x2="0" y2="${this.height - this.padding}" />`;
    }

    // Create points
    const points = this.data.map((item, index) => {
      const x = this.padding + normalizeCoordinate(index, 0, this.data.length - 1, 0, chartWidth);
      const y = this.height - this.padding - normalizeCoordinate(item.value, minY, maxY, 0, chartHeight);
      return { 
        x, 
        y, 
        value: item.value, 
        index, 
        label: item.label,
        date: item.date || item.label || `Point ${index + 1}`
      };
    });

    // Create smooth curved path
    let pathData;
    if (points.length > 1) {
      pathData = this.smooth ? this.createCatmullRomPath(points) : `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    } else {
      pathData = `M ${points[0].x},${points[0].y}`;
    }

    // Add the main line
    svg += `<path d="${pathData}" class="chart-line" />`;

    // Add data points
    points.forEach(point => {
      svg += `<circle class="data-point" cx="${point.x}" cy="${point.y}" r="${this.pointRadius}" />`;
    });
    
    // Add X-axis labels
    if (this.showXAxis) {
      points.forEach((point, index) => {
        const labelText = this.xAxisLabels[index] || 
                         (this.dateFormat ? this.dateFormat(point.date) : point.date) ||
                         `Point ${index + 1}`;
        svg += `<text class="x-axis-text" x="${point.x}" y="${this.height - this.padding + 20}">${labelText}</text>`;
      });
    }
    
    // Add crosshair tooltip
    if (this.showTooltip) {
      svg += `<g class="crosshair-tooltip">
        <rect x="0" y="0" width="120" height="40" rx="8" fill="rgba(30,30,30,0.95)" stroke="#444" stroke-width="1" />
        <text x="10" y="18" fill="${this.color}" font-size="14" font-weight="600" class="tooltip-value">328.00 USD</text>
        <text x="10" y="32" fill="#888" font-size="11" class="tooltip-date">Mar 26</text>
      </g>`;
    }

    svg += SVGFactory.closeGroup();
    svg += SVGFactory.closeSVG();
    
    return svg;
  }

  createCatmullRomPath(points) {
    if (points.length < 2) return '';
    if (points.length === 2) return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      
      // Catmull-Rom spline calculation
      const tension = 0.5;
      
      const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
      const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
      
      const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
      const cp2y = p2.y - (p3.y - p1.y) * tension / 6;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    
    return path;
  }

  createSmoothPath(points) {
    if (points.length < 3) return `M ${points.join(' L ')}`;
    
    let path = `M ${points[0]}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
      
      const cp1x = p1.split(',')[0] * 2/3 + p2.split(',')[0] * 1/3;
      const cp1y = p1.split(',')[1] * 2/3 + p2.split(',')[1] * 1/3;
      const cp2x = p1.split(',')[0] * 1/3 + p2.split(',')[0] * 2/3;
      const cp2y = p1.split(',')[1] * 1/3 + p2.split(',')[1] * 2/3;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2}`;
    }
    
    return path;
  }
}

class PieChart {
  constructor(data, options = {}) {
    this.data = data.filter(d => d.value > 0);
    this.width = options.width || 400;
    this.height = options.height || 400;
    this.colors = options.colors || [];
    this.holeSize = options.holeSize || 0;
    this.showLabels = options.showLabels !== false;
    this.showTooltips = options.showTooltips !== false;
    this.hoverEffects = options.hoverEffects !== false;
    this.explodeSlices = options.explodeSlices || false;
  }

  render() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 2 - 20;
    const holeRadius = radius * this.holeSize;
    
    const total = this.data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    let svg = SVGFactory.createSVG(this.width, this.height);
    
    // Add enhanced hover styles and animations
    svg += `<style>
      .slice { 
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        cursor: pointer;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.08));
        stroke-linejoin: round;
      }
      .slice:hover { 
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
        transform-origin: ${centerX}px ${centerY}px;
        transform: scale(1.05);
      }
      .slice:hover.explode {
        transform: scale(1.08);
      }
      .tooltip {
        opacity: 0;
        transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        backdrop-filter: blur(4px);
      }
      .slice-group:hover .tooltip {
        opacity: 1;
      }
      .percentage-label {
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
        pointer-events: none;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      .slice-group:hover .percentage-label {
        font-size: 14px;
        transform: scale(1.1);
      }
      .center-label {
        opacity: 0;
        transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
        font-size: 11px;
        fill: #1f2937;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        text-anchor: middle;
        dominant-baseline: middle;
      }
      .slice-group:hover .center-label {
        opacity: 1;
        transform: scale(1.05);
      }
    </style>`;
    
    svg += SVGFactory.createGroup();

    this.data.forEach((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * 360;
      
      if (percentage > 0) {
        svg += SVGFactory.createGroup({ class: 'slice-group' });
        
        // Create slice with hover effects
        const path = this.createSlicePath(centerX, centerY, radius, holeRadius, currentAngle, currentAngle + angle);
        const explodeOffset = this.explodeSlices ? 5 : 0;
        const midAngle = currentAngle + angle / 2;
        const explodeX = centerX + Math.cos((midAngle - 90) * Math.PI / 180) * explodeOffset;
        const explodeY = centerY + Math.sin((midAngle - 90) * Math.PI / 180) * explodeOffset;
        
        svg += `<path class="slice ${this.explodeSlices ? 'explode' : ''}" 
                d="${this.createSlicePath(explodeX, explodeY, radius, holeRadius, currentAngle, currentAngle + angle)}" 
                fill="${this.colors[index] || getColor(index)}" 
                stroke="white" stroke-width="2" />`;
        
        // Add percentage label on slice
        if (this.showLabels && percentage > 0.05) {
          const labelAngle = currentAngle + angle / 2;
          const labelRadius = holeRadius > 0 ? (radius + holeRadius) / 2 : radius * 0.7;
          const labelPos = polarToCartesian(explodeX, explodeY, labelRadius, labelAngle);
          
          svg += `<text class="percentage-label" x="${labelPos.x}" y="${labelPos.y}" 
                  text-anchor="middle" dominant-baseline="middle" 
                  font-size="12" fill="white" font-weight="bold">
                  ${Math.round(percentage * 100)}%
                  </text>`;
        }
        
        // Add hover center label for donut charts
        if (this.hoverEffects && holeRadius > 0 && percentage > 0.1) {
          svg += `<text class="center-label" x="${centerX}" y="${centerY}">
                  ${item.label || `Item ${index + 1}`}: ${item.value}
                  </text>`;
        }
        
        // Add tooltip
        if (this.showTooltips) {
          const tooltipRadius = radius + 30;
          const tooltipPos = polarToCartesian(explodeX, explodeY, tooltipRadius, currentAngle + angle / 2);
          
          svg += `<g class="tooltip">
            <rect x="${tooltipPos.x - 45}" y="${tooltipPos.y - 20}" width="90" height="40" 
                  fill="rgba(31, 41, 55, 0.95)" rx="6" />
            <rect x="${tooltipPos.x - 45}" y="${tooltipPos.y - 20}" width="90" height="40" 
                  fill="rgba(31, 41, 55, 0.95)" rx="6" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
            <text x="${tooltipPos.x}" y="${tooltipPos.y - 2}" text-anchor="middle" 
                  fill="white" font-size="10" font-weight="500">
              ${item.label || `Item ${index + 1}`}
            </text>
            <text x="${tooltipPos.x}" y="${tooltipPos.y + 10}" text-anchor="middle" 
                  fill="white" font-size="11" font-weight="bold">
              ${item.value} (${Math.round(percentage * 100)}%)
            </text>
          </g>`;
        }
        
        svg += SVGFactory.closeGroup();
        currentAngle += angle;
      }
    });

    svg += SVGFactory.closeGroup();
    svg += SVGFactory.closeSVG();
    
    return svg;
  }

  createSlicePath(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle) {
    const start = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    let path = [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, end.x, end.y
    ];
    
    if (innerRadius > 0) {
      const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);
      
      path.push("L", innerStart.x, innerStart.y);
      path.push("A", innerRadius, innerRadius, 0, largeArcFlag, 0, innerEnd.x, innerEnd.y);
    }
    
    path.push("Z");
    return path.join(" ");
  }
}

// Import React-style components and styled versions
const ReactChartComponents = require('./react-components');
const {
  StyledAreaChart,
  StyledBarChart,
  StyledLineChart,
  createAreaChart,
  createBarChart,
  createLineChart
} = ReactChartComponents;

module.exports = {
  // Original zero-dependency charts
  BarChart,
  LineChart,
  PieChart,
  
  // Enhanced React-style components
  ReactChartComponents,
  
  // Direct styled component exports
  StyledAreaChart,
  StyledBarChart,
  StyledLineChart,
  
  // Factory methods
  createAreaChart,
  createBarChart,
  createLineChart,
  
  // Utilities
  getColor,
  normalizeCoordinate,
  describeArc,
  SVGFactory,
  
  // Aliases for backward compatibility
  AreaChart: StyledAreaChart,
  BarChartStyled: StyledBarChart,
  LineChartStyled: StyledLineChart
};