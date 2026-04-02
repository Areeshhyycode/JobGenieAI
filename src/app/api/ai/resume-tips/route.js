import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { chatCompletion } from '@/lib/groq';
import { resumeTipsPrompt } from '@/prompts/resumeTips';
import connectDB from '@/lib/mongodb';
import AIGenerated from '@/models/AIGenerated';

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, jobDescription, currentResume, applicationId, regenerate } = await request.json();

    if (!role || !jobDescription) {
      return NextResponse.json({ error: 'role and jobDescription are required' }, { status: 400 });
    }

    // Check cache first
    if (applicationId && !regenerate) {
      await connectDB();
      const cached = await AIGenerated.findOne({ applicationId });
      if (cached?.resumeTips) {
        return NextResponse.json({ resumeTips: cached.resumeTips, cached: true });
      }
    }

    const { system, user: userPrompt } = resumeTipsPrompt({ role, jobDescription, currentResume });
    const resumeTips = await chatCompletion(system, userPrompt);

    if (applicationId) {
      await connectDB();
      await AIGenerated.findOneAndUpdate(
        { applicationId },
        { resumeTips },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ resumeTips });
  } catch (error) {
    console.error('Resume tips error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate resume tips' }, { status: 500 });
  }
}
