import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, } from "recharts";
import { Paper, Typography } from "@mui/material";

// Reusable report bar chart
// Shows report totals in a simple visual format
const ReportBarChart = ({ data = [] }) => {
  return (
    <Paper sx={{ p: 3, height: 360 }}>
      <Typography variant="h6" mb={2}>
        Report Overview
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ReportBarChart;