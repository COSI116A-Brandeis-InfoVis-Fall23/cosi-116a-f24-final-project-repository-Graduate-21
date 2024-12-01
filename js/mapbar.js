const barWidth = 500;
const barHeight = 300;
const barMargin = { top: 20, right: 30, bottom: 40, left: 50 };

const barSvg = d3.select("#mapbar-svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`);

const xScalee = d3.scaleBand().range([0, barWidth]).padding(0.1);
const yScalee = d3.scaleLinear().range([barHeight, 0]);

const xAxiss = d3.axisBottom(xScalee);
const yAxiss = d3.axisLeft(yScalee);

barSvg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${barHeight})`);
barSvg.append("g").attr("class", "y-axis");

const regionNameLabel = barSvg.append("text")
    .attr("class", "region-name-label")
    .attr("x", barWidth / 2) 
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text(""); 

function updateBarChart(regionData) {
    regionNameLabel.text(regionData.Region);

    const keys = Object.keys(regionData).filter(key => key !== "Region");
    const values = keys.map(key => ({
        language: key,
        percentage: +regionData[key]
    }));

    xScalee.domain(keys);
    yScalee.domain([0, d3.max(values, d => d.percentage)]);

    const bars = barSvg.selectAll(".bar").data(values);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", d => xScalee(d.language))
        .attr("y", d => yScalee(d.percentage))
        .attr("width", xScalee.bandwidth())
        .attr("height", d => barHeight - yScalee(d.percentage))
        .attr("fill", "#69b3a2");

    bars.exit().remove();

    barSvg.select(".x-axis").transition().duration(500).call(xAxiss);
    barSvg.select(".y-axis").transition().duration(500).call(yAxiss);
}


