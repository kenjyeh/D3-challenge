// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 560;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Import Data
var file = "assets/data/data.csv"

// Function is called and passes csv data
d3.csv(file).then(successHandle);


//successHandle processes statesData
function successHandle(statesData) {

  // Loop through the data and pass argument data
  statesData.map(function (data) {
    //makes variables numeric
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  //  create x and y scale with limits
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, svgWidth]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([svgHeight, 0]);

  // set limits to scale functions

  var xAxis = d3.axisBottom(xLinearScale)
    // Adjust the number of ticks for the bottom axis  
    .ticks(7);
  var yAxis = d3.axisLeft(yLinearScale);




  // Append the axes to the chart group 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${svgHeight})`)
    .call(xAxis);
  chartGroup.append("g")
    .call(yAxis);


  // Create Circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "20")
    .attr("fill", "#3cb44b")
    .attr("opacity", ".5")


  // Append text to circles 
  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style('fill', 'black')
    .text(d => (d.abbr));

  // initialize hover tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });

  // call on tooltip function
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (svgHeight / 2))
    .attr("dy", "2em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${svgWidth / 2}, ${svgHeight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}