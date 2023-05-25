export function generatePrompt(input: string) {
  return `Q: ${input} Generate a response with less than 200 characters.`;
}
