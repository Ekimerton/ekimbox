export function getComparisonPairs(
  answers: Record<string, string>
): [string, string][] {
  // This function should return an array of pairs of answers for the comparison round
  // For simplicity, we'll just return the first two answers here
  const answerKeys = Object.keys(answers);
  const pairs: [string, string][] = [];
  for (let i = 0; i < answerKeys.length; i += 2) {
    pairs.push([answers[answerKeys[i]], answers[answerKeys[i + 1]]]);
  }
  return pairs;
}
