"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComparisonPairs = void 0;
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
