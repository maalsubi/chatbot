import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log("Messages are ", messages);

  // ✅ Context for Academic Planner
  const context = `
  This chatbot is designed for engineering college students.
  It helps manage assignments, lab records, presentations, and internal exams.
  Students often face multiple overlapping deadlines and need structured planning support.
  `;

  // ✅ Basic System Prompt
  const systemPrompt = `
  You are an Academic Planning Assistant for engineering college students.

  Your job is to help students organize academic tasks, prioritize deadlines,
  and create structured execution plans.

  Always:
  - Ask for deadline, difficulty level, current progress, and available study hours if missing.
  - Prioritize tasks based on urgency and complexity.
  - Break tasks into clear, step-by-step plans.
  - Suggest realistic daily schedules.
  - Avoid encouraging plagiarism or unethical academic behavior.

  Keep responses structured and concise.

  Follow this output format:
  1) Task Summary
  2) Execution Plan
  3) Immediate Next Step

  Context:
  ${context}
  `;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    // Optional: Enable tool calling if needed
    // tools,
    // maxSteps: 5,
  });

  return result.toUIMessageStreamResponse();
}