import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { chatCompletion } from '@/lib/groq';
import { coverLetterPrompt } from '@/prompts/coverLetter';
import connectDB from '@/lib/mongodb';
import AIGenerated from '@/models/AIGenerated';

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company, role, jobDescription, userSkills, applicationId, regenerate } = await request.json();

    if (!company || !role || !jobDescription) {
      return NextResponse.json({ error: 'company, role, and jobDescription are required' }, { status: 400 });
    }

    // Check cache first
    if (applicationId && !regenerate) {
      await connectDB();
      const cached = await AIGenerated.findOne({ applicationId });
      if (cached?.coverLetter) {
        return NextResponse.json({ coverLetter: cached.coverLetter, cached: true });
      }
    }

    const { system, user: userPrompt } = coverLetterPrompt({
      company,
      role,
      jobDescription,
      userName: user.name,
      userSkills,
    });

    const coverLetter = await chatCompletion(system, userPrompt);

    if (applicationId) {
      await connectDB();
      await AIGenerated.findOneAndUpdate(
        { applicationId },
        { coverLetter },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Cover letter error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate cover letter' }, { status: 500 });
  }
}
