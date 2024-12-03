//Scatterplot.js
function scatterplot() {
    let margin = {
        top: 60,
        left: 80,
        right: 150,
        bottom: 20
      },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom,
      xValue = d => d[0],
      yValue = d => d[1],
      xLabelText = "",
      yLabelText = "",
      yLabelOffsetPx = 0,
      xScale = d3.scaleLog(),
      yScale = d3.scaleLog(),
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;
  
    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
      let svg = d3.select(selector)
        .append("svg")
          .attr("preserveAspectRatio", "xMidYMid meet")
          .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
          .classed("svg-content", true);
  
      svg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      //Define scales
      xScale
        .domain([
          d3.min(data, d => xValue(d)*0.9),
          d3.max(data, d => xValue(d)*1.1)
        ])
        .rangeRound([0, width]);
  
      yScale
        .domain([
          d3.min(data, d => yValue(d)*0.9),
          d3.max(data, d => yValue(d)*1.1)
        ])
        .rangeRound([height, 0]);
  
      let xAxis = svg.append("g")
          .attr("transform", "translate(0," + (height) + ")")
          .call(d3.axisBottom(xScale));
          
      // X axis label
      xAxis.append("text")        
          .attr("class", "axisLabel")
          .attr("transform", "translate(" + (width - 50) + ",-10)")
          .text(xLabelText);
        
      let yAxis = svg.append("g")
          .call(d3.axisLeft(yScale))
        .append("text")
          .attr("class", "axisLabel")
          .attr("transform", "translate(" + yLabelOffsetPx + ", -12)")
          .text(yLabelText);
  
      // Define a color scale for programming languages
      const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.source.trim())) // Extract unique programming languages
        .range(d3.schemeCategory10); // Use D3's built-in color scheme

      // Create a Legend base on the color scale
      const legend = svg.append("g")
        .attr("transform", `translate(${width + margin.right - 100}, ${margin.top-50})`);
  
      const languages = [...new Set(data.map(d => d.source.trim()))]; // Extract unique programming languages
  
      languages.forEach((lang, i) => {
          // Create circle as legends
        legend.append("circle")
          .attr("cx", 0) 
          .attr("cy", i * 10)
          .attr("r", 3) 
          .style("fill", colorScale(lang)) 
          .style("stroke", "black") 
          .style("stroke-width", 0.5);
        
          // align the legend with text
        legend.append("text")
          .attr("x", 15) 
          .attr("y", i * 10 ) 
          .text(lang) // Programming Language
          
          .style("font-size", "6px") 
          .style("fill", "black")
          .style("alignment-baseline", "middle"); 
          
        });
  
      // Add the points
      let points = svg.append("g")
        .selectAll(".scatterPoint")
          .data(data);
  
      points.exit().remove();
  
      points = points.enter()
        .append("circle")
          .attr("class", "point scatterPoint")
        .merge(points)
          .attr("cx", X)
          .attr("cy", Y)
          .attr("r",  d => Math.max(2, Math.min(10, d.Average_cpu_load / 5))) // Scale average_cpu_load for better visualization
          .style("fill", d => colorScale(d.source.trim())) // Fill color based on programming language
          .style("stroke", "black") 
          .style("stroke-width", 0.5);
          
      
      selectableElements = points;
      
      svg.call(brush);
  
      // Highlight points when brushed
      function brush(g) {
        const brush = d3.brush() // Create a 2D interactive brush
          .on("start brush", highlight) // When the brush starts/continues do...
          .on("end", brushEnd) // When the brush ends do...
          .extent([
            [-margin.left, -margin.bottom],
            [width + margin.right, height + margin.top]
          ]);
          
        ourBrush = brush;
  
        g.call(brush); // Adds the brush to this element
  
        // Highlight the selected circles
        function highlight() {
          if (d3.event.selection === null) return;
          const [
            [x0, y0],
            [x1, y1]
          ] = d3.event.selection;
  
          // If within the bounds of the brush, select it
          points.classed("selected", d =>
            x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
          );
  
          // Get the name of our dispatcher's event
          let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
  
          // Let other charts know about our selection
          dispatcher.call(dispatchString, this, svg.selectAll(".selected").data());
        }
        
        function brushEnd(){
          // We don't want infinite recursion
          if(d3.event.sourceEvent.type!="end"){
            d3.select(this).call(brush.move, null);
          }         
        }
      }
  
      return chart;
    }
  
    // The x-accessor from the datum
    function X(d) {
      return xScale(xValue(d));
    }
  
    // The y-accessor from the datum
    function Y(d) {
      return yScale(yValue(d));
    }
  
    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };
  
    chart.width = function (_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
  
    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
  
    chart.x = function (_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };
  
    chart.y = function (_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };
  
    chart.xLabel = function (_) {
      if (!arguments.length) return xLabelText;
      xLabelText = _;
      return chart;
    };
  
    chart.yLabel = function (_) {
      if (!arguments.length) return yLabelText;
      yLabelText = _;
      return chart;
    };
  
    chart.yLabelOffset = function (_) {
      if (!arguments.length) return yLabelOffsetPx;
      yLabelOffsetPx = _;
      return chart;
    };
  
    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
      if (!arguments.length) return;
  
      // Select an element if its datum was selected
      selectableElements.classed("selected", d => {
        return selectedData.includes(d)
      });
  
    };
  
    return chart;
  }