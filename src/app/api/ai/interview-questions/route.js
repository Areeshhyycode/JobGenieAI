import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { chatCompletion } from '@/lib/groq';
import { interviewQuestionsPrompt } from '@/prompts/interviewQuestions';
import connectDB from '@/lib/mongodb';
import AIGenerated from '@/models/AIGenerated';

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company, role, jobDescription, applicationId, regenerate } = await request.json();

    if (!company || !role || !jobDescription) {
      return NextResponse.json({ error: 'company, role, and jobDescription are required' }, { status: 400 });
    }

    // Check cache first
    if (applicationId && !regenerate) {
      await connectDB();
      const cached = await AIGenerated.findOne({ applicationId });
      if (cached?.interviewQuestions) {
        return NextResponse.json({ interviewQuestions: cached.interviewQuestions, cached: true });
      }
    }

    const { system, user: userPrompt } = interviewQuestionsPrompt({ company, role, jobDescription });
    const interviewQuestions = await chatCompletion(system, userPrompt);

    if (applicationId) {
      await connectDB();
      await AIGenerated.findOneAndUpdate(
        { applicationId },
        { interviewQuestions },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ interviewQuestions });
  } catch (error) {
    console.error('Interview questions error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate interview questions' }, { status: 500 });
  }
}
