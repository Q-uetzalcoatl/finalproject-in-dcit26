import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { questions } from '../data/questions';

function ResultScreen() {
  const { state, dispatch } = useQuiz();
  const percentage = Math.round((state.score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-32 h-32 mx-auto bg-indigo-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-6">
          {percentage}%
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-gray-800 mb-6">{state.score} / {questions.length}</p>
        <button onClick={() => dispatch({ type: 'RESTART' })} className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-700">
          Try Again
        </button>
      </div>
    </div>
  );
}
export default ResultScreen;
