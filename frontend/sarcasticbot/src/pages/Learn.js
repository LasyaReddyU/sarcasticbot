import { useState, useCallback } from 'react';
import { Upload, FileText, Award } from 'lucide-react';

const SarcasticQuizApp = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSummary(data.summary);
      setQuestions(data.questions);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process document. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswerSubmit = useCallback((answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  }, [currentQuestion, questions, score, selectedAnswer]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Sarcastic Document Quiz Bot</h1>

      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.pdf,.doc,.docx"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer space-y-4"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <span className="text-gray-500">
            {file ? file.name : 'Upload your document (PDF, DOC, DOCX, or TXT)'}
          </span>
        </label>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processing your document...</p>
        </div>
      )}

      {/* Summary Section */}
      {summary && !showScore && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* Quiz Section */}
      {questions.length > 0 && !showScore && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4 text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          
          <h3 className="text-lg font-medium mb-4">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === letter;
              const isCorrect = letter === questions[currentQuestion].correct_answer;
              
              let buttonClass = "w-full text-left p-3 rounded-lg border ";
              if (selectedAnswer !== null) {
                if (isCorrect) {
                  buttonClass += "bg-green-100 border-green-500";
                } else if (isSelected) {
                  buttonClass += "bg-red-100 border-red-500";
                }
              } else {
                buttonClass += "hover:bg-gray-50 border-gray-200";
              }

              return (
                <button
                  key={letter}
                  onClick={() => handleAnswerSubmit(letter)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Score Section */}
      {showScore && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Final Score</h2>
          <p className="text-4xl font-bold text-blue-600 mb-4">
            {score} / {questions.length}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Another Document
          </button>
        </div>
      )}
    </div>
  );
};

export default SarcasticQuizApp;