import React from "react";
import { Chart } from "react-google-charts";

const options = {
  title: "Feedback for Teacher",
  chartArea: { width: "50%" },
  hAxis: {
    title: "Criteria for feedback",
    minValue: 0,
  },
  vAxis: {
    title: "Score",
  },
};

const Graph = (feedback) => {
    const feedbackData = Object.entries(feedback.data.data.feedbackObjectDataRating).map(([key, value]) => [key, value]);

    const newData = [
    ["Score", "Value"],
    ...feedbackData
    ];

    return (
        <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={newData}
        options={options}
        />
    );
    }

export default Graph;