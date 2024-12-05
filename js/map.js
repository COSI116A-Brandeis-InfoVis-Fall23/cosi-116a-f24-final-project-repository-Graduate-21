let dataByRegion = {};
let selectedRegion = null;

// Define dimensions for the SVG container
const wid = 865;
const hei = 500;

// Select the SVG element and set its dimensions
const svgb = d3.select("#map-svg")
    .attr("width", wid)
    .attr("height", hei);

// Set up the map projection and translation to center it
const projection = d3.geoMercator()
    .scale(150)
    .translate([wid / 2, hei / 1.5]);

// Create a path generator using the defined projection
const path = d3.geoPath().projection(projection);

// Load GeoJSON data for the world map
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(error, geoData) {
    if (error) {
        console.error("Error loading GeoJSON data:", error);
        return;
    }

    // Load CSV data for programming languages popularity by region
    d3.csv("data/programming_languages_popularity_by_region.csv", function(error, data) {
        if (error) {
            console.error("Error loading CSV data:", error);
            return;
        }

        // Convert CSV data into an object indexed by region name
        // const dataByRegion = {};
        data.forEach(d => {
            dataByRegion[d.Region] = d;
        });

        // Variable to store currently selected region
        //let selectedRegion = null;  

        // Draw the map using GeoJSON data
        svgb.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => {
                // Set the color of regions based on data availability
                const regionName = d.properties.name;
                return dataByRegion[regionName] ? "#cce5df" : "#cccccc"; 
            })
            .attr("stroke", "#333") // Add stroke for region boundaries
            .on("mouseover", function(event, d) {
                // Handle mouseover: change color if region has data and is not selected
                const feature = geoData.features[d];
                const regionData = dataByRegion[feature.properties.name];

                if (regionData && selectedRegion !== this) {
                    d3.select(this).attr("fill", "#95cea2");
                }

                // Optional: Tooltip code (commented out)
                // if (regionData) {
                //     d3.select("#tooltip")
                //         .style("opacity", 1)
                //         .style("left", (event.pageX + 10) + "px")
                //         .style("top", (event.pageY - 28) + "px")
                //         .html(`<strong>${feature.properties.name}</strong>`);
                // }
            })
            .on("mouseout", function(event, d) {
                // Handle mouseout: reset color if region is not selected
                const feature = geoData.features[d];
                const regionData = dataByRegion[feature.properties.name];
                if (regionData && selectedRegion !== this) {
                    d3.select(this).attr("fill", "#cce5df");
                }
                d3.select("#tooltip").style("opacity", 0);
            })
            .on("click", function(event, d) {
                // Handle click: update selected region and change color
                const feature = geoData.features[d];
                const regionData = dataByRegion[feature.properties.name];
                if (!regionData) {
                    return; // Ignore clicks on regions without data
                }

                // Reset previous selected region
                if (selectedRegion) {
                    d3.select(selectedRegion).attr("fill", "#cce5df");
                }

                // Set the newly clicked region as selected
                selectedRegion = this;
                d3.select(selectedRegion).attr("fill", "#6ab04c");

                // Update the bar chart with data from the selected region
                updateBarChart(regionData);
            });

        // Optional: Uncomment for global click event listener to deselect regions
        // document.addEventListener('click', function(event) {
        //     if (!event.target.closest('svg')) {
        //         d3.select(selectedRegion).attr("fill", "#cce5df");
        //         selectedRegion = null;
        //     }
        // });

    });
});

function updateMapForLanguage(lang_idx) {
    const regions = svgb.selectAll("path"); 

    regions.each(function(d) {
        const regionName = d.properties.name;
        const regionData = dataByRegion[regionName];

        if (regionData) {
            // Extract the array of language names
            const languages = Object.keys(regionData).filter(key => key !== "Region");

            // Get the language name based on lang_idx
            const language = languages[lang_idx];

            if (language && regionData[language]) {
                
                const value = +regionData[language]; 

                // Use the color scale to set the region's color
                const colorScale = d3.scaleSequential(d3.interpolateReds)
                    .domain([0, 53]);

                d3.select(this).attr("fill", colorScale(value));
            } else {
                d3.select(this).attr("fill", "#cccccc"); 
            }
        } else {
            d3.select(this).attr("fill", "#cccccc"); 
        }
    });
}

function updateMapToDefault() {
    const regions = svgb.selectAll("path"); 

    regions.each(function(d) {
        const regionName = d.properties.name;
        const regionData = dataByRegion[regionName];

        if (regionData) {
            
            d3.select(this).attr("fill", "#cce5df"); 
        } else {
            d3.select(this).attr("fill", "#cccccc"); 
        }

        d3.select(selectedRegion).attr("fill", "#6ab04c");
    });
}





