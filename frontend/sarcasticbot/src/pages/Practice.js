import React, { useState, useEffect } from 'react';
import Avatar from '../components/Avatar';
import '../App.css';
import Lottie from 'react-lottie';
import correctAnimation from '../lotties/correct.json';
import wrongAnimation from '../lotties/wrong.json';

export default function PracticeMode() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [userAnswer, setUserAnswer] = useState(''); 
  const [isCorrect, setIsCorrect] = useState(null); 

  // Sample question bank
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
      description: "Paris is the capital city of France, known for its art, fashion, and culture."
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Jupiter",
      description: "Jupiter is the largest planet in our solar system, known for its Great Red Spot."
    },
    
  ];

  // Handle answer selection
  const handleAnswer = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
    const correct = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setFeedback(`Correct! ${questions[currentQuestionIndex].description}`);
      setProgress(progress + 10); // Increment progress
    } else {
      setFeedback(`Incorrect! ${selectedAnswer} is not correct.`);
      setLives(lives - 1);
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback('');
      setIsCorrect(null); // Reset feedback for the next question
    } else {
      setFeedback("You’ve completed the practice session!");
    }
    setUserAnswer(''); // Reset the selected answer for next question
  };

  // Check if game over (lives run out)
  useEffect(() => {
    if (lives <= 0) {
      setFeedback("Game Over! Please switch to Learn Mode.");
    }
  }, [lives]);

  const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: isCorrect ? correctAnimation : wrongAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Avatar Sidebar */}
      <div style={{ width: '35%', textAlign: 'center', backgroundColor: '#4A90E2', height: '100vh', color: 'white', alignItems: 'center' }}>
        <Avatar />
      </div>

      {/* Main Content */}
      <div style={{ padding: '0rem', textAlign: 'center', width: '65%' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#ccc', marginBottom: '10px' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#4caf50' }}></div>
          </div>

          {/* Lives Display */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>❤️ {lives}</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="question-text">
          {questions[currentQuestionIndex].question}
        </h3>

        {/* Options */}
        <div style={{ marginBottom: '20px' }}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button 
              key={index} 
              onClick={() => handleAnswer(option)}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback Footer */}
        {feedback && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            width: '65%',
            backgroundColor: '#000',
            color: '#fff',
            padding: '1rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '10px',
          }}>
            <div style={{ width: '50px', height: '50px' }}>
              <Lottie options={lottieOptions} height={50} width={50} />
            </div>
            <p>{feedback}</p>
          </div>
        )}

        {/* Next Question Button */}
        {currentQuestionIndex < questions.length - 1 && feedback && (
          <button
            onClick={handleNextQuestion}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
