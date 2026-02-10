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
  }

  render() {
    const maxY = Math.max(...this.data.map(d => d.value));
    const minY = Math.min(...this.data.map(d => d.value));
    const chartWidth = this.width - 2 * this.padding;
    const chartHeight = this.height - 2 * this.padding;
    const barWidth = (chartWidth / this.data.length) * (this.barSpacing || 0.8);
    const spacing = (chartWidth / this.data.length) * ((1 - (this.barSpacing || 0.8)) / 2);

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
      const barHeight = normalizeCoordinate(item.value, minY, maxY, 0, chartHeight);
      const x = this.padding + index * (barWidth + spacing) + spacing/2;
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
        // Check if text fits inside bar
        const textWidth = (item.label || `Item ${index + 1}`).length * 6 + item.value.toString().length * 7;
        const fitsInside = barHeight > 40 && barWidth > textWidth + 20;
        
        let tooltipX, tooltipY, tooltipWidth, tooltipHeight;
        
        if (fitsInside) {
          // Position inside the bar
          tooltipX = x + barWidth/2 - 35;
          tooltipY = y + barHeight/2 - 10;
          tooltipWidth = 70;
          tooltipHeight = 20;
        } else {
          // Position above the bar (fallback)
          tooltipX = x + barWidth/2 - 35;
          tooltipY = y - 30;
          tooltipWidth = 70;
          tooltipHeight = 25;
        }
        
        svg += `<g class="tooltip">
          <rect x="${tooltipX}" y="${tooltipY - 2}" width="${tooltipWidth}" height="${tooltipHeight}" 
                fill="white" rx="3" stroke="#ddd" stroke-width="1" />
          <text x="${x + barWidth/2}" y="${tooltipY + 3}" text-anchor="middle" 
                fill="black" font-size="10" font-weight="500">
            ${item.label || `Item ${index + 1}`}
          </text>
          <text x="${x + barWidth/2}" y="${tooltipY + 15}" text-anchor="middle" 
                fill="black" font-size="11" font-weight="bold">
            ${item.value}
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
    this.color = options.color || '#3b82f6';
    this.smooth = options.smooth || false;
    this.showPoints = options.showPoints !== false;
    this.fill = options.fill || false;
    this.showTooltips = options.showTooltips !== false;
    this.hoverEffects = options.hoverEffects !== false;
    this.showAreaHighlight = options.showAreaHighlight !== false;
  }

  render() {
    const maxY = Math.max(...this.data.map(d => d.value));
    const minY = Math.min(...this.data.map(d => d.value));
    const chartWidth = this.width - 2 * this.padding;
    const chartHeight = this.height - 2 * this.padding;

    let svg = SVGFactory.createSVG(this.width, this.height);
    
    // Add enhanced hover styles and animations
    svg += `<style>
      .chart-line { 
        transition: stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.08));
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .chart-line:hover { 
        stroke-width: 3;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
      }
      .data-point { 
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        cursor: pointer;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.08));
      }
      .data-point:hover { 
        r: 6;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
      }
      .tooltip {
        opacity: 0;
        transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        backdrop-filter: blur(4px);
      }
      .point-group:hover .tooltip {
        opacity: 1;
      }
      .value-label {
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
        font-size: 10px;
        fill: #1f2937;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      .point-group:hover .value-label {
        opacity: 1;
        transform: translateY(-3px);
      }
      .area-highlight {
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .point-group:hover .area-highlight {
        opacity: 0.15;
      }
      .guide-line {
        stroke-dasharray: 3,3;
        stroke-linecap: round;
      }
    </style>`;

    svg += SVGFactory.createGroup();

    // Create path
    const points = this.data.map((item, index) => {
      const x = this.padding + normalizeCoordinate(index, 0, this.data.length - 1, 0, chartWidth);
      const y = this.height - this.padding - normalizeCoordinate(item.value, minY, maxY, 0, chartHeight);
      return { x, y, value: item.value, index };
    });

    const pointStrings = points.map(p => `${p.x},${p.y}`);
    let pathData;
    if (this.smooth && points.length > 2) {
      pathData = this.createSmoothPath(pointStrings);
    } else {
      pathData = `M ${pointStrings.join(' L ')}`;
    }

    // Add area fill if enabled
    if (this.fill) {
      const fillPath = pathData + ` L ${this.padding + chartWidth},${this.height - this.padding} L ${this.padding},${this.height - this.padding} Z`;
      svg += `<path d="${fillPath}" fill="${this.color}" fill-opacity="0.2" class="chart-area" />`;
    }

    // Add the main line
    svg += `<path d="${pathData}" fill="none" stroke="${this.color}" stroke-width="2" class="chart-line" />`;

    // Add interactive points
    if (this.showPoints) {
      points.forEach((point, index) => {
        svg += SVGFactory.createGroup({ class: 'point-group' });
        
        // Add area highlight on hover
        if (this.showAreaHighlight) {
          const highlightPath = `M ${point.x},${this.height - this.padding} L ${point.x},${point.y} L ${this.padding},${point.y} L ${this.padding},${this.height - this.padding} Z`;
          svg += `<path d="${highlightPath}" fill="${this.color}" class="area-highlight" />`;
        }
        
        // Add vertical guide line
        if (this.hoverEffects) {
          svg += `<line x1="${point.x}" y1="${point.y}" x2="${point.x}" y2="${this.height - this.padding}" 
                  stroke="${this.color}" stroke-width="1" stroke-dasharray="2,2" opacity="0" class="guide-line">
            <animate attributeName="opacity" values="0;0.3;0" dur="0.5s" begin="mouseover" />
            <animate attributeName="opacity" values="0.3;0" dur="0.3s" begin="mouseout" />
          </line>`;
        }
        
        // Add the data point
        svg += `<circle class="data-point" cx="${point.x}" cy="${point.y}" r="4" 
                fill="${this.color}" stroke="white" stroke-width="2" />`;
        
        // Add hover value label
        if (this.hoverEffects) {
          svg += `<text class="value-label" x="${point.x}" y="${point.y - 10}" 
                  text-anchor="middle" fill="#333" font-weight="bold" font-size="11">
                  ${point.value}
                  </text>`;
        }
        
        // Add tooltip
        if (this.showTooltips) {
          const tooltipY = point.y - 35;
          svg += `<g class="tooltip">
            <rect x="${point.x - 40}" y="${tooltipY - 15}" width="80" height="30" 
                  fill="rgba(31, 41, 55, 0.95)" rx="6" />
            <rect x="${point.x - 40}" y="${tooltipY - 15}" width="80" height="30" 
                  fill="rgba(31, 41, 55, 0.95)" rx="6" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
            <text x="${point.x}" y="${tooltipY - 2}" text-anchor="middle" 
                  fill="white" font-size="10" font-weight="500">
              Point ${index + 1}
            </text>
            <text x="${point.x}" y="${tooltipY + 10}" text-anchor="middle" 
                  fill="white" font-size="11" font-weight="bold">
              ${point.value}
            </text>
          </g>`;
        }
        
        svg += SVGFactory.closeGroup();
      });
    }

    svg += SVGFactory.closeGroup();
    svg += SVGFactory.closeSVG();
    
    return svg;
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