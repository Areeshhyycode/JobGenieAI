import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

// GET /api/applications — list all with optional filters
export async function GET(request) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const filter = { userId: user.id };

  const status = searchParams.get('status');
  if (status) filter.status = status;

  const search = searchParams.get('search');
  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  const sort = searchParams.get('sort') || '-createdAt';

  const applications = await Application.find(filter).sort(sort).lean();
  return NextResponse.json(applications);
}

// POST /api/applications — create new application
export async function POST(request) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const body = await request.json();
  const application = await Application.create({
    ...body,
    userId: user.id,
  });

  return NextResponse.json(application, { status: 201 });
}
