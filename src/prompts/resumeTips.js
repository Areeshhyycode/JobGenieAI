export function resumeTipsPrompt({ role, jobDescription, currentResume }) {
  const system = `You are an expert resume consultant who helps candidates tailor their resumes for specific jobs.
Provide actionable, specific tips. Focus on what to add, remove, or reword.
Output as a numbered list of tips.`;

  const user = `Provide resume tailoring tips for this job application:

Target Role: ${role}
Job Description:
${jobDescription}

Current Resume/Experience:
${currentResume || 'Not provided — give general tailoring advice based on the job description.'}

Provide:
- 5-7 specific, actionable tips
- Keywords to include from the job description
- Sections to emphasize or add
- Formatting suggestions if relevant
- ATS optimization tips for this specific role`;

  return { system, user };
}
