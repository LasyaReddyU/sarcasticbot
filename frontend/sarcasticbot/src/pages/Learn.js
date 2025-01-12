import { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Lottie from 'react-lottie';
import animationData from '../lotties/loading.json'; // Import Lottie animation for loading state

const Learn = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const supportedFileTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const location = useLocation();
  const pdfFile = location.state?.pdfFile;

  useEffect(() => {
    if (pdfFile) {
      setFile(pdfFile);
      setLoading(true);

      const formData = new FormData();
      formData.append('file', pdfFile);

      fetch('http://localhost:8000/upload-document', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          setSummary(data.summary);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to process document. Please try again.');
          setLoading(false);
        });
    }
  }, [pdfFile]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file type is supported
    if (!supportedFileTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

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
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim() === '') return;
    
    setConversation([...conversation, { user: userInput }]);
    setUserInput('');
  };

  return (
    <div className="flex font-sans bg-gray-100">
      {/* Sidebar Section (35%) */}
      <div className="w-1/3 text-center bg-[#4A90E2] h-screen text-white flex flex-col items-center justify-between py-6">
        <Avatar />
        <div className="text-lg font-semibold">Learn Mode</div>
      </div>

      {/* Main Content Section (65%) */}
      <div className="w-2/3 p-10 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#333] font-serif">Document Summary</h1>

        {/* File Upload Section */}
        {!file && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white shadow-md">
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
              <Upload className="w-16 h-16 text-gray-500" />
              <span className="text-gray-600 text-lg">
                {file ? file.name : 'Upload your document (PDF, DOC, DOCX, or TXT)'}
              </span>
            </label>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <Lottie options={{
              animationData: animationData,
              loop: true,
              autoplay: true
            }} height={100} width={100} />
            <p className="text-lg text-gray-600 mt-4">Processing your document...</p>
          </div>
        )}

        {/* Summary Section with Line-by-Line Animation */}
        {summary && (
          <div className="bg-white p-8 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-[#4A90E2]">
              <FileText className="w-6 h-6 mr-2" />
              Summary
            </h2>
            <div className="space-y-4">
              {/* Animated line-by-line display */}
              {summary.split('\n').map((line, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-gray-700 opacity-0 animate-lineFadeIn"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <p className="text-gray-700">{line}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chatbar / Searchbar at the end of the summary */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <div className="text-gray-600 text-sm mb-4">Ask me about the summary...</div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Type your question..."
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#4A90E2] text-white rounded-md"
            >
              Send
            </button>
          </div>

          {/* Conversation Display */}
          <div className="mt-4">
            {conversation.map((msg, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <div className="bg-gray-200 p-3 rounded-md text-sm text-gray-800">
                  {msg.user}
                </div>
                {/* Optional: Display assistant response here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
