import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Avatar from './components/Avatar'; 
import Home from './pages/Home'; 
const root = ReactDOM.createRoot(document.getElementById('root'));

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Avatar />;
  } else {
    return <App />;
  }
}

root.render(
  <React.StrictMode>
    <LoadingScreen />
  </React.StrictMode>
);
