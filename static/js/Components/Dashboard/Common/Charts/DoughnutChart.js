import React from "react";

import { Doughnut } from "react-chartjs-2";

import "react-toastify/dist/ReactToastify.css";
function DoughnutChart({ chartDataValues1, chartDataValues2, cart1Color }) {
  const chartData = [chartDataValues1, chartDataValues2];
  const showData = chartData[0] + "%";
  const data = {
    responsive: true,
    maintainAspectRatio: true,

    datasets: [
      {
        data: chartData,
        backgroundColor: [cart1Color, "#4B4A65", "#33B49B"],
        hoverBackgroundColor: [cart1Color, "#4B4A65", "#33B49B"],
        borderWidth: 0,
        responsive: true,
      },
    ],
  };
  const optionsfrom = {
    cutout: 20,
  };
  const plugins = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 100).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "top";
        var text = showData,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];
  return (
    <React.Fragment>
      <Doughnut data={data} plugins={plugins} options={optionsfrom} />
    </React.Fragment>
  );
}
export default DoughnutChart;
