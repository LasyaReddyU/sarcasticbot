import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import '../App.css';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);  // Store the PDF file
  const [pdfText, setPdfText] = useState('');    // Store the summarized text
  const [pdfUploaded, setPdfUploaded] = useState(false);  // Track if the PDF is uploaded
  const [modeSelected, setModeSelected] = useState(null); // Track selected mode

  const navigate = useNavigate();

  // Handle the PDF upload and store the file in state
  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file); // Store the file
      setPdfUploaded(true); // Set PDF uploaded state
      console.log(file); // Check if the file is set correctly
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Handle mode selection (learn or practice)
  const handleModeSelection = (mode) => {
    setModeSelected(mode); // Set the mode (learn or practice)
  };

  // Handle navigating to the respective mode after selecting PDF or topic
  const handleProceedToPractice = () => {
    if (pdfUploaded || selectedOption === 'topic') {
      navigate('/practice');
    } else {
      alert("Please upload a PDF or select a topic first.");
    }
  };

  // Handle mode selection for Learn Mode
  const handleProceedToLearn = () => {
    if (pdfUploaded || selectedOption === 'topic') {
      navigate('/learn');
    } else {
      alert("Please upload a PDF or select a topic first.");
    }
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
            <h3 className='fancy-text'>{modeSelected === 'practice' ? 'Choose Content for Practice' : 'Choose Content for Learning'}</h3>
            <div style={{ display:'block', margin: '4.0rem 10.0rem' }}>
              <button className='button' onClick={() => setSelectedOption('pdf')} style={{ margin: '1.0rem' }}>Upload PDF</button>
              <button className='button' onClick={() => setSelectedOption('topic')} style={{ margin: '1.0rem' }}>Start by Topic</button>
            </div>

            {/* If user chooses to upload PDF */}
            {selectedOption === 'pdf' && (
              <div style={{ display:'block', margin: '0rem 15rem' }}>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
              </div>
            )}

            {/* If user chooses to select a topic */}
            {selectedOption === 'topic' && (
              <div>
                <button className='button'>Math</button>
                <button className='button'>Science</button>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              {/* Proceed based on mode */}
              {modeSelected === 'practice' && (
                <button style={{ display:'block', margin: '0 auto' }} className='button' onClick={handleProceedToPractice}>Start Practice</button>
              )}
              {modeSelected === 'learn' && (
                <button style={{ display:'block', margin: '0 auto' }} className='button' onClick={handleProceedToLearn}>Start Learning</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
