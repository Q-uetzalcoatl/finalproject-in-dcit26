import React, { useState, useEffect } from 'react';
import { questions } from '../data/questions';

function Quiz({ user, onSubmit, isScoreReleased }) {
  // --- DATABASE CHECK ---
  // Look into localStorage to see if this user already submitted data
  const savedData = JSON.parse(localStorage.getItem('studentsData') || '[]')
    .find(s => s.studentId === user.id);

  // --- STATE ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // If we found saved data, use their old answers. Otherwise empty object.
  const [answers, setAnswers] = useState(savedData ? savedData.answers : {});
  
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  // If saved data exists, use their old violation count.
  const [violations, setViolations] = useState(savedData ? savedData.violations : 0);
  
  // If saved data exists, set isSubmitted to TRUE immediately.
  const [isSubmitted, setIsSubmitted] = useState(!!savedData);

  // 1. TIMER LOGIC
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // 2. PROCTORING LOGIC (Tab Detection)
  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const newCount = violations + 1;
        setViolations(newCount);
        // Only alert if it's strictly hidden (prevents some false positives)
        alert(`WARNING: Tab switch detected! Violation ${newCount}/3.`);
        
        if (newCount >= 3) {
          alert("Maximum violations reached. Exam auto-submitted.");
          handleSubmit(true); 
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [violations, isSubmitted]);

  const handleSubmit = (forced = false) => {
    setIsSubmitted(true);
    // Calculate Score
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) score++;
    });

    onSubmit({
      studentId: user.id,
      name: user.name,
      score: score,
      violations: forced ? 3 : violations,
      answers: answers,
      status: 'completed'
    });
  };

  const handleOptionSelect = (index) => {
    setAnswers({ ...answers, [currentQuestion]: index });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- RENDERING VIEWS ---

  // A. WAITING SCREEN (If submitted but scores hidden)
  if (isSubmitted && !isScoreReleased) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full border-t-4 border-yellow-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Submitted</h2>
          <p className="text-gray-600 mb-4">Your answers have been recorded.</p>
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm mb-4">
            <strong>Status:</strong> Pending Instructor Release
          </div>
          <p className="text-sm text-gray-500">Please wait for the instructor to release results.</p>
        </div>
      </div>
    );
  }

  // B. REVIEW SCREEN (If scores are released)
  if (isSubmitted && isScoreReleased) {
    let score = 0;
    questions.forEach((q, idx) => { if (answers[idx] === q.correctAnswer) score++; });
    
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">Exam Results</h1>
            <p className="text-xl mt-2">Score: {score} / {questions.length}</p>
          </div>
          <div className="p-6 space-y-6">
            <h3 className="font-bold text-gray-700 border-b pb-2">Answer Review</h3>
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <p className="font-semibold text-gray-800 mb-2">{idx + 1}. {q.question}</p>
                  <div className="text-sm space-y-1">
                    <p className={isCorrect ? 'text-green-700 font-bold' : 'text-red-600 line-through'}>
                      Your Answer: {q.options[userAnswer] || "No Answer"}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-700 font-bold">Correct Answer: {q.options[q.correctAnswer]}</p>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 italic">
                    💡 <strong>Explanation:</strong> {q.rationale}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // C. QUIZ TAKING SCREEN
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Top Bar */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
        <div>
          <span className="block text-xs text-gray-500">Student</span>
          <span className="font-bold text-gray-700">{user.name}</span>
        </div>
        <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${violations > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          Violations: {violations}/3
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-3 mb-8">
          {questions[currentQuestion].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[currentQuestion] === idx 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                  : 'border-gray-100 hover:border-indigo-200 text-gray-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(curr => curr - 1)}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(curr => curr + 1)}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;          alert("Maximum violations reached. Exam auto-submitted.");
          handleSubmit(true); // true = forced submission
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [violations, isSubmitted]);

  const handleSubmit = (forced = false) => {
    setIsSubmitted(true);
    // Calculate Score
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) score++;
    });

    onSubmit({
      studentId: user.id,
      name: user.name,
      score: score,
      violations: forced ? 3 : violations,
      answers: answers,
      status: 'completed'
    });
  };

  const handleOptionSelect = (index) => {
    setAnswers({ ...answers, [currentQuestion]: index });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- RENDERING ---

  // A. WAITING SCREEN (If submitted but scores hidden)
  if (isSubmitted && !isScoreReleased) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full border-t-4 border-yellow-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Submitted</h2>
          <p className="text-gray-600 mb-4">Your answers have been recorded.</p>
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm mb-4">
            <strong>Status:</strong> Pending Instructor Release
          </div>
          <p className="text-sm text-gray-500">Please wait for the instructor to release results.</p>
        </div>
      </div>
    );
  }

  // B. REVIEW SCREEN (If scores are released)
  if (isSubmitted && isScoreReleased) {
    let score = 0;
    questions.forEach((q, idx) => { if (answers[idx] === q.correctAnswer) score++; });
    
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white text-center">
            <h1 className="text-3xl font-bold">Exam Results</h1>
            <p className="text-xl mt-2">Score: {score} / {questions.length}</p>
          </div>
          <div className="p-6 space-y-6">
            <h3 className="font-bold text-gray-700 border-b pb-2">Answer Review</h3>
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <p className="font-semibold text-gray-800 mb-2">{idx + 1}. {q.question}</p>
                  <div className="text-sm space-y-1">
                    <p className={isCorrect ? 'text-green-700 font-bold' : 'text-red-600 line-through'}>
                      Your Answer: {q.options[userAnswer] || "No Answer"}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-700 font-bold">Correct Answer: {q.options[q.correctAnswer]}</p>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 italic">
                    💡 <strong>Explanation:</strong> {q.rationale}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // C. QUIZ TAKING SCREEN
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Top Bar */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-6">
        <div>
          <span className="block text-xs text-gray-500">Student</span>
          <span className="font-bold text-gray-700">{user.name}</span>
        </div>
        <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${violations > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          Violations: {violations}/3
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-3 mb-8">
          {questions[currentQuestion].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[currentQuestion] === idx 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                  : 'border-gray-100 hover:border-indigo-200 text-gray-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(curr => curr - 1)}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(curr => curr + 1)}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
