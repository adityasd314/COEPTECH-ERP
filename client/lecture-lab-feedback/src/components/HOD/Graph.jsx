import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';

const CompoundBarChart = (feedback) => {
  console.log(feedback.data.data)
  const graphdata = Object.entries(feedback.data.data.feedbackObjectDataRating).map(([key, value], i) => ({ x: i+1, y: value }));
  const keys = Object.keys(feedback.data.data.feedbackObjectDataRating);
  return (
    <XYPlot width={450} height={300} stackBy="y">
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis 
        //tickValues={graphdata.map(item => item.x)} // Specify custom tick values
        tickFormat={d => keys[d - 1]} // Use keys as labels
        tickLabelAngle={-15}
        style={{
          text: { fontSize: 10 } // Adjust font size if needed
        }}
      />
      <YAxis />
        <VerticalBarSeries data={graphdata} />
    </XYPlot>
  );
};

export default CompoundBarChart;
