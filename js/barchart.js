// append the svg object to the body of the page
const svg = d3.select("#bar-svg");

// set the dimensions and margins of the graph
var margin = {top: 50, right: 1, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Data for the bar chart
//d3.csv("dataTest.csv")
const data = [
  { "category": "Abap", "value": 0.34, "color": "#FF5733" },
  { "category": "Ada", "value": 0.36, "color": "#33FF57" },
  { "category": "C/C++", "value": 10.01, "color": "green" },
  { "category": "C#", "value": 4.68, "color": "#3357FF" },
  { "category": "Cobol", "value": 0.42, "color": "#FFC300" },
  { "category": "Dart", "value": 0.0, "color": "#FF33A1" },
  { "category": "Delphi/Pascal", "value": 2.8, "color": "#33FFF6" },
  { "category": "Go", "value": 0.0, "color": "#FF8C33" },
  { "category": "Groovy", "value": 0.03, "color": "#A133FF" },
  { "category": "Haskell", "value": 0.22, "color": "#33A1FF" },
  { "category": "Java", "value": 30.16, "color": "red" },
  { "category": "JavaScript", "value": 8.59, "color": "#FFD700" },
  { "category": "Julia", "value": 0.0, "color": "#FF33B5" },
  { "category": "Kotlin", "value": 0.24, "color": "#33FF99" },
  { "category": "Lua", "value": 0.16, "color": "#FF3380" },
  { "category": "Matlab", "value": 2.1, "color": "#B533FF" },
  { "category": "Objective-C", "value": 0.19, "color": "#33FFDD" },
  { "category": "Perl", "value": 7.33, "color": "#FFC1C1" },
  { "category": "PHP", "value": 18.62, "color": "#FF6F33" },
  { "category": "Powershell", "value": 0.16, "color": "#8C33FF" },
  { "category": "Python", "value": 2.51, "color": "blue" },
  { "category": "R", "value": 0.39, "color": "#3399FF" },
  { "category": "Ruby", "value": 0.33, "color": "#FF3333" },
  { "category": "Rust", "value": 0.24, "color": "#FF5733" },
  { "category": "Scala", "value": 0.17, "color": "#33FFB5" },
  { "category": "Swift", "value": 0.0, "color": "#FF33F6" },
  { "category": "TypeScript", "value": 0.0, "color": "#33FF80" },
  { "category": "VBA", "value": 1.43, "color": "#FFC333" },
  { "category": "Visual Basic", "value": 8.5, "color": "#A1FF33" }
];

// Sort the data by total
data.sort(function (a, b) {
  return d3.ascending(a.value, b.value);
});

// Set the x and y scales
const xScale = d3
  .scaleBand()
  .domain(data.map(d => d.category))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([height - margin.bottom, margin.top]);

// Create the x and y axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Add the x and y axes to the chart
svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("dx", "-10px")
  .attr("dy", "-5px");

svg
  .append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(yAxis);

 // Create the bars for the chart
svg
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.category))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d.value))
  .attr("fill", d => d.color);

// Add the chart title
svg.append("text")
.attr("x", margin.left + 200)
.attr("y", margin.top - 30)
.style("font-size", "14px")
.style("font-weight", "bold")
.style("font-family", "sans-serif")
.text("Popularity of Programming Languages");

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
