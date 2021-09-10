import React from "react";

import { Doughnut } from "react-chartjs-2";

import "react-toastify/dist/ReactToastify.css";
function DoughnutChartWithValues({
  chartDataValues1,
  chartDataValues2,
  chartDataValues3,
  cart1Color,
  cart2Color,
  cart3Color,
  totalQuestions,
}) {
  const chartData = [chartDataValues1, chartDataValues2, chartDataValues3];
  const showData = totalQuestions;
  const data = {
    responsive: true,
    maintainAspectRatio: true,
    //labels: ["Incorrrect", "Skipped", "Correct"],
    weight: 250,

    datasets: [
      {
        fullWidth: true,
        tooltipFontSize: 500,
        data: chartData,
        backgroundColor: [cart1Color, cart2Color, cart3Color],
        hoverBackgroundColor: [cart1Color, cart2Color, cart3Color],
        borderWidth: 0,
        responsive: true,
        hoverOffset: 2,
      },
    ],
  };

  const optionsfrom = {
    cutout: 75,
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
          textY = height / 2.2;
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
export default DoughnutChartWithValues;
