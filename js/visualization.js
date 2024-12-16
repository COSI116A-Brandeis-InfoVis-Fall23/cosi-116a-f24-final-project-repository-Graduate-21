// Immediately Invoked Function Expression to limit access to our
// variables and prevent
((() => {

  //console.log("Hello, world!");
  d3.json("data/Scatterplot_data.json", (data) => {
    data.forEach(d => {
      d.secs = +d.secs;
      d.mem = +d.mem;
      d.Average_cpu_load = parseFloat(d.Average_cpu_load.replace("%", ""));
    })
    const dispatchString = "selectionUpdated";

    let scatterplotChart = scatterplot()
      .x(d => d.secs) // X-axis: runtime in seconds
      .xLabel("Runtime (secs)")
      .y(d => d.mem) // Y-axis: memory usage
      .yLabel("Memory Usage (MB)")
      .yLabelOffset(50)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);

    let tableChart = table_scatterplot()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table-scatterplot-container", data);

    scatterplotChart.selectionDispatcher().on(dispatchString, function(selectedData) {
        tableChart.updateSelection(selectedData);
        if (selectedData.length === 0) {
          tableChart.updateSelection([]);
          scatterplotChart.updateSelection([]);
      }
    });

    tableChart.selectionDispatcher().on(dispatchString, function(selectedData) {
        scatterplotChart.updateSelection(selectedData);
        if (selectedData.length === 0) {
          scatterplotChart.updateSelection([]);
          tableChart.updateSelection([]);
      }
    });
    });


})());
