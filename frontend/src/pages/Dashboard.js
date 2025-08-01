import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  DataUsage as DataQualityIcon,
  Psychology as ModelIcon,
  Notifications as AlertsIcon,
} from '@mui/icons-material';

import MetricCard from '../components/MetricCard';
import RecentActivity from '../components/RecentActivity';
import { dashboardAPI } from '../services/api';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch overview data
      const overviewResponse = await dashboardAPI.getOverview();
      setOverview(overviewResponse.data.data); // Access nested data
      
      // Fetch metrics data
      const metricsResponse = await dashboardAPI.getMetrics();
      setMetrics(metricsResponse.data.data); // Access nested data
      
      // Fetch recent activity
      const activityResponse = await dashboardAPI.getRecentActivity();
      // Ensure we're setting an array, even if empty
      setRecentActivity(Array.isArray(activityResponse?.data?.data) ? activityResponse.data.data : []);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Data Quality Score"
            value={overview?.data_quality_score || 0}
            icon={<DataQualityIcon />}
            color="primary"
            unit="%"
            formatValue={(value) => (value * 100).toFixed(1)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Models"
            value={overview?.active_models || 0}
            icon={<ModelIcon />}
            color="secondary"
            unit=""
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Datasets"
            value={overview?.total_datasets || 0}
            icon={<DataQualityIcon />}
            color="success"
            unit=""
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Alerts"
            value={overview?.alerts_count || 0}
            icon={<AlertsIcon />}
            color="warning"
            unit=""
          />
        </Grid>
      </Grid>

      {/* Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    System Uptime
                  </Typography>
                  <Typography variant="h6">
                    {metrics?.system_uptime || 100}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Model Accuracy
                  </Typography>
                  <Typography variant="h6">
                    {metrics?.model_accuracy || 0}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RecentActivity activities={recentActivity} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 