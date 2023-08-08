import fs from 'fs';

export interface Player {
  id: string;
  name: string;
  score: number;
}

interface AnswerPrompt {
  playerId: string;
  prompts: string[];
  answers: string[];
}

// A function to fetch 'n' random questions from questions.json
export function getQuestions(n: number): string[] {
    const questionsData = fs.readFileSync('./questions.json', 'utf-8'); 
    const allQuestions: string[] = JSON.parse(questionsData);
    
    if (n > allQuestions.length) {
        throw new Error("Requested more questions than available.");
    }
    
    const selectedQuestions: string[] = [];
    
    while (selectedQuestions.length < n) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const question = allQuestions[randomIndex];

        // Ensure no duplicate questions
        if (!selectedQuestions.includes(question)) {
            selectedQuestions.push(question);
        }
    }
    
    return selectedQuestions;
}

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

// A function to shuffle an array using the Fisher-Yates algorithm
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


export function generatePlayerPairs(players: Player[]): [string, string][] {
  if (players.length % 2 !== 0) {
      throw new Error("Number of players should be even.");
  }
  
  const playerIds = players.map(player => player.id);
  const shuffledPlayerIds = shuffle(playerIds);
  
  const pairs: [string, string][] = [];

  for (let i = 0; i < shuffledPlayerIds.length; i += 2) {
      pairs.push([shuffledPlayerIds[i], shuffledPlayerIds[i + 1]]);
  }

  return pairs;
}

export function flattenPlayerAnswers(players: Player[], answers: Record<string, { prompts: string[]; answers: string[] }>): AnswerPrompt[] {
  let flattened: AnswerPrompt[] = [];

  for (let player of players) {
      if (answers[player.id]) {
          flattened.push({
              playerId: player.id,
              prompts: answers[player.id].prompts,
              answers: answers[player.id].answers
          });
      }
  }

  return flattened;
}


export function generateAnswerPairs(flatAnswers: AnswerPrompt[]): [AnswerPrompt, AnswerPrompt][] {
  let pairs: [AnswerPrompt, AnswerPrompt][] = [];
  
  for (let i = 0; i < flatAnswers.length; i++) {
      for (let j = i + 1; j < flatAnswers.length; j++) {
          // Avoid pairing answers from the same player
          if (flatAnswers[i].playerId !== flatAnswers[j].playerId) {
              pairs.push([flatAnswers[i], flatAnswers[j]]);
          }
      }
  }

  return pairs;
}

