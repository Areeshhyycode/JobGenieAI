export function followUpEmailPrompt({ company, role, interviewDate, interviewerName, daysSinceApplied }) {
  const system = `You are a professional communication expert specializing in job search correspondence.
Write concise, warm follow-up emails that reinforce the candidate's interest and qualifications.
Output only the email (subject line + body), no extra commentary.`;

  const user = `Write a follow-up email for a job application:

Company: ${company}
Role: ${role}
${interviewDate ? `Interview Date: ${interviewDate}` : ''}
${interviewerName ? `Interviewer Name: ${interviewerName}` : ''}
${daysSinceApplied ? `Days Since Applied: ${daysSinceApplied} days ago` : ''}

Requirements:
- Include a subject line (format: "Subject: ...")
- ${interviewDate ? 'Thank them for the interview' : 'Express continued interest in the position'}
- ${daysSinceApplied ? `Politely inquire about the status after ${daysSinceApplied} days` : 'Reference something specific about the role'}
- Reiterate interest and fit
- Professional closing
- Keep it under 200 words`;

  return { system, user };
}
