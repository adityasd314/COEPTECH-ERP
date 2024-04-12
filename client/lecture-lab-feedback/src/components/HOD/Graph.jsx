import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from 'react-vis';

const CompoundBarChart = () => {
  return (
    <XYPlot width={300} height={300} stackBy="y">
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
        <VerticalBarSeries data={[{x: 2, y: 10}, {x: 4, y: 5}, {x: 5, y: 15}]} />
    </XYPlot>
  );
};

export default CompoundBarChart;
