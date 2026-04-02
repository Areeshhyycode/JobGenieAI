import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { chatCompletion } from '@/lib/groq';
import { followUpEmailPrompt } from '@/prompts/followUpEmail';
import connectDB from '@/lib/mongodb';
import AIGenerated from '@/models/AIGenerated';

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company, role, interviewDate, interviewerName, daysSinceApplied, applicationId, regenerate } = await request.json();

    if (!company || !role) {
      return NextResponse.json({ error: 'company and role are required' }, { status: 400 });
    }

    // Check cache first
    if (applicationId && !regenerate) {
      await connectDB();
      const cached = await AIGenerated.findOne({ applicationId });
      if (cached?.followUpEmail) {
        return NextResponse.json({ followUpEmail: cached.followUpEmail, cached: true });
      }
    }

    const { system, user: userPrompt } = followUpEmailPrompt({ company, role, interviewDate, interviewerName, daysSinceApplied });
    const followUpEmail = await chatCompletion(system, userPrompt);

    if (applicationId) {
      await connectDB();
      await AIGenerated.findOneAndUpdate(
        { applicationId },
        { followUpEmail },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ followUpEmail });
  } catch (error) {
    console.error('Follow-up email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate follow-up email' }, { status: 500 });
  }
}
