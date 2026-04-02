export function interviewQuestionsPrompt({ company, role, jobDescription }) {
  const system = `You are an experienced technical recruiter and interview coach.
Generate realistic interview questions that a candidate would likely face.
You MUST output in this exact format with these exact section headers:

## Technical Questions
(5 numbered questions with answer hints)

## Behavioral Questions
(5 numbered questions with answer hints)

## Company-Specific Questions
(5 numbered questions with answer hints)

Each question must be followed by "Hint:" on the next line with a 1-2 sentence tip.`;

  const user = `Generate 15 likely interview questions for this position:

Company: ${company}
Role: ${role}
Job Description:
${jobDescription}

Format each question as:
1. [Question text]
Hint: [Brief 1-2 sentence approach tip]

Generate exactly 5 questions per category (Technical, Behavioral, Company-Specific).`;

  return { system, user };
}
