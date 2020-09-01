import { select, scaleLinear, max, scaleBand, axisLeft, axisBottom } from "d3";
import * as d3 from "d3";

//?! how to make the chart responsive
const barchart = select("#barchart-1");

// const barchart = select("#barchart")
//   .append("svg")
//   .attr("viewBox", `0 0 500 500`);

const renderBarChart = (data) => {
  const height = +barchart.attr("height");
  const width = +barchart.attr("width");

  const xValue = (d) => d.Month;
  const yValue = (d) => d.GHIm;

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
    .domain([0, max(data, yValue)]) //? use extent?
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

  // chart.append("text").attr("y", innerHeight+20).text("month");

  const xAxis = axisBottom(xScale);
  // .tickSize(-innerHeight); //add vertical gridline
  // .tickFormat(format(".3n")) //change number format
  chart
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`); //move top to btm

  const yAxis = axisLeft(yScale);
  chart
    .append("g")
    .call(yAxis.tickSize(-innerWidth, 0, 0))
    .attr("class", "grid")
    .selectAll(".tick > line")
    .remove();
  // .selectAll(".domain, .tick > line").remove(); //remove extra line

  chart
    .append("text")
    .attr("fill", "black")
    .attr("y", -30)
    .attr("x", -innerHeight / 2)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("GHI(kWh/m2)");

  const barGroups = chart.selectAll().data(data).enter().append("g");

  barGroups
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(xValue(d)))
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(yValue(d)))
    .on("mouseenter", function (selected, i) {
      d3.selectAll(".value").attr("opacity", 0);

      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 0.6)
        .attr("x", (d) => xScale(xValue(d)) - 5)
        .attr("width", xScale.bandwidth() + 10); //wider on hover

      const y = yScale(yValue(selected));
      // debugger;
      chart
        .append("line")
        .attr("id", "limit")
        .attr("stroke", "red")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", innerWidth)
        .attr("y2", y);

      barGroups
        .append("text")
        .attr("class", "difference")
        .attr("x", (d) => xScale(xValue(d)) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(yValue(d)))
        .attr("text-anchor", "middle")
        .text((d, idx) => {
          let text =
            (
              (Math.abs(yValue(d) - yValue(selected)) / yValue(selected)) *
              100
            ).toFixed(1) + "%";

          yValue(d) > yValue(selected)
            ? (text = "+" + text)
            : (text = "-" + text);
          return idx === i ? "" : text;
        });
    })
    .on("mouseleave", function () {
      barGroups.selectAll(".value").attr("opacity", 1);

      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 1)
        .attr("x", (d) => xScale(xValue(d)))
        .attr("width", xScale.bandwidth());

      chart.selectAll("#limit").remove();
      chart.selectAll(".difference").remove();
    });

  barGroups
    .append("text")
    .attr("class", "value")
    .attr("x", (d) => xScale(xValue(d)) + xScale.bandwidth() / 2)
    .attr("text-anchor", "middle")
    .merge(barGroups)
    .attr("y", (d) => yScale(yValue(d)))
    .text((d) => yValue(d));
};

export default renderBarChart;
