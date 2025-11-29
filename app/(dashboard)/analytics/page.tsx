'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your card performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
          <p className="mt-2 text-3xl font-bold">{analytics?.totalScans || 0}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Avg. per Day</h3>
          <p className="mt-2 text-3xl font-bold">
            {analytics?.totalScans ? Math.round(analytics.totalScans / parseInt(timeRange)) : 0}
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Cards</h3>
          <p className="mt-2 text-3xl font-bold">{analytics?.scansByCard?.length || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scans Over Time */}
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Scans Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.scansByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Scans" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Scans by Card */}
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Scans by Card</h3>
          {analytics?.scansByCard && analytics.scansByCard.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.scansByCard}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.cardName}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.scansByCard.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground">No data yet</p>
          )}
        </div>

        {/* Scans by Hour */}
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Scans by Time of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.scansByHour || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Scans" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scans by Day of Week */}
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Scans by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analytics?.scansByDayOfWeek?.map((s: any) => ({
                day: DAYS[s.dayOfWeek],
                count: s.count,
              })) || []}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Scans" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

