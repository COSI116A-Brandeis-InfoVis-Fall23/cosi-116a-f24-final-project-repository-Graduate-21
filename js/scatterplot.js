// scatterplot.js

function loadAndCreateScatterPlot(files) {
    const data = [];

    Promise.all(
        files.map(file =>
            d3.csv(file, d => ({
                memory: +d.mem,
                runtime: +d.secs,
                avgCpuLoad: (+d.cpu_1_load + +d.cpu_2_load + +d.cpu_3_load + +d.cpu_4_load) / 4
            }))
        )
    ).then(results => {
        // Combine all loaded data
        results.forEach(dataset => data.push(...dataset));

        // Visualize the data
        createScatterPlot(data);
    });
}

function createScatterPlot(data) {
    // Set dimensions
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.runtime))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.memory))
        .range([height - margin.bottom, margin.top]);

    const r = d3.scaleLinear()
        .domain(d3.extent(data, d => d.avgCpuLoad))
        .range([5, 20]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0))
        .append("text")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text("Runtime");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(10).tickSizeOuter(0))
        .append("text")
        .attr("x", 6)
        .attr("y", margin.top)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .text("Memory Usage");

    // Circles
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.runtime))
        .attr("cy", d => y(d.memory))
        .attr("r", d => r(d.avgCpuLoad))
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
}   