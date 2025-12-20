import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Admin from './components/Admin';

function App() {
  // --- MOCK DATABASE STATE ---
  const [studentsData, setStudentsData] = useState(() => {
    const saved = localStorage.getItem('studentsData');
    return saved ? JSON.parse(saved) : [];
  });

  const [isScoreReleased, setIsScoreReleased] = useState(() => {
    return localStorage.getItem('isScoreReleased') === 'true';
  });

  // --- SESSION STATE ---
  const [currentUser, setCurrentUser] = useState(null);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('studentsData', JSON.stringify(studentsData));
    localStorage.setItem('isScoreReleased', isScoreReleased);
  }, [studentsData, isScoreReleased]);

  // HANDLERS
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleQuizSubmit = (result) => {
    setStudentsData((prev) => {
      // Remove old submission if any (prevents duplicates)
      const filtered = prev.filter(s => s.studentId !== result.studentId);
      return [...filtered, result];
    });
  };

  const handleReleaseScores = () => {
    setIsScoreReleased(true);
    alert("Scores have been released to all students!");
  };

  const handleReset = () => {
    if(confirm("Are you sure? This deletes all data.")) {
      setStudentsData([]);
      setIsScoreReleased(false);
      localStorage.clear();
      window.location.reload();
    }
  }

  // ROUTING LOGIC
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return (
      <Admin 
        studentsData={studentsData} 
        isScoreReleased={isScoreReleased}
        onReleaseScores={handleReleaseScores}
        onResetSystem={handleReset}
      />
    );
  }

  if (currentUser.role === 'student') {
    return (
        <Quiz 
            user={currentUser} 
            onSubmit={handleQuizSubmit} 
            isScoreReleased={isScoreReleased} 
        />
    );
  }

  return <div>Loading...</div>;
}

export default App;      const filtered = prev.filter(s => s.studentId !== result.studentId);
      return [...filtered, result];
    });
  };

  const handleReleaseScores = () => {
    setIsScoreReleased(true);
    alert("Scores have been released to all students!");
  };

  const handleReset = () => {
    if(confirm("Are you sure? This deletes all data.")) {
      setStudentsData([]);
      setIsScoreReleased(false);
      localStorage.clear();
      window.location.reload();
    }
  }

  // ROUTING LOGIC (Simple conditional rendering)
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return (
      <Admin 
        studentsData={studentsData} 
        isScoreReleased={isScoreReleased}
        onReleaseScores={handleReleaseScores}
        onResetSystem={handleReset}
      />
    );
  }

  if (currentUser.role === 'student') {
    // Check if student already submitted
    const existingSubmission = studentsData.find(s => s.studentId === currentUser.id);
    
    // If they already submitted, show the Quiz component in "View Result" mode
    if (existingSubmission) {
      return (
        <Quiz 
          user={currentUser} 
          isScoreReleased={isScoreReleased} 
          // We pass a dummy function because they can't submit again
          onSubmit={() => {}} 
          // We inject their saved state directly
        />
      );
      // Note: In a simpler version, we would just pass the 'existingSubmission' data 
      // directly to a Result component. For this demo, I'm letting the Quiz component
      // handle the logic of "If submitted -> Show Status/Result". 
      // However, to make the Quiz component render the RESULT view, 
      // we need to tweak it slightly to accept 'initialAnswers'. 
      // *Wait, looking at my Quiz.jsx code above, I used local state.*
      // *Let me fix this logic right here.*
    }
    
    // If first time, show Quiz
    return (
        <Quiz 
            user={currentUser} 
            onSubmit={handleQuizSubmit} 
            isScoreReleased={isScoreReleased} 
        />
    );
  }

  return <div>Loading...</div>;
}

export default App;
```

### 🚨 Crucial Last Step for `Quiz.jsx` Compatibility
In `App.jsx`, I mentioned a small logic gap regarding **viewing previous results**.

To make the "Student Login -> View Result" flow work perfectly without adding more files, **go back to `src/components/Quiz.jsx`** and modify the `useState` lines at the top to look like this:

```javascript
// REPLACE THE TOP OF Quiz.jsx WITH THIS:
function Quiz({ user, onSubmit, isScoreReleased }) {
  // Check if we can find this user's data in localStorage to restore their session
  const savedData = JSON.parse(localStorage.getItem('studentsData') || '[]')
    .find(s => s.studentId === user.id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(savedData ? savedData.answers : {});
  const [timeLeft, setTimeLeft] = useState(600);
  const [violations, setViolations] = useState(savedData ? savedData.violations : 0);
  const [isSubmitted, setIsSubmitted] = useState(!!savedData); 
  
  // ... rest of the code is the same
