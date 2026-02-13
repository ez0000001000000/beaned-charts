// Beaned-Charts Utilities
// Zero-dependency utility functions for SVG chart generation

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

module.exports = {
  SVGFactory,
  normalizeCoordinate,
  describeArc,
  polarToCartesian,
  getColor
};
