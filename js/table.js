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


