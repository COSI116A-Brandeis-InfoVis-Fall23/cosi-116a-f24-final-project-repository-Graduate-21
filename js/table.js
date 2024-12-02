// Add the table below the slider
const languageData = [
    { language: "Abap", color: "#FF5733" },
    { language: "Ada", color: "#33FF57" },
    { language: "C/C++", color: "green" },
    { language: "C#", color: "#3357FF" },
    { language: "Cobol", color: "#FFC300" },
    { language: "Dart", color: "#FF33A1" },
    { language: "Delphi/Pascal", color: "#33FFF6" },
    { language: "Go", color: "#FF8C33" },
    { language: "Groovy", color: "#A133FF" },
    { language: "Haskell", color: "#33A1FF" },
    { language: "Java", color: "red" },
    { language: "JavaScript", color: "#FFD700" },
    { language: "Julia", color: "#FF33B5" },
    { language: "Kotlin", color: "#33FF99" },
    { language: "Lua", color: "#FF3380" },
    { language: "Matlab", color: "#B533FF" },
    { language: "Objective-C", color: "#33FFDD" },
    { language: "Perl", color: "#FFC1C1" },
    { language: "PHP", color: "#FF6F33" },
    { language: "Powershell", color: "#8C33FF" },
    { language: "Python", color: "blue" },
    { language: "R", color: "#3399FF" },
    { language: "Ruby", color: "#FF3333" },
    { language: "Rust", color: "#FF5733" },
    { language: "Scala", color: "#33FFB5" },
    { language: "Swift", color: "#FF33F6" },
    { language: "TypeScript", color: "#33FF80" },
    { language: "VBA", color: "#FFC333" },
    { language: "Visual Basic", color: "#A1FF33" }
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
    .style("width", "80%"); 

const tbody = table.append("tbody");

// Add rows
const rows = tbody.selectAll("tr")
    .data(rowsData)
    .enter()
    .append("tr");

// Add cells
rows.selectAll("td")
    .data(d => d)
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
    .text(d => d.language);
