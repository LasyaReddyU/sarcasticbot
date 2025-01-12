import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import correctAnimation from '../lotties/correct.json';
import wrongAnimation from '../lotties/wrong.json';
import thinkingAnimation from '../lotties/sarca.json';
import Avatar from '../components/Avatar';

const SpeechBubble = ({ message, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[999] animate-fadeIn" />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] max-w-[80%] w-auto flex flex-col items-center animate-popIn">
      <div className="w-[200px] h-[200px] -mb-8 animate-float z-[1001]">
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
      <div className="relative bg-red-500 p-8 rounded-3xl shadow-lg">
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500" />
        <div className="text-2xl font-bold text-white text-center mb-4 break-words">
          {message}
        </div>
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 text-base bg-white text-red-500 font-bold rounded-full hover:scale-105 transition-transform"
          >
            I'll Try Harder...
          </button>
        </div>
      </div>
    </div>
  </>
);

const PracticeMode = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSarcasticPopup, setShowSarcasticPopup] = useState(false);
  const [sarcasticReply, setSarcasticReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [finalScore, setFinalScore] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showOutOfLivesPopup, setShowOutOfLivesPopup] = useState(false);

  const navigate = useNavigate();

  const sarcasticReplies = [
    "That's about as correct as saying the Earth is flat.",
    "Nice try! But SQL dooesnt work like that xD",,
    "Well, you got the syntax right... just not the logic.",
    "SQL doesnot work on magic, my friend.",
    "Amazing! You managed to ignore everything in the document!",

  ];

  const scoreComments = {
    0: "Wow, a perfect zero! You've truly mastered the art of not learning!",
    5: "Half right! Perfectly balanced between knowledge and ignorance.",
    10: "Perfect score! What, did you write this document yourself or something?"
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const storedData = localStorage.getItem('quizData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setQuestions(parsedData.questions || []);
        } else {
          alert('No data found. Please go back and upload a PDF or select a topic.');
        }
      } catch (error) {
        console.error('Error loading quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnswer = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer.trim().toLowerCase();
    const userAnswerNormalized = selectedAnswer.trim().toLowerCase();

    const correct = userAnswerNormalized === correctAnswer;
    setUserAnswer(selectedAnswer);
    setIsCorrect(correct);

    if (correct) {
      setFeedback(`Correct! ${questions[currentQuestionIndex].description || ''}`);
      setProgress((prev) => Math.min(100, ((currentQuestionIndex + 1) / questions.length) * 100));
    } else {
      setFeedback(`Incorrect! The correct answer was: "${questions[currentQuestionIndex].correct_answer}".`);
      setLives((prev) => prev - 1);
      const sarcasticMessage = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)];
      setSarcasticReply(sarcasticMessage);
      setShowSarcasticPopup(true);
    }

    // If lives reach 0, show the out-of-lives pop-up
    if (lives - 1 === 0) {
      setShowOutOfLivesPopup(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setFeedback('');
      setIsCorrect(null);
      setShowSarcasticPopup(false);
      setUserAnswer('');
    } else {
      setFeedback("You've completed all questions!");
      const score = Math.round((lives / 5) * 10);
      setFinalScore(score);
      setQuizCompleted(true);
    }
  };

  const handleQuit = () => {
    navigate('/home');
  };

  const handleGoToLearnMode = () => {
    setShowOutOfLivesPopup(false);
    navigate('/learn'); // Navigate to Learn Mode when lives are over
  };

  const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: isCorrect ? correctAnimation : wrongAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex h-screen relative">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="w-[35%] text-center bg-blue-500 h-screen text-white items-center">
            <Avatar />
          </div>
          <div className="p-0 text-center w-[65%]">
            <button
              onClick={handleQuit}
              className="absolute top-5 right-5 bg-red-500 text-white p-2 rounded-full"
            >
              Quit
            </button>
            <div className="mb-5">
              <div className="w-full h-2.5 bg-gray-200 mb-2.5">
                <div 
                  className="h-full bg-green-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mb-2.5">
                <span className="text-2xl">❤️ {lives}</span>
              </div>
            </div>
            {questions[currentQuestionIndex] && !quizCompleted && (
              <>
                <h3 className="question-text">
                  {questions[currentQuestionIndex].question}
                </h3>
                <div className="mb-5 space-y-2">
                  {questions[currentQuestionIndex].options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="option-button w-full p-3 text-left rounded-lg border hover:bg-gray-50"
                        disabled={!!userAnswer}
                      >
                        <span className="font-medium mr-2">{letter}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {showSarcasticPopup && (
              <SpeechBubble
                message={sarcasticReply}
                onClose={() => setShowSarcasticPopup(false)}
              />
            )}
            {feedback && (
              <div className="fixed bottom-0 w-[65%] bg-black text-white p-4 flex items-center justify-around gap-4">
                <div className="w-[6rem] h-[6rem]">
                  <Lottie options={lottieOptions} height={90} width={90} />
                </div>
                <p className="text-2xl flex-1 leading-relaxed m-0 font-medium">
                  {feedback}
                </p>
              </div>
            )}
            {quizCompleted && finalScore !== null && (
              <div className="fixed bottom-0 w-[65%] bg-black text-white p-4 flex items-center justify-around gap-4">
                <div className="text-2xl font-bold">Your Final Score: {finalScore}/10</div>
                <div>{scoreComments[finalScore]}</div>
              </div>
            )}
            {currentQuestionIndex < questions.length - 1 && !quizCompleted && feedback && (
              <button
                onClick={handleNextQuestion}
                className="mt-5 px-5 py-2.5 text-base rounded-lg bg-green-500 text-white cursor-pointer hover:bg-green-600"
              >
                Next Question
              </button>
            )}
          </div>
        </>
      )}

      {showOutOfLivesPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[999] animate-fadeIn">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] max-w-[80%] w-auto flex flex-col items-center animate-popIn">
            <div className="w-[200px] h-[200px] -mb-8 animate-float z-[1001]">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: wrongAnimation,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice',
                  },
                }}
                height={200}
                width={200}
              />
            </div>
            <div className="relative bg-red-500 p-8 rounded-3xl shadow-lg">
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500" />
              <div className="text-2xl font-bold text-white text-center mb-4 break-words">
                Oops! You ran out of lives. Time to switch to Learn Mode.
              </div>
              <div className="text-center">
                <button
                  onClick={handleGoToLearnMode}
                  className="px-6 py-3 text-base bg-white text-red-500 font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Take me to Learn Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeMode;
