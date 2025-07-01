import { Card, CardContent, Typography, Box, Avatar, useTheme } from '@mui/material';

export default function KPICard({ title, value, color = 'primary', icon }) {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}25 100%)`,
        border: `1px solid ${theme.palette[color].main}30`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        {icon && (
          <Avatar sx={{ 
            bgcolor: `${color}.main`, 
            mx: 'auto', 
            mb: 2,
            width: 56,
            height: 56
          }}>
            {icon}
          </Avatar>
        )}
        <Typography variant="h4" color={`${color}.main`} fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
