import React, { useState, useEffect } from 'react';
import Avatar from '../components/Avatar';
import '../App.css';
import Lottie from 'react-lottie';
import correctAnimation from '../lotties/correct.json';
import wrongAnimation from '../lotties/wrong.json';
import thinkingAnimation from '../lotties/sarca.json';

const SpeechBubble = ({ message, onClose }) => {
  return (
    <>
      {/* Blurred Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 999,
        animation: 'fadeIn 0.3s ease-out'
      }} />

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        maxWidth: '80%',
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'popIn 0.3s ease-out',
      }}>
        {/* Floating Lottie Animation */}
        <div style={{
          width: '200px',
          height: '200px',
          marginBottom: '-30px',
          animation: 'float 3s ease-in-out infinite',
          zIndex: 1001,
        }}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: thinkingAnimation,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height={200}
            width={200}
          />
        </div>

        {/* Speech Bubble Container */}
        <div style={{
          position: 'relative',
          backgroundColor: '#FF4B4B',
          padding: '2rem',
          borderRadius: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}>
          {/* Bottom Triangle */}
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '20px solid #FF4B4B',
          }} />
          
          {/* Message Text */}
          <div style={{ 
            fontSize: '1.75rem',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem',
            wordBreak: 'break-word'
          }}>
            {message}
          </div>

          {/* Close Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#FF4B4B',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s ease',
                ':hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              I'll Try Harder...
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function PracticeMode() {
  // ... [Previous state declarations remain the same]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [userAnswer, setUserAnswer] = useState(''); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [sarcasticReply, setSarcasticReply] = useState('');
  const [showSarcasticPopup, setShowSarcasticPopup] = useState(false);

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

  // Function to fetch sarcastic reply
  const fetchSarcasticReply = async () => {
    try {
      const response = await fetch('/api/sarcastic');
      const data = await response.json();
      setSarcasticReply(data.reply);
      setShowSarcasticPopup(true);
    } catch (error) {
      console.error('Error fetching sarcastic reply:', error);
      setSarcasticReply('Oh wow, that was... spectacularly incorrect! Want to try that again with your brain turned on?');
      setShowSarcasticPopup(true);
    }
  };

  // Handle answer selection
  const handleAnswer = async (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
    const correct = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setFeedback(`Correct! ${questions[currentQuestionIndex].description}`);
      setProgress(progress + 10);
      setShowSarcasticPopup(false);
    } else {
      setFeedback(`Incorrect! ${selectedAnswer} is not correct.`);
      setLives(lives - 1);
      setWrongAnswers(wrongAnswers + 1);
      await fetchSarcasticReply();
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback('');
      setIsCorrect(null);
      setShowSarcasticPopup(false);
    } else {
      setFeedback("You've completed the practice session!");
    }
    setUserAnswer('');
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
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
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

        {/* Sarcastic Speech Bubble Popup */}
        {showSarcasticPopup && (
          <SpeechBubble 
            message={sarcasticReply}
            onClose={() => setShowSarcasticPopup(false)}
          />
        )}

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
            gap: '1.0rem',
          }}>
            <div style={{ width: '125px', height: '125px' }}>
              <Lottie options={lottieOptions} height={125} width={125} />
            </div>
            <p style={{ 
              fontSize: '1.5rem',
              flex: 1,
              lineHeight: '1.4',
              margin: 0,
              fontWeight: '500'
            }}>
              {feedback}
            </p>
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

      {/* Add CSS animation */}
      <style>{`
        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}