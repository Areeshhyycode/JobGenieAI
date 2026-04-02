import { NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { chatCompletion } from '@/lib/groq';
import { matchScorePrompt } from '@/prompts/matchScore';
import connectDB from '@/lib/mongodb';
import AIGenerated from '@/models/AIGenerated';

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, jobDescription, userSkills, userExperience, applicationId, regenerate } = await request.json();

    if (!role || !jobDescription) {
      return NextResponse.json({ error: 'role and jobDescription are required' }, { status: 400 });
    }

    // Check cache first
    if (applicationId && !regenerate) {
      await connectDB();
      const cached = await AIGenerated.findOne({ applicationId });
      if (cached?.matchScore) {
        return NextResponse.json({ score: cached.matchScore, cached: true });
      }
    }

    const { system, user: userPrompt } = matchScorePrompt({ role, jobDescription, userSkills, userExperience });
    const raw = await chatCompletion(system, userPrompt);

    let matchData;
    try {
      matchData = JSON.parse(raw);
    } catch {
      matchData = { score: 0, summary: raw };
    }

    if (applicationId) {
      await connectDB();
      await AIGenerated.findOneAndUpdate(
        { applicationId },
        { matchScore: matchData.score || 0 },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(matchData);
  } catch (error) {
    console.error('Match score error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate match score' }, { status: 500 });
  }
}
