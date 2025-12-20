export const questions = [
  {
    id: 1,
    question: "What is the primary purpose of React's Virtual DOM?",
    options: ["To directly update HTML", "To optimize rendering performance", "To manage database queries", "To style components"],
    correctAnswer: 1,
    rationale: "The Virtual DOM minimizes direct manipulation of the actual DOM, which is slow. It calculates changes first, then updates efficiently."
  },
  {
    id: 2,
    question: "Which hook is used to handle side effects like data fetching?",
    options: ["useState", "useReducer", "useEffect", "useContext"],
    correctAnswer: 2,
    rationale: "useEffect is designed for side effects—operations that affect something outside the scope of the function being executed."
  },
  {
    id: 3,
    question: "How do you prevent a form refresh in React?",
    options: ["event.stop()", "event.preventDefault()", "event.halt()", "return false"],
    correctAnswer: 1,
    rationale: "The standard JavaScript method event.preventDefault() stops the browser's default behavior of reloading the page on form submission."
  },
  {
    id: 4,
    question: "Which method is used to update state in a class component?",
    options: ["this.updateState()", "this.setState()", "this.changeState()", "this.modifyState()"],
    correctAnswer: 1,
    rationale: "Class components use this.setState() to schedule an update to the component's state object."
  },
  {
    id: 5,
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java XML"],
    correctAnswer: 0,
    rationale: "JSX stands for JavaScript XML. It allows us to write HTML-like syntax directly within JavaScript."
  }
];
