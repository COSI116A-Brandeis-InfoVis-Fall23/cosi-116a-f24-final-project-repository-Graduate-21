// Set dimensions and margins for the bar chart
const barWidth = 500;
const barHeight = 300;
const barMargin = { top: 20, right: 30, bottom: 40, left: 50 };

// Create an SVG container for the bar chart with defined dimensions
const barSvg = d3.select("#mapbar-svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`); // Adjust for margins

// Define scales for X and Y axes
const xScalee = d3.scaleBand().range([0, barWidth]).padding(0.1); // X-axis is categorical, uses scaleBand
const yScalee = d3.scaleLinear().range([barHeight, 0]); // Y-axis is numerical, uses scaleLinear

// Define X and Y axes based on the scales
const xAxiss = d3.axisBottom(xScalee);
const yAxiss = d3.axisLeft(yScalee);

// Append empty X and Y axes to the SVG
barSvg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${barHeight})`); // Position the X-axis at the bottom of the chart
barSvg.append("g")
    .attr("class", "y-axis"); // Position Y-axis by default

// Add a label for the selected region name above the bar chart
const regionNameLabel = barSvg.append("text")
    .attr("class", "region-name-label")
    .attr("x", barWidth / 2) // Center the text horizontally
    .attr("y", -10) // Position slightly above the top edge
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text(""); // Initial text is empty

// Function to update the bar chart based on the selected region's data
function updateBarChart(regionData) {
    // Update the region name label
    regionNameLabel.text(regionData.Region);

    // Extract keys and values from the region data, ignoring the "Region" key
    const keys = Object.keys(regionData).filter(key => key !== "Region");
    const values = keys.map(key => ({
        language: key,
        percentage: +regionData[key] // Convert to a number
    }));

    // Update the domain of the scales based on the data
    xScalee.domain(keys);
    yScalee.domain([0, d3.max(values, d => d.percentage)]);

    // Bind new data to the bars and update the bar chart
    const bars = barSvg.selectAll(".bar").data(values);

    // Enter new bars, update existing bars, and remove old bars
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars) // Update existing bars
        .on("mouseover", function(event, d) {

            bars.attr("fill", "#69b3a2"); 
            d3.select(this).attr("fill", "goldenrod"); 
            updateMapForLanguage(d);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", "#69b3a2");
            updateMapToDefault();
        })
        .transition()
        .duration(500) // Animation duration
        .attr("x", d => xScalee(d.language)) // X position based on language
        .attr("y", d => yScalee(d.percentage)) // Y position based on percentage
        .attr("width", xScalee.bandwidth()) // Width of each bar
        .attr("height", d => barHeight - yScalee(d.percentage)) // Height calculated based on Y scale
        .attr("fill", "#69b3a2"); // Bar fill color

    bars.exit().remove(); // Remove bars that no longer have data

    // Update the X and Y axes with transitions
    barSvg.select(".x-axis").transition().duration(500).call(xAxiss);
    barSvg.select(".y-axis").transition().duration(500).call(yAxiss);
}



