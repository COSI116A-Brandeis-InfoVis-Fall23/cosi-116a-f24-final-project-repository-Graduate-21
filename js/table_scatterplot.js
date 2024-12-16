function table_scatterplot() {

    let 
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;
  
    function chart(selector, data) {
      const container = d3.select(selector);
      if (container.empty()) {
          throw new Error(`Selector ${selector} does not match any element in DOM.`);
      }
  
      //add filter button
      const buttonContainer = container.append("div").classed("button-container", true);
  
      buttonContainer.append("button")
          .text("Sort by Language")
          .on("click", () => {
              data.sort((a, b) => d3.ascending(a.source.trim(), b.source.trim()));
              updateTable();
          });
  
      buttonContainer.append("button")
          .text("Sort by Type")
          .on("click", () => {
              data.sort((a, b) => d3.ascending(a.Type.trim(), b.Type.trim()));
              updateTable();
          });
  
      // show the title of table
      let table = container.append("table").classed("my-table", true);
      let tableHeaders = Object.keys(data[0]);
      let tbody;
  
      
      let thead = table.append('thead');
      let headerRow = thead.append('tr');
      headerRow.selectAll('th')
          .data(tableHeaders)
          .enter()
          .append('th')
          .text(d => d);
  
      
      tbody = table.append("tbody");
  
      
      updateTable();
  
        // update table
        function updateTable() {
          
          let rows = tbody.selectAll("tr")
              .data(data, d => d); 
  
          
          let rowsEnter = rows.enter()
              .append("tr");
  
          
          rowsEnter.selectAll("td")
              .data(row => tableHeaders.map(column => row[column]))
              .enter()
              .append("td")
              .text(d => d);
  
          
          rows.merge(rowsEnter)
              .selectAll("td")
              .data(row => tableHeaders.map(column => row[column]))
              .text(d => d);
  
          
          rows.exit().remove();
  
          tbody.selectAll("tr")
          .on("mousedown", function(event, d) {
              isMouseDown = true;
  
              
              tbody.selectAll("tr").classed("selected", false);
  
              
              d3.select(this).classed("selected", true);
          })
          .on("mouseover", function(event, d) {
              if (isMouseDown) {
                  d3.select(this).classed("selected", true);
              }
          })
          .on("mouseup", function() {
              isMouseDown = false;
  
              
              let selectedData = tbody.selectAll("tr.selected").data();
              let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
              dispatcher.call(dispatchString, this, selectedData);
          });
        }
  
      let isMouseDown = false;
  
      tbody.selectAll("tr")
          .on("mousedown", function(event, d) {
              isMouseDown = true;
  
              // Clear previous selection
              tbody.selectAll("tr").classed("selected", false);
  
              // Select the current row
              d3.select(this).classed("selected", true);
              
  
          })
          .on("mouseover", function(event, d) {
              if (isMouseDown) {
                  // Select the row as mouse hovers over it during drag
                  d3.select(this).classed("selected", true);
  
               
              }
          })
          .on("mouseup", function() {
              isMouseDown = false;
              //choose all selected data from the table
              let selectedData = tbody.selectAll("tr.selected").data();
              let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
              dispatcher.call(dispatchString, this, selectedData);
          });
  
     
  
      return chart;
    }
    
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
      d3.selectAll('tbody tr').classed("selected", d => {
        return selectedData.includes(d)
      });
    };
  
    return chart;
  }