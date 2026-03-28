import { Card, CardContent, Typography, Box } from "@mui/material";

/**
 * Dashboard: Reusable dashboard summary card
 * @param {*} - (title): label shown at top, (value): total value, (icon): optional MUI icon 
 * @returns 
 */
const DashboardCard = ({ title, value, icon }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h5" mt={1}>
              {value}
            </Typography>
          </Box>

          <Box color="primary.main" fontSize="2rem">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;