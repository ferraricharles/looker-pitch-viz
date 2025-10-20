looker.plugins.visualizations.add({
  // --- Visualization Configuration Options ---
  options: {
    pitchColor: {
      type: 'string',
      label: 'Pitch Color',
      display: 'color',
      default: '#2A54A6' // Blue pitch background
    },
    lineColor: {
      type: 'string',
      label: 'Line Color',
      display: 'color',
      default: '#FFFFFF'
    },
    dotSize: {
      type: 'number',
      label: 'Dot Size',
      default: 2, // Slightly larger for better visibility
      order: 10
    }
  },

  // --- Initial Setup ---
  create: function(element, config) {
    element.innerHTML = `<style>.pitch-viz-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }</style>`;
    this.container = element.appendChild(document.createElement("div"));
    this.container.className = "pitch-viz-container";
    this.svg = this.container.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  },

  // --- Render Function ---
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();

    if (queryResponse.fields.dimensions.length < 2) {
      this.addError({ title: "Not Enough Dimensions", message: "This visualization requires at least two dimensions (X and Y coordinates)." });
      return;
    }

    const xField = queryResponse.fields.dimensions[0].name;
    const yField = queryResponse.fields.dimensions[1].name;
    const categoryField = queryResponse.fields.dimensions[2] ? queryResponse.fields.dimensions[2].name : null;

    this.svg.innerHTML = '';
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.svg.setAttribute("viewBox", `-5 -5 115 78`);

    this._drawPitch(config);

    // --- Plot Data Points ---
    data.forEach(row => {
      const xVal = row[xField].value;
      const yVal = row[yField].value;

      // Defensively convert to numbers
      const x = parseFloat(xVal);
      const y = parseFloat(yVal);

      // Skip row if coordinates are not valid numbers
      if (isNaN(x) || isNaN(y)) {
        return;
      }

      // --- COLOR LOGIC: Replaced the crashing code with this ---
      const category = row[categoryField]?.value;
      let dotFillColor = '#FFFFFF'; // Default to white
      if (category === 'Team A') {
        dotFillColor = '#4285F4'; // A nice, bright blue
      } else if (category === 'Team B') {
        dotFillColor = '#EA4335'; // A contrasting red
      }
      // --- END OF NEW COLOR LOGIC ---

      const dot = this._createSvgElement("circle", {
        cx: x,
        cy: y,
        r: config.dotSize || 2,
        fill: dotFillColor,
        "stroke": "#000000",
        "stroke-width": 0.2
      });
      this.svg.appendChild(dot);
    });

    done();
  },

  // --- Helper to draw the pitch ---
  _drawPitch: function(config) {
    const pitchColor = config.pitchColor;
    const lineColor = config.lineColor;
    const lineWidth = 0.5;

    this.svg.appendChild(this._createSvgElement('rect', { x: 0, y: 0, width: 105, height: 68, fill: pitchColor, stroke: 'none' }));
    this.svg.appendChild(this._createSvgElement('rect', { x: 0, y: 0, width: 105, height: 68, stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('line', { x1: 52.5, y1: 0, x2: 52.5, y2: 68, stroke: lineColor, 'stroke-width': lineWidth }));
    this.svg.appendChild(this._createSvgElement('circle', { cx: 52.5, cy: 34, r: 9.15, stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('circle', { cx: 52.5, cy: 34, r: 0.3, fill: lineColor }));
    this.svg.appendChild(this._createSvgElement('rect', { x: 0, y: 13.85, width: 16.5, height: 40.3, stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('rect', { x: 88.5, y: 13.85, width: 16.5, height: 40.3, stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('rect', { x: 0, y: 24.85, width: 5.5, height: 18.3, stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('rect', { x: 99.5, y: 24.85, width: 5.5, height: 18.3, stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('circle', { cx: 11, cy: 34, r: 0.3, fill: lineColor }));
    this.svg.appendChild(this._createSvgElement('circle', { cx: 94, cy: 34, r: 0.3, fill: lineColor }));
    const arcPath = (cx, side) => {
        const r = 9.15;
        const sweep = side === 'left' ? 1 : 0;
        const x1 = cx + r * Math.cos(Math.PI / 3.5);
        const y1 = 34 + r * Math.sin(Math.PI / 3.5);
        const x2 = cx + r * Math.cos(-Math.PI / 3.5);
        const y2 = 34 + r * Math.sin(-Math.PI / 3.5);
        return `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`;
    };
    this.svg.appendChild(this._createSvgElement('path', { d: arcPath(11, 'right'), stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
    this.svg.appendChild(this._createSvgElement('path', { d: arcPath(94, 'left'), stroke: lineColor, 'stroke-width': lineWidth, fill: 'none' }));
  },

  // --- Helper to create SVG elements ---
  _createSvgElement: function(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    return el;
  }
});
