import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Avatar from '../components/Avatar';
import '../App.css';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [pdfUploaded, setPdfUploaded] = useState(false); 
  const [inPracticeMode, setInPracticeMode] = useState(false); // State to track if we are in practice mode
  const navigate = useNavigate(); 
  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfText(`Text extracted from: ${file.name}`);
      setPdfUploaded(true);  
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleTopicSelection = (topic) => {
    console.log(`Topic selected: ${topic}`);
  };

  const handleModeSelection = (mode) => {
    if (mode === 'practice') {
      if (pdfUploaded) {
        navigate('/practice');
      } else {
        alert("Please upload a PDF or select a topic first.");
      }
    }
    console.log(`Mode selected: ${mode}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', textAlign: 'center', backgroundColor: '#4A90E2', height: '100vh', color: 'white', alignItems: 'center' }}>
        <Avatar />
      </div>

      <div style={{ width: '60%', padding: '2.0rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {!pdfUploaded ? (
          <>
            <h2 className='fancy-text'>I want to</h2>
            <div style={{ margin: '20px' }}>
              <button className='button' onClick={() => setSelectedOption('pdf')} style={{ margin: '1.0rem' }}>Upload PDF</button>
              <button className='button' onClick={() => setSelectedOption('topic')} style={{ margin: '1.0rem' }}>Start by Topic</button>
            </div>

            {/* If user chooses to upload PDF */}
            {selectedOption === 'pdf' && (
              <div>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
                {pdfText && <p>{pdfText}</p>}
              </div>
            )}

            {/* If user chooses to select a topic */}
            {selectedOption === 'topic' && (
              <div>
                <button className='button' onClick={() => handleTopicSelection('Math')}>Math</button>
                <button className='button' onClick={() => handleTopicSelection('Science')}>Science</button>
                {/* Add more topics as needed */}
              </div>
            )}
          </>
        ) : (
          <div>
            <h3 className='fancy-text'>Choose Mode</h3>
            <button className='button' onClick={() => handleModeSelection('learn')} style={{ margin: '20px' }}>Learn Mode</button>
            <button className='button' onClick={() => handleModeSelection('practice')} style={{ margin: '20px' }}>Practice Mode</button>
          </div>
        )}
      </div>
    </div>
  );
}
