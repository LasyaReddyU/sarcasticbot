import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import '../App.css';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [modeSelected, setModeSelected] = useState(null);
  const [pdfText, setPdfText] = useState(''); // New state for pdfText

  const navigate = useNavigate();

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUploaded(true);

      // Process the PDF immediately after upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/upload-document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        // Set the pdfText from the processed PDF data
        setPdfText(data.pdfText); // Assuming 'pdfText' is part of the response

        // Store the processed data in localStorage or state management solution
        localStorage.setItem('quizData', JSON.stringify(data));
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to process document. Please try again.');
        setPdfFile(null);
        setPdfUploaded(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleModeSelection = (mode) => {
    setModeSelected(mode);
  };

  const handleProceedToPractice = () => {
    if (pdfUploaded || selectedOption === 'topic') {
      // Generate or retrieve topic-specific data if selectedOption is 'topic'
      const topicData = selectedOption === 'topic' ? generateTopicQuizData(searchText) : null; // Replace with your logic
  
      navigate('/practice', {
        state: {
          fromHome: true,
          fileUploaded: pdfUploaded,
          pdfFile,
          pdfText,
          topicData // Pass topic-specific data
        }
      });
    } else {
      alert("Please upload a PDF or select a topic first.");
    }
  };
  
  const handleProceedToLearn = () => {
    if (pdfUploaded || selectedOption === 'topic') {
      navigate('/learn', { state: { pdfFile, pdfText } });
    } else {
      alert("Please upload a PDF or select a topic first.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    // Update pdfText with the search input
    setPdfText(searchText); // Passing search input to pdfText

    // You can replace this alert with the logic to fetch questions or summary based on searchText
    alert(`Search for: ${searchText}`);
  };

  const generateTopicQuizData = (topic) => {
    // Your logic to generate topic-specific quiz data here
    // For example, you could call an API or fetch predefined data
    return {
      topic,
      questions: [
        {
          question: `What is related to ${topic}?`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
        },
        {
          question: `Explain the concept of ${topic}.`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'B',
        },
      ],
    };
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', textAlign: 'center', backgroundColor: '#4A90E2', height: '100vh', color: 'white', alignItems: 'center' }}>
        <Avatar />
      </div>

      <div style={{ width: '60%', padding: '2.0rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {!modeSelected ? (
          <>
            <h2 className='fancy-text'>I want to</h2>
            <div style={{ display:'block', margin: '0 auto' }}>
              <button className='button' onClick={() => handleModeSelection('learn')} style={{ margin: '1.0rem' }}>Learn Mode</button>
              <button className='button' onClick={() => handleModeSelection('practice')} style={{ margin: '1.0rem' }}>Practice Mode</button>
            </div>
          </>
        ) : (
          <div>
            <h3 className='fancy-text'>
              {modeSelected === 'practice' ? 'Choose Content for Practice' : 'Choose Content for Learning'}
            </h3>
            <div style={{ display:'block', margin: '4.0rem 10.0rem' }}>
              <button className='button' onClick={() => setSelectedOption('pdf')} style={{ margin: '1.0rem' }}>Upload PDF</button>
              <button className='button' onClick={() => setSelectedOption('topic')} style={{ margin: '1.0rem' }}>Start by Topic</button>
            </div>

            {selectedOption === 'pdf' && (
              <div style={{ display:'block', margin: '0rem 15rem' }}>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handlePdfUpload}
                  disabled={pdfUploaded} 
                />
                {pdfUploaded && <p className="text-green-500">✓ PDF uploaded successfully</p>}
              </div>
            )}

            {selectedOption === 'topic' && (
              <div>
                <input 
                  type="text" 
                  placeholder="Search for a topic" 
                  value={searchText}
                  onChange={handleSearchChange}
                  style={{ padding: '0.5rem', fontSize: '1rem', margin: '1rem' }}
                />
                <button 
                  className='button' 
                  onClick={handleSearch} 
                  style={{ margin: '1rem' }}
                >
                  Search
                </button>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              {modeSelected === 'practice' && (
                <button 
                  style={{ display:'block', margin: '0 auto' }} 
                  className='button' 
                  onClick={handleProceedToPractice}
                  disabled={!pdfUploaded && selectedOption !== 'topic'}
                >
                  Start Practice
                </button>
              )}
              {modeSelected === 'learn' && (
                <button 
                  style={{ display:'block', margin: '0 auto' }} 
                  className='button' 
                  onClick={handleProceedToLearn}
                  disabled={!pdfUploaded && selectedOption !== 'topic'}
                >
                  Start Learning
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
