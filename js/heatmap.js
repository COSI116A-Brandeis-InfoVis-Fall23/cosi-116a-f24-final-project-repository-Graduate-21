// Set the offset for the color bar
const offsetX = 800; // Add 50px padding to the left of the color bar

// Define the width and height of the color bar (longer and thinner)
const colorBarWidth = 400; // Width of the color bar
const colorBarHeight = 8; // Height of the color bar

// Create an SVG container below the map for the color bar
const legendSvg = d3.select("#heat") // Assuming the container ID is "heat"
    .append("svg")
    .attr("width", colorBarWidth + offsetX + 50) // Include space for ticks and labels
    .attr("height", colorBarHeight + 50) // Include space for ticks and labels
    .style("margin-top", "10px");

// Create the gradient
const defs = legendSvg.append("defs");
const gradient = defs.append("linearGradient")
    .attr("id", "color-gradient")
    .attr("x1", "0%") // From left to right
    .attr("x2", "100%") // From left to right
    .attr("y1", "0%") 
    .attr("y2", "0%");

// Create the color scale
const olorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([0, 100]); // Color mapping range

// Draw the gradient color bar
legendSvg.append("rect")
    .attr("x", offsetX) // Offset the color bar to the right by offsetX
    .attr("y", 20) // Adjust the position
    .attr("width", colorBarWidth) // Width of the bar
    .attr("height", colorBarHeight) // Height of the bar (thinner)
    .style("fill", "url(#color-gradient)")
    .style("stroke", "black");

// Define the scale for color bar ticks (range 0-53)
const colorScale = d3.scaleLinear()
    .domain([0, 53]) // Domain for the tick marks
    .range([0, colorBarWidth - 0.5]); // Map values to the color bar width

// Add gradient color stops
for (let i = 0; i <= 100; i += 1) {
    gradient.append("stop")
        .attr("offset", `${i}%`)
        .attr("stop-color", olorScale(i)); // Generate colors using colorScale
}

// Add ticks (using axisBottom)
const axisScale = d3.axisBottom(colorScale)
    .ticks(5); // Number of ticks

legendSvg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${offsetX}, ${20 + colorBarHeight})`) // Offset ticks to match the color bar
    .call(axisScale);





