// Beaned-Charts: Minimalist SVG Chart Library
// Zero-dependency, lightweight, and responsive

// Import chart components
const BarChart = require('./BarChart');
const LineChart = require('./LineChart');
const PieChart = require('./PieChart');

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

// Import utilities
const { getColor, normalizeCoordinate, describeArc, SVGFactory } = require('./utils');

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