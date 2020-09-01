import {
  select,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
  extent,
  scaleTime,
  line,
  curveBasis,
  area,
  range,
  scaleOrdinal,
  merge,
  brushX,
  event,
} from "d3";

const renderLinear = (data) => {
  const linearChart = select("#linearChart");
  const height = +linearChart.attr("height");
  const width = +linearChart.attr("width");
  const xAxisLabel = "Time";
  const yAxisLabel = "Temperature °F ";
  const xValue = (data) => data.Time;
  const yValue = (data) => data.TEMP;
  const circleRadius = 5;

  const margin = { top: 20, left: 30, right: 20, bottom: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleTime()
    .domain(extent(data, xValue)) //auto min and max
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue)) //auto min and max
    .range([innerHeight, 0]); //high to low

  const g = linearChart
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const yAxis = axisLeft(yScale);

  const yAxisG = g.append("g").call(yAxis);
  // yAxisG.selectAll(".domain, .tick > line").remove();

  yAxisG
    .append("text")
    .text(yAxisLabel)
    .attr("y", -20)
    .attr("x", -innerHeight / 2)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", 13); //subtitle

  const xAxis = axisBottom(xScale);
  // .tickFormat(format(".3n")) //change number format
  // .tickSize(-innerHeight); //add line

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`); //move top to btm
  // xAxisG.select(".domain").remove();

  xAxisG.append("text").text(xAxisLabel).attr("fill", "black"); //subtitle

  // g.append("text").attr("y", 0).text("this is linear chart"); //title

  const clip = g
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("x", 0)
    .attr("y", 0);

  const chart = g.append("g").attr("clip-path", "url(#clip)"); //where circles and lines and brush

  //create line
  // const lineGenerator = line()
  //   .x((d) => xScale(xValue(d)))
  //   .y((d) => yScale(yValue(d)))
  //   .curve(curveBasis); //curve more smooth

  // chart
  //   .append("path")
  //   .attr("class", "path-line")
  //   .attr("d", lineGenerator(data));

  //create circles
  chart
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("r", circleRadius)
    .on("mouseover", function (selected, i) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 0.6)
        .attr("r", (d) => xScale(xValue(d)) + 10)
        .attr("cx", xScale.bandwidth() - 5);

      chart
        .append("text")
        .attr("x", (d) => xScale(xValue(d)) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(yValue(d)))
        .attr("text-anchor", "middle");
    });

  //create brush
  const brush = brushX()
    .extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]) // initialise the brush area(select the whole area)
    .on("end", updateChart);

  chart.append("g").attr("class", "brush").call(brush);

  let idleTimeout;
  function idled() {
    idleTimeout = null;
  }
  function updateChart() {
    // debugger;
    const selectedArea = event.selection;
    // debugger;
    // event.stopPropagation();
    if (!selectedArea) {
      // debugger;
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 1050)); // time out a bit

      xScale.domain(extent(data, xValue));
    } else {
      xScale.domain([
        xScale.invert(selectedArea[0]),
        xScale.invert(selectedArea[1]),
      ]);

      chart.select(".brush").call(brush.move, null); //remove the brush
    }

    //update circles
    xAxisG.call(axisBottom(xScale));
    chart
      .selectAll("circle")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)));
    // debugger;
    // chart.select(".brush").call(brush.move, null);
    // event.stopPropagation();
  }
};

export default renderLinear;
