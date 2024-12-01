const wid = 821;
const hei = 520;

const svgb = d3.select("#map-svg")
    .attr("width", wid)
    .attr("height", hei);

const projection = d3.geoMercator()
    .scale(150)
    .translate([wid / 2, hei / 1.5]);

const path = d3.geoPath().projection(projection);

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(error, geoData) {
    if (error) {
        console.error("Error loading GeoJSON data:", error);
        return;
    }

    d3.csv("data/programming_languages_popularity_by_region.csv", function(error, data) {
        if (error) {
            console.error("Error loading CSV data:", error);
            return;
        }

        const dataByRegion = {};
        data.forEach(d => {
            dataByRegion[d.Region] = d;
        });

        let selectedRegion = null;  

        svgb.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => {
                const regionName = d.properties.name;
                return dataByRegion[regionName] ? "#cce5df" : "#cccccc"; 
            })
            .attr("stroke", "#333")
            .on("mouseover", function(event, d) {
                const feature = geoData.features[d];
                const regionData = dataByRegion[feature.properties.name];

                if (regionData && selectedRegion !== this) {
                    d3.select(this).attr("fill", "#95cea2");
                }

                // if (regionData) {
                //     d3.select("#tooltip")
                //         .style("opacity", 1)
                //         .style("left", (event.pageX + 10) + "px")
                //         .style("top", (event.pageY - 28) + "px")
                //         .html(`<strong>${feature.properties.name}</strong>`);
                // }
            })
            .on("mouseout", function(event, d) {
                const feature = geoData.features[d];
                const regionData = dataByRegion[feature.properties.name];
                if (regionData && selectedRegion !== this) {
                    d3.select(this).attr("fill", "#cce5df");
                }
                d3.select("#tooltip").style("opacity", 0);
            })
            .on("click", function(event, d) {
                const feature = geoData.features[d];
                const regionData = dataByRegion[feature.properties.name];
                if (!regionData) {
                    return;
                }

                if (selectedRegion) {
                    d3.select(selectedRegion).attr("fill", "#cce5df");
                }

                selectedRegion = this;
                d3.select(selectedRegion).attr("fill", "#6ab04c");

                updateBarChart(regionData);
            });

        // document.addEventListener('click', function(event) {
        //     if (!event.target.closest('svg')) {
        //         d3.select(selectedRegion).attr("fill", "#cce5df");
        //         selectedRegion = null;
        //     }
        // });

    });
});


