// Add the table below the slider
const languageData = [
    { category: "Java", color: "red" },
    { category: "PHP", color: "#FF6F33" },
    { category: "C/C++", color: "green" },
    { category: "JavaScript", color: "#FFD700" },
    { category: "Visual Basic", color: "#A1FF33" },
    { category: "Perl", color: "#FFC1C1" },
    { category: "C#", color: "#3357FF" },
    { category: "Delphi/Pascal", color: "#33FFF6" },
    { category: "Python", color: "blue" },
    { category: "Matlab", color: "#B533FF" },
    { category: "VBA", color: "#FFC333" },
    { category: "Cobol", color: "#FFC300" },
    { category: "R", color: "#3399FF" },
    { category: "Ada", color: "#33FF57" },
    { category: "Abap", color: "#FF5733" },
    { category: "Ruby", color: "#FF3333" },
    { category: "Rust", color: "#FF5733" },
    { category: "Kotlin", color: "#33FF99" },
    { category: "Haskell", color: "#33A1FF" },
    { category: "Objective-C", color: "#33FFDD" },
    { category: "Scala", color: "#33FFB5" },
    { category: "Powershell", color: "#8C33FF" },
    { category: "Lua", color: "#FF3380" },
    { category: "Groovy", color: "#A133FF" },
    { category: "TypeScript", color: "#33FF80" },
    { category: "Swift", color: "#FF33F6" },
    { category: "Julia", color: "#FF33B5" },
    { category: "Go", color: "#FF8C33" },
    { category: "Dart", color: "#FF33A1" }
  ];

// Reshape data for 4x8 layout
const rowsData = [];
while (languageData.length) {
    rowsData.push(languageData.splice(0, 4));
}

// Create the table and append it to the container
const table = d3.select("#table-container")
    .append("table")
    .style("border-collapse", "collapse")
    .style("margin", "20px auto")
    .style("width", "60%")


const tbody = table.append("tbody");

// Add rows
const rows = tbody.selectAll("tr")
    .data(rowsData)
    .enter()
    .append("tr");

// Add cells
const cells = rows.selectAll("td")
    .data(d => d) // Bind the language data
    .enter()
    .append("td")
    .style("border", "1px solid black")
    .style("padding", "12px")
    .style("background-color", "#f9f9f9")
    .style("text-align", "center")
    .style("vertical-align", "middle")
    .style("font-size", "18px")
    .style("color", d => d.color)
    .style("user-select", "none")
    .text(d => d.category);



// // Track currently highlighted cell
// let highlightedLanguages = [];

// // Mousedown: Highlight the cell in #e6e6fa
// cells.on("mousedown", function(event, d) {
//     const language = d.category;

//     // Toggle highlight for the clicked cell
//     const isHighlighted = d3.select(this).classed("highlighted");

//     if (isHighlighted) {
//         // Remove highlight
//         d3.select(this).classed("highlighted", false).style("background-color", "#f9f9f9");
//         highlightedLanguages = highlightedLanguages.filter(lang => lang !== language);
//     } else {
//         // Add highlight
//         d3.select(this).classed("highlighted", true).style("background-color", "#e6e6fa");
//         highlightedLanguages.push(language);
//     }

//     // Dispatch the event with the list of highlighted languages
//     const highlightEvent = new CustomEvent("highlightLanguages", { detail: highlightedLanguages });
//     console.log("Highlight Event:", highlightEvent); // Debugging
//     window.dispatchEvent(highlightEvent);
// });

// // Mouseover: Highlight with dark gray unless the cell is already highlighted
// cells.on("mouseover", function() {
//     if (!d3.select(this).classed("highlighted")) {
//         d3.select(this).style("background-color", "#A9A9A9"); // Dark Gray
//     }
// })
// .on("mouseout", function() {
//     if (!d3.select(this).classed("highlighted")) {
//         d3.select(this).style("background-color", "#f9f9f9"); // Reset to original
//     }
// });

// // Clear highlights when clicking outside the table
// d3.select("body").on("click", function() {
//     const container = document.getElementById("table-container");
//     const target = d3.event.target; // Use d3.event for compatibility with D3 v4

//     if (!container.contains(target)) {
//         // Reset all cells to default background
//         cells.style("background-color", "#f9f9f9");

//         // Dispatch a custom event to reset the bar chart
//         const clearEvent = new CustomEvent("clearHighlight");
//         window.dispatchEvent(clearEvent);
//     }
// });

// Listen to brushHighlight event from the bar chart
window.addEventListener("brushHighlight", function(event) {
    const brushedLanguages = event.detail;
    d3.selectAll("td")
        .style("background-color", function(d) {
            return brushedLanguages.includes(d.category) ? "#e6e6fa" : "#f9f9f9"; // Match highlights
        });
});

// Handle clear highlight event
window.addEventListener("clearHighlight", function() {
    d3.selectAll("td").style("background-color", "#f9f9f9"); // Reset all cells
});
