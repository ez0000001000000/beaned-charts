// Beaned-Charts LineChart
// Professional line chart with crosshair, smooth curves, and extensive customization

const { SVGFactory, normalizeCoordinate } = require('./utils');

class LineChart {
  constructor(data, options = {}) {
    // Core data and dimensions
    this.data = data;
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.padding = options.padding || 40;

    // Colors and themes
    this.colors = options.colors || [];
    this.theme = options.theme || 'dark';
    this.backgroundColor = options.backgroundColor || (this.theme === 'dark' ? '#1a1a1a' : '#ffffff');
    this.gridColor = options.gridColor || (this.theme === 'dark' ? '#333333' : '#e5e5e5');
    this.axisColor = options.axisColor || (this.theme === 'dark' ? '#cccccc' : '#666666');
    this.textColor = options.textColor || (this.theme === 'dark' ? '#ffffff' : '#333333');
    this.lineColor = options.lineColor || '#90EE90'; // Override default colors
    this.pointColor = options.pointColor; // Point fill color
    this.pointStrokeColor = options.pointStrokeColor; // Point stroke color
    this.crosshairColor = options.crosshairColor || (this.theme === 'dark' ? '#666666' : '#cccccc');
    this.tooltipBackgroundColor = options.tooltipBackgroundColor || (this.theme === 'dark' ? '#2a2a2a' : '#ffffff');
    this.tooltipTextColor = options.tooltipTextColor || (this.theme === 'dark' ? '#ffffff' : '#333333');
    this.tooltipBorderColor = options.tooltipBorderColor || (this.theme === 'dark' ? '#555555' : '#e1e5e9');

    // Fonts and text
    this.fontFamily = options.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif';
    this.fontSize = options.fontSize || 12;
    this.axisLabelFontSize = options.axisLabelFontSize || 10;
    this.tooltipFontSize = options.tooltipFontSize || 11;
    this.xAxisLabelFormat = options.xAxisLabelFormat; // Custom X-axis label formatting
    this.yAxisLabelFormat = options.yAxisLabelFormat; // Custom Y-axis label formatting
    this.tooltipValueFormat = options.tooltipValueFormat; // Custom tooltip value formatting
    this.tooltipDateFormat = options.tooltipDateFormat; // Custom tooltip date formatting

    // Chart display options
    this.showBackground = options.showBackground !== false;
    this.showGrid = options.showGrid !== false;
    this.showLabels = options.showLabels !== false;
    this.showTooltips = options.showTooltips !== false;
    this.showXAxis = options.showXAxis !== false;
    this.showYAxis = options.showYAxis !== false;
    this.showCrosshair = options.showCrosshair !== false;
    this.showPoints = options.showPoints !== false; // Show data points

    // Line customization
    this.strokeWidth = options.strokeWidth || 2; // Line width
    this.lineOpacity = options.lineOpacity || 1; // Line opacity
    this.lineDashArray = options.lineDashArray; // Dash pattern for line
    this.smooth = options.smooth !== false; // Use smooth curves

    // Point customization
    this.pointRadius = options.pointRadius || 4; // Data point radius
    this.pointOpacity = options.pointOpacity || 1; // Point opacity
    this.pointStrokeWidth = options.pointStrokeWidth || 2; // Point stroke width

    // Grid and axis customization
    this.gridLines = options.gridLines || 5; // Number of grid lines
    this.gridDashArray = options.gridDashArray || '4,4'; // Dash pattern for grid lines
    this.gridOpacity = options.gridOpacity || 0.5; // Grid line opacity
    this.axisLineWidth = options.axisLineWidth || 1; // Axis line width

    // Animation and interaction
    this.animationDuration = options.animationDuration || 300; // Animation duration in ms
    this.animationEasing = options.animationEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'; // Animation easing

    // Data and formatting
    this.dateFormat = options.dateFormat; // Date formatting function
    this.xAxisLabels = options.xAxisLabels || []; // Custom X-axis labels array

    // Data range customization
    this.minValue = options.minValue; // Minimum value to display
    this.maxValue = options.maxValue; // Maximum value to display
    this.valuePadding = options.valuePadding || 0.1; // Padding around data range (0-1)
  }

  render() {
    // Calculate data range with custom options
    const dataValues = this.data.map(d => d.value);
    const dataMin = Math.min(...dataValues);
    const dataMax = Math.max(...dataValues);
    const rangeMin = this.minValue !== undefined ? this.minValue : dataMin - (dataMax - dataMin) * this.valuePadding;
    const rangeMax = this.maxValue !== undefined ? this.maxValue : dataMax + (dataMax - dataMin) * this.valuePadding;
    const maxY = rangeMax;
    const minY = rangeMin;

    const chartWidth = this.width - 2 * this.padding;
    const chartHeight = this.height - 2 * this.padding;

    let svg = SVGFactory.createSVG(this.width, this.height);

    // Fully customizable styling
    svg += `<style>
      .chart-container {
        font-family: ${this.fontFamily};
        font-size: ${this.fontSize}px;
        color: ${this.textColor};
      }
      .grid-line {
        stroke: ${this.gridColor};
        stroke-width: ${this.axisLineWidth};
        stroke-dasharray: ${this.gridDashArray};
        opacity: ${this.gridOpacity};
      }
      .axis-text {
        fill: ${this.axisColor};
        font-size: ${this.axisLabelFontSize}px;
        font-weight: 500;
      }
      .x-axis-text {
        fill: ${this.axisColor};
        font-size: ${this.axisLabelFontSize}px;
        font-weight: 500;
        text-anchor: middle;
      }
      .chart-line {
        fill: none;
        stroke: ${this.lineColor};
        stroke-width: ${this.strokeWidth};
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: ${this.lineOpacity};
        ${this.lineDashArray ? `stroke-dasharray: ${this.lineDashArray};` : ''}
      }
      .data-point {
        fill: ${this.pointColor || this.lineColor};
        stroke: ${this.pointStrokeColor || this.axisColor};
        stroke-width: ${this.pointStrokeWidth};
        fill-opacity: ${this.pointOpacity};
        stroke-opacity: ${this.pointOpacity};
        transition: all ${this.animationDuration}ms ${this.animationEasing};
      }
      .data-point:hover {
        r: ${this.pointRadius * 1.2};
        fill-opacity: ${this.pointOpacity * 1.2};
      }
      .crosshair-line {
        stroke: ${this.crosshairColor};
        stroke-width: 1;
        opacity: 0;
        pointer-events: none;
        transition: opacity ${this.animationDuration}ms ${this.animationEasing};
      }
      .chart-area:hover .crosshair-line {
        ${this.showCrosshair ? 'opacity: 0.8;' : ''}
      }
      .crosshair-tooltip {
        opacity: 0;
        transition: opacity ${this.animationDuration}ms ${this.animationEasing};
        pointer-events: none;
      }
      .chart-area:hover .crosshair-tooltip {
        ${this.showTooltips ? 'opacity: 1;' : ''}
      }
    </style>`;

    // Background (conditional and customizable)
    if (this.showBackground) {
      svg += `<rect width="${this.width}" height="${this.height}" fill="${this.backgroundColor}" rx="8" />`;
    }

    svg += SVGFactory.createGroup({
      class: 'chart-area',
      onmousemove: this.showCrosshair || this.showTooltips ? `event.preventDefault(); const rect = this.getBoundingClientRect(); const x = event.clientX - rect.left; const line = this.querySelector('.crosshair-line'); const tooltip = this.querySelector('.crosshair-tooltip'); if (line && x >= ${this.padding} && x <= ${this.width - this.padding}) { line.setAttribute('x1', x); line.setAttribute('x2', x); if (tooltip) { tooltip.setAttribute('transform', 'translate(' + (x + 10) + ', ' + (event.clientY - rect.top - 30) + ')'); } }` : '',
      onmouseout: this.showCrosshair || this.showTooltips ? `const line = this.querySelector('.crosshair-line'); const tooltip = this.querySelector('.crosshair-tooltip'); if (line) { line.setAttribute('x1', '0'); line.setAttribute('x2', '0'); } if (tooltip) { tooltip.setAttribute('transform', 'translate(0,0)'); }` : ''
    });

    // Add grid lines and Y-axis labels (conditional)
    if (this.showGrid || this.showYAxis) {
      const gridSpacing = chartHeight / this.gridLines;
      const valueRange = maxY - minY;
      const valueSpacing = valueRange / this.gridLines;

      for (let i = 0; i <= this.gridLines; i++) {
        const y = this.padding + (i * gridSpacing);
        const value = Math.round(maxY - (i * (maxY - minY) / this.gridLines));

        // Y-axis label (conditional)
        if (this.showYAxis && i > 0) {
          const labelText = this.yAxisLabelFormat ? this.yAxisLabelFormat(value) : value.toString();
          svg += `<line class="grid-line" x1="${this.padding}" y1="${y}" x2="${this.width - this.padding}" y2="${y}" />`;
          svg += `<text class="axis-text" x="${this.padding - 10}" y="${y + 4}" text-anchor="end">${labelText}</text>`;
        }
      }
    }

    // Add crosshair line (conditional)
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

    // Create smooth curved path (conditional)
    let pathData;
    if (points.length > 1) {
      pathData = this.smooth ? this.createCatmullRomPath(points) : `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    } else {
      pathData = `M ${points[0].x},${points[0].y}`;
    }

    // Add the main line
    svg += `<path d="${pathData}" class="chart-line" />`;

    // Add data points (conditional)
    if (this.showPoints) {
      points.forEach(point => {
        svg += `<circle class="data-point" cx="${point.x}" cy="${point.y}" r="${this.pointRadius}" />`;
      });
    }

    // Add X-axis labels (conditional)
    if (this.showXAxis && this.showLabels) {
      points.forEach((point, index) => {
        const labelText = this.xAxisLabels[index] ||
                         (this.dateFormat ? this.dateFormat(point.date) : point.date) ||
                         `Point ${index + 1}`;
        const formattedLabel = this.xAxisLabelFormat ? this.xAxisLabelFormat(labelText) : labelText;
        svg += `<text class="x-axis-text" x="${point.x}" y="${this.height - this.padding + 20}">${formattedLabel}</text>`;
      });
    }

    // Add crosshair tooltip (conditional)
    if (this.showTooltips) {
      // Default tooltip content
      let tooltipValue = '328.00 USD';
      let tooltipDate = 'Mar 26';

      // Use custom formatting if provided
      if (this.tooltipValueFormat) {
        tooltipValue = this.tooltipValueFormat(328.00); // Example value
      }
      if (this.tooltipDateFormat) {
        tooltipDate = this.tooltipDateFormat(new Date()); // Example date
      }

      svg += `<g class="crosshair-tooltip">
        <rect x="0" y="0" width="120" height="40" rx="8" fill="${this.tooltipBackgroundColor}" stroke="${this.tooltipBorderColor}" stroke-width="1" />
        <text x="10" y="18" fill="${this.tooltipTextColor}" font-size="${this.tooltipFontSize + 2}" font-weight="600" class="tooltip-value">${tooltipValue}</text>
        <text x="10" y="32" fill="${this.tooltipTextColor}" font-size="${this.tooltipFontSize - 1}" class="tooltip-date">${tooltipDate}</text>
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

module.exports = LineChart;
