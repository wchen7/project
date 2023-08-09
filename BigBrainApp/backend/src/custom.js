/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  // delete question.solution;
  const copy = {
    ...question
  }
  delete copy.solution;
  return copy;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const idList = [];
  for (let i = 0; i < question.solution.length; i++) {
    if (!question.solution[i].hasOwnProperty('id')) {
      continue;
    }
    idList.push(question.solution[i].id);
  }
  return idList;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  return [
    123,
    456,
    678,
  ]; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return Number(question.time);
};
