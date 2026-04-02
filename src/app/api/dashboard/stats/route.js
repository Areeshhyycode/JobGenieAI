import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

// GET /api/dashboard/stats — aggregated stats + chart data
export async function GET(request) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const userId = user.id;

  // Status counts
  const statusCounts = await Application.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const total = statusCounts.reduce((sum, s) => sum + s.count, 0);
  const byStatus = {};
  statusCounts.forEach((s) => { byStatus[s._id] = s.count; });

  // Monthly application data for charts (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await Application.aggregate([
    { $match: { userId: userId, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const chartData = monthlyData.map((m) => ({
    month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
    applications: m.count,
  }));

  return NextResponse.json({ total, byStatus, chartData });
}
