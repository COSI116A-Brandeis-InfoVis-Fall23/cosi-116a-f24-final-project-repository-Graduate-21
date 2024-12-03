// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  console.log("Hello, world!");
  d3.json("data/Scatterplot_data.json", (data) => {
    data.forEach(d => {
      d.secs = +d.secs;
      d.mem = +d.mem;    
      d.Average_cpu_load = parseFloat(d.Average_cpu_load.replace("%", ""));
    })
    const dispatchString = "selectionUpdated";

    let spRuntimeMemory = scatterplot()
      .x(d => d.secs) // X-axis: runtime in seconds
      .xLabel("Runtime (secs)")
      .y(d => d.mem) // Y-axis: memory usage
      .yLabel("Memory Usage (MB)")
      .yLabelOffset(50)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);
    
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);
    
    spRuntimeMemory.selectionDispatcher().on(dispatchString, function(selectedData) {
        tableData.updateSelection(selectedData);
      });
    tableData.selectionDispatcher().on(dispatchString, function(selectedData) {
        spRuntimeMemory.updateSelection(selectedData); 
      });
    });


})());