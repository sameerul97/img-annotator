import React from "react";
import { Pie } from "react-chartjs-2";

const data = {
  labels: ["Kiss", "Absolute", "Magic", "Hits"],
  datasets: [
    {
      data: [300, 100, 100, 200],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#0e25ff"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#0e25ff"],
    },
  ],
};

function DoughnutExample() {
  const doughnutClickHandler = (elems) => {
    console.log("Doughnut clicked", elems);
  };
  return (
    <div>
      <Pie
        onElementsClick={doughnutClickHandler}
        data={data}
        width={100}
        height={500}
        options={{
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data["labels"][tooltipItem[0]["index"]];
              },
              label: function (tooltipItem, data) {
                return data["datasets"][0]["data"][tooltipItem["index"]];
              },
            },
            backgroundColor: "#FFF",
            titleFontSize: 16,
            titleFontColor: "#0066ff",
            bodyFontColor: "#000",
            bodyFontSize: 14,
            displayColors: false,
          },
        }}
      />
    </div>
  );
}

export default DoughnutExample;
