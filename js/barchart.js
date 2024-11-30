// Select the SVG element
const svg = d3.select("#bar-svg");

// Set dimensions and margins for the chart
var margin = {top: 50, right: 1, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Load the CSV data
d3.csv("data/dataTest.csv", function(error, data) {
  if (error) {
    console.error("Error loading data:", error);
    return;
  }

  // Convert values to numbers
  data.forEach(function(d) {
    d.value = +d.value; // Convert value to a number
  });

  // Sort the data by value
  data.sort(function(a, b) {
    return d3.ascending(a.value, b.value);
  });

  // Define scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height - margin.bottom, margin.top]);

  // Create axes
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("dx", "-10px")
    .attr("dy", "-5px");

  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // Add bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.category))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.value))
    .attr("fill", d => d.color);

  // Add chart title
  svg.append("text")
    .attr("x", margin.left + 200)
    .attr("y", margin.top - 30)
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Popularity of Programming Languages");
});

// Add the sub-title
svg
  .append("text")
  .attr("class", "x-axis-title")
  .attr("x", margin.left + 735)
  .attr("y", margin.top + 305)
  .attr("text-anchor", "middle")
  .style("font-size", "5px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Programming Languages");

svg
  .append("text")
  .attr("class", "y-axis-title")
  .attr("x", margin.left)
  .attr("y", margin.top - 15)
  //.attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .style("font-size", "5px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Popularity (in Search)");


/*Acknowledgements:
https://d3-graph-gallery.com/graph/barplot_ordered.html
https://www.youtube.com/watch?v=sTOHoueLVJE
https://github.com/datavizdad/d3barchartseries/blob/main/script.js
https://www.youtube.com/watch?v=BDpBAFvdjYo
https://observablehq.com/@d3/bar-chart/2
https://github.com/COSI116A-Brandeis-InfoVis-Fall23/hw-4-brushing-and-linking-yuanshuo-wu/blob/main/js/scatterplot.js
ChatGPT
*/
