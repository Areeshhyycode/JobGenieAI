export function coverLetterPrompt({ company, role, jobDescription, userName, userSkills }) {
  const system = `You are an expert career coach and professional cover letter writer.
Write compelling, personalized cover letters that highlight relevant skills and enthusiasm.
Keep the tone professional yet authentic. Output only the cover letter text, no extra commentary.`;

  const user = `Write a cover letter for the following job application:

Applicant Name: ${userName || 'the applicant'}
Company: ${company}
Role: ${role}
Job Description:
${jobDescription}
${userSkills ? `\nApplicant Skills: ${userSkills}` : ''}

Requirements:
- 3-4 paragraphs
- Opening that grabs attention and mentions the specific role
- Middle paragraphs connecting skills/experience to the job requirements
- Strong closing with a call to action
- Professional but personable tone
- If skills are provided, weave them naturally into the letter`;

  return { system, user };
}
