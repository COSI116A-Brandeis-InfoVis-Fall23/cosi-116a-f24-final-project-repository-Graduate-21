// Select the SVG element
const svg = d3.select("#bar-svg");

// Set dimensions and margins for the chart
var margin = { top: 20, right: 20, bottom: 100, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Scales
const xScale = d3.scaleBand().padding(0.1);
const yScale = d3.scaleLinear()
.domain([0, 35])
.range([height - margin.bottom, margin.top]);

chartGroup.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${height - margin.bottom})`);
chartGroup.append("g").attr("class", "y-axis").attr("transform", `translate(${margin.left}, 0)`);

// Define the play button
const playButton = svg.append("rect")
    .attr("id", "play-button")
    .attr("x", margin.left - 20)
    .attr("y", height - 50)
    .attr("width", 40)
    .attr("height", 30)
    .attr("fill", "lightgray")
    .attr("rx", 5)
    .attr("cursor", "pointer");

const playButtonText = svg.append("text")
    .attr("id", "play-text")
    .attr("x", margin.left - 0)
    .attr("y", height -30)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .attr("pointer-events", "none")
    .text("Play");

  // Chart title
  svg.append("text")
  .attr("x", margin.left +215)
  .attr("y", margin.top -5)
  .style("font-size", "15px")
  .style("font-weight", "bold")
  .text("Popularity of Programming Languages");

// Sub-title
svg
  .append("text")
  .attr("class", "x-axis-title")
  .attr("x", margin.left + 740)
  .attr("y", margin.top + 285)
  .attr("text-anchor", "middle")
  .style("font-size", "4px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Programming Languages");

svg
  .append("text")
  .attr("class", "y-axis-title")
  .attr("x", margin.left + 45)
  .attr("y", margin.top +5)
  .attr("text-anchor", "middle")
  .style("font-size", "5px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Language Values in % out of 100 %");

  svg
  .append("text")
  .attr("class", "y-axis-title")
  .attr("x", margin.left + 355)
  .attr("y", margin.top +5)
  .attr("text-anchor", "middle")
  .style("font-size", "6px")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("The more a language tutorial is searched, the more popular the language is assumed to be");


  d3.csv("data/programming_language_trends.csv", function (error, data) {
    if (error) {
        console.error("Error loading CSV data:", error);
        return;
    }

    // Parse data
    data.forEach(d => {
        d.value = +d.value;
    });

    // Group data by date
    const groupedData = d3.group(data, d => d.date);

    // Generate the slider domain based on data range
    const startDate = "Jul-04";
    const endDate = "Jul-24";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startYear = parseInt(startDate.split("-")[1]) + 2000;
    const endYear = parseInt(endDate.split("-")[1]) + 2000;

    const sliderDomain = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let month of months) {
            const date = `${month}-${year.toString().slice(-2)}`;
            if (year === startYear && (month === "Jan")) continue;
            sliderDomain.push(date);
            if (date === endDate) break;
        }
    }

    let currentSliderIndex = sliderDomain.indexOf(startDate);

    // Function to update the bar chart for a given slider index
    function updateBarChart(sliderIndex) {

        const key = sliderDomain[sliderIndex];
        const chartData = groupedData.get(key) || [];

        // Sort data by value
        chartData.sort((a, b) => a.value - b.value);

        // Update scales
        xScale.domain(chartData.map(d => d.category)).range([margin.left, width - margin.right]);
        //yScale.domain([0, d3.max(chartData, d => d.value)]).range([height - margin.bottom, margin.top]);

        // Bind data and update bars
        const bars = chartGroup.selectAll(".bar").data(chartData, d => d.category);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.category))
            .attr("y", yScale(0))
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", d => d.color)
            .transition()
            .duration(500)
            .attr("y", d => yScale(d.value))
            .attr("height", d => height - margin.bottom - yScale(d.value))

        bars.transition()
            .duration(500)
            .attr("x", d => xScale(d.category))
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d.value))
            .attr("fill", d => d.color);

        bars.exit()
            .transition()
            .duration(500)
            .attr("height", 0)
            .attr("y", yScale(0))
            .remove();

        // Update axes
        chartGroup.select(".x-axis")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        chartGroup.select(".y-axis").call(d3.axisLeft(yScale));
    }

    updateBarChart(currentSliderIndex);

    // Slider logic
    const sliderGroup = svg.append("g").attr("transform", `translate(40, ${height - 20})`);
    const sliderScale = d3.scaleLinear()
        .domain([0, sliderDomain.length - 1])
        .range([margin.left, width - margin.right]);

    const sliderAxis = d3.axisBottom(sliderScale)
        .tickValues(d3.range(0, sliderDomain.length, 12)) // Show ticks only for years
        .tickFormat(d => sliderDomain[d].split("-")[1]); // Format ticks to show years

    sliderGroup.call(sliderAxis);

    const handle = sliderGroup.append("circle")
        .attr("cx", sliderScale(currentSliderIndex))
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "steelblue")
        .call(
            d3.drag()
                .on("drag", function () {
                    const mouseX = d3.event.x;
                    const newIndex = Math.round(sliderScale.invert(mouseX));
                    const validIndex = Math.max(0, Math.min(newIndex, sliderDomain.length - 1));
                    currentSliderIndex = validIndex;
                    d3.select(this).attr("cx", sliderScale(validIndex));
                    updateBarChart(validIndex);
                })
        );

    let isPlaying = false;
    let animationInterval;

    playButton.on("click", () => {
        if (isPlaying) {
            isPlaying = false;
            clearInterval(animationInterval);
            playButtonText.text("Play");
        } else {
            isPlaying = true;
            playButtonText.text("Pause");
            animationInterval = setInterval(() => {
                if (currentSliderIndex >= sliderDomain.length) {
                    clearInterval(animationInterval);
                    isPlaying = false;
                    playButtonText.text("Play");
                    return;
                }
                handle.attr("cx", sliderScale(currentSliderIndex));
                updateBarChart(currentSliderIndex);
                currentSliderIndex++;
            }, 500);
        }
    });
});

// Click event for play/pause toggle
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

// Create a brush
const brush = d3.brushX()
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
    .on("brush", brushed)
    .on("end", brushed);

// Append the brush overlay to the chart
chartGroup.append("g")
    .attr("class", "brush")
    .call(brush);

// Brushing function
function brushed() {
  const selection = d3.event.selection;
  if (selection) {
      const [x0, x1] = selection;

      // Identify the brushed bars
      const brushedLanguages = [];
      chartGroup.selectAll(".bar")
          .attr("fill", function(d) {
              const xPosition = xScale(d.category) + xScale.bandwidth() / 2;
              const isBrushed = x0 <= xPosition && xPosition <= x1;

              if (isBrushed) {
                  brushedLanguages.push(d.category);
              }

              return isBrushed ? "#e6e6fa" : d.color;
          });

      // Dispatch custom event with brushed languages
      const highlightEvent = new CustomEvent("brushHighlight", { detail: brushedLanguages });
      window.dispatchEvent(highlightEvent);
  } else {
      // Clear all bar highlights if no selection
      chartGroup.selectAll(".bar").attr("fill", d => d.color);

      // Dispatch clear event for table
      const clearEvent = new CustomEvent("clearHighlight");
      window.dispatchEvent(clearEvent);
  }
}

