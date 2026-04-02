export function matchScorePrompt({ role, jobDescription, userSkills, userExperience }) {
  const system = `You are an AI job matching analyst. Evaluate how well a candidate matches a job posting.
Return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "breakdown": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "overall_fit": <number 0-100>
  },
  "matched_keywords": [<list of matching skills/keywords>],
  "missing_keywords": [<list of required skills the candidate may lack>],
  "summary": "<2-3 sentence summary>"
}
Output ONLY valid JSON, no markdown or extra text.`;

  const user = `Evaluate this job match:

Role: ${role}
Job Description:
${jobDescription}

Candidate Skills: ${userSkills || 'Not provided'}
Candidate Experience: ${userExperience || 'Not provided'}`;

  return { system, user };
}
