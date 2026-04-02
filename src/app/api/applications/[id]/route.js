import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

// PUT /api/applications/:id — update application
export async function PUT(request, { params }) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const body = await request.json();
  const application = await Application.findOneAndUpdate(
    { _id: params.id, userId: user.id },
    body,
    { new: true, runValidators: true }
  );

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  return NextResponse.json(application);
}

// DELETE /api/applications/:id — delete application
export async function DELETE(request, { params }) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const application = await Application.findOneAndDelete({
    _id: params.id,
    userId: user.id,
  });

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Deleted successfully' });
}
