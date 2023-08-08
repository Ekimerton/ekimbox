"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnswerPairs = exports.flattenPlayerAnswers = exports.generatePlayerPairs = exports.shuffle = exports.getComparisonPairs = exports.getQuestions = void 0;
const fs_1 = __importDefault(require("fs"));
// A function to fetch 'n' random questions from questions.json
function getQuestions(n) {
    const questionsData = fs_1.default.readFileSync('./questions.json', 'utf-8');
    const allQuestions = JSON.parse(questionsData);
    if (n > allQuestions.length) {
        throw new Error("Requested more questions than available.");
    }
    const selectedQuestions = [];
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
exports.getQuestions = getQuestions;
function getComparisonPairs(answers) {
    // This function should return an array of pairs of answers for the comparison round
    // For simplicity, we'll just return the first two answers here
    const answerKeys = Object.keys(answers);
    const pairs = [];
    for (let i = 0; i < answerKeys.length; i += 2) {
        pairs.push([answers[answerKeys[i]], answers[answerKeys[i + 1]]]);
    }
    return pairs;
}
exports.getComparisonPairs = getComparisonPairs;
// A function to shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
exports.shuffle = shuffle;
function generatePlayerPairs(players) {
    if (players.length % 2 !== 0) {
        throw new Error("Number of players should be even.");
    }
    const playerIds = players.map(player => player.id);
    const shuffledPlayerIds = shuffle(playerIds);
    const pairs = [];
    for (let i = 0; i < shuffledPlayerIds.length; i += 2) {
        pairs.push([shuffledPlayerIds[i], shuffledPlayerIds[i + 1]]);
    }
    return pairs;
}
exports.generatePlayerPairs = generatePlayerPairs;
function flattenPlayerAnswers(players, answers) {
    let flattened = [];
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
exports.flattenPlayerAnswers = flattenPlayerAnswers;
function generateAnswerPairs(flatAnswers) {
    let pairs = [];
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
exports.generateAnswerPairs = generateAnswerPairs;
