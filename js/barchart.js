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




// // Date range for the slider
// const dateRange = [
//   "Jul-04", "Aug-04", "Sep-04", "Oct-04", "Nov-04", "Dec-04",
//   "Jan-05", "Feb-05", "Mar-05", "Apr-05", "May-05", "Jun-05",
//   "Jul-05", "Aug-05", "Sep-05", "Oct-05", "Nov-05", "Dec-05",
// ];

// Generate the full date range for the slider
const dateRange = [];
const startDate = new Date(2004, 6);
const endDate = new Date(2024, 5);
let currentDate = startDate;

while (currentDate <= endDate) {
  const month = currentDate.toLocaleString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();
  dateRange.push({ month, year, fullDate: `${month}-${year.toString().slice(-2)}` });
  currentDate.setMonth(currentDate.getMonth() + 1);
}

// Slider setup
const sliderScale = d3.scaleLinear()
  .domain([0, dateRange.length - 1]) // Scale for all months
  .range([margin.left, width - margin.right]);

// Add the slider axis with years as major ticks
const sliderGroup = svg.append("g")
  .attr("transform", `translate(30, ${height + 50})`);

const sliderAxis = d3.axisBottom(sliderScale)
  .tickValues(
    dateRange
      .map((_, i) => i)
      .filter(i => dateRange[i].month === "Jan") // Major ticks for years (January of each year)
  )
  .tickFormat(i => dateRange[i].year); // Display only the year for major ticks

sliderGroup.call(sliderAxis)
  .selectAll("text")
  .style("text-anchor", "middle")
  .style("font-size", "12px");

// Add a draggable rectangle as the handle
const handleWidth = 5;
const handleHeight = 20;

const handle = sliderGroup.append("rect")
  .attr("x", sliderScale(0) - handleWidth / 2) // Center on the first month
  .attr("y", -handleHeight / 2)
  .attr("width", handleWidth)
  .attr("height", handleHeight)
  .attr("fill", "steelblue")
  .call(
    d3.drag()
      .on("drag", function () {
        const mouseX = d3.event.x; // Get the current mouse position
        const closestIndex = Math.round(sliderScale.invert(mouseX)); // Snap to the closest month index
        const validIndex = Math.max(0, Math.min(closestIndex, dateRange.length - 1));
        const closestMonth = dateRange[validIndex];

        // Update the handle position
        d3.select(this).attr("x", sliderScale(validIndex) - handleWidth / 2);

        // Update the time text and currentIndex
        timeText.text(closestMonth.fullDate);
        currentIndex = validIndex; // Update currentIndex to reflect manual movement

        console.log("Selected Date:", closestMonth.fullDate);
      })
  );

// Add a text element to show the current time below the slider
const timeText = svg.append("text")
  .attr("id", "time-scale-text")
  .attr("x", width / 2)
  .attr("y", height + 90)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text(dateRange[0].fullDate); // Set initial text to the first date


// Add the play button
const playButton = svg.append("rect")
  .attr("id", "play-button")
  .attr("x", margin.left - 40)
  .attr("y", height + 40)
  .attr("width", 40)
  .attr("height", 30)
  .attr("fill", "lightgray")
  .attr("rx", 5)
  .attr("cursor", "pointer");

const playButtonText = svg.append("text")
  .attr("id", "play-text")
  .attr("x", margin.left - 20)
  .attr("y", height + 60)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .attr("pointer-events", "none")
  .text("Play");


let isPlaying = false;
let currentIndex = 0;
let animationInterval = null;

// Play animation logic
function playAnimation() {
  animationInterval = setInterval(() => {
    if (currentIndex >= dateRange.length) {
      clearInterval(animationInterval); // Stop animation at the end
      isPlaying = false;
      playButtonText.text("Play");
      return;
    }

    // Update handle position and time text
    handle.attr("x", sliderScale(currentIndex) - handleWidth / 2);
    timeText.text(dateRange[currentIndex].fullDate);
    currentIndex++;
  }, 200); // Adjust speed
}

// Pause animation logic
function pauseAnimation() {
  clearInterval(animationInterval);
  animationInterval = null;
}

// Add click event for play/pause toggle
playButton.on("click", () => {
  if (isPlaying) {
    // Pause the animation
    isPlaying = false;
    pauseAnimation();
    playButtonText.text("Play");
  } else {
    // Start or resume the animation
    isPlaying = true;
    playButtonText.text("Pause");
    if (currentIndex >= dateRange.length) currentIndex = 0; // Reset if at the end
    playAnimation();
  }
});



/*Acknowledgements:
https://d3-graph-gallery.com/graph/barplot_ordered.html
https://www.youtube.com/watch?v=sTOHoueLVJE
https://github.com/datavizdad/d3barchartseries/blob/main/script.js
https://www.youtube.com/watch?v=BDpBAFvdjYo
https://observablehq.com/@d3/bar-chart/2
https://github.com/COSI116A-Brandeis-InfoVis-Fall23/hw-4-brushing-and-linking-yuanshuo-wu/blob/main/js/scatterplot.js
https://observablehq.com/@mbostock/hello-d3-simple-slider
https://github.com/johnwalley/d3-simple-slider
https://gist.github.com/johnwalley/e1d256b81e51da68f7feb632a53c3518
https://www.youtube.com/watch?v=Fb-7Flq7lwU
ChatGPT
*/
