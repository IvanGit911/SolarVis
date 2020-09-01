import {
  csv,
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
  selectorAll,
  selection,
} from "d3";
//?! how to make the chart responsive

const barchart = select("#barchart-2");

// const barchart = select("#barchart")
//   .append("svg")
//   .attr("viewBox", `0 0 500 500`);

const renderBarChart_2 = (data) => {
  const height = +barchart.attr("height");
  const width = +barchart.attr("width");

  const xValue = (d) => d.Month;
  const margin = {
    top: 20,
    left: 100,
    right: 20,
    bottom: 20,
  };
  const innerWidth = width - margin.left - margin.right; //or could user innerheight +margin +margin
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand()
    .domain(data.map(xValue)) //band needs to be a array of input
    .range([0, innerWidth])
    .padding(0.4);

  const yScale = scaleLinear()
    // .domain([0, max(data, yValue)]) //? use extent?
    .range([innerHeight, 0]);

  const chart = barchart
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`); //give chart padding

  // chart
  //   .append("text")
  //   .attr("x", innerWidth / 2)
  //   .attr("y", 0)
  //   .attr("text-anchor", "middle")
  //   .text("this is bar chart"); // add a title

  // chart.append("text").attr("y", innerHeight).text("x-label");

  const xAxis = axisBottom(xScale);
  // .tickSize(-innerHeight); //add vertical gridline
  // .tickFormat(format(".3n")) //change number format
  chart
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`); //move top to btm

  const yAxis = axisLeft(yScale);
  const yAxisChange = chart
    .append("g")
    .call(yAxis.tickSize(-innerWidth, 0, 0))
    .attr("class", "grid");

  // .selectAll(".tick > line").remove();
  // .selectAll(".domain, .tick > line").remove(); //remove extra line

  // yAxisChange
  //   .append("text")
  //   .attr("fill", "red")
  //   .attr("y", -30)
  //   .attr("x", -innerHeight / 2)
  //   .attr("transform", "rotate(-90)")
  //   .attr("text-anchor", "middle")
  //   .text("sidebar");

  const updateChart = function (data, column) {
    const yValue = (d) => d[column];
    //update yAxis
    // column === "TEMP"
    //   ? yScale.domain(extent(data, yValue))
    //   : yScale.domain([0, max(data, yValue)]);
    yScale.domain([0, max(data, yValue)]);
    yAxisChange.call(yAxis);

    const barGroups = chart.selectAll(".bar").data(data); //will be updated listed down below

    barGroups
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(xValue(d)))
      .attr("width", xScale.bandwidth())
      .merge(barGroups)
      .attr("y", (d) => yScale(yValue(d)))
      .attr("height", (d) => innerHeight - yScale(yValue(d)));

    barGroups
      .append("text")
      .attr("class", "value")
      .attr("x", (d) => xScale(xValue(d)) + xScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .merge(barGroups)
      .attr("y", (d) => yScale(yValue(d)))
      .text((d) => yValue(d));

    barGroups.exit().remove().transition().duration(500);
  };

  const handleChange = function () {
    const column = select(this).property("value");
    updateChart(data, column);
  };

  const dropDown = select("#select-menu-1")
    .insert("select", "svg")
    .on("change", handleChange);
  const columns = ["GHIm", "RH", "WS"];
  dropDown
    .selectAll("option")
    .data(columns)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  updateChart(data, "GHIm");
};

export default renderBarChart_2;
