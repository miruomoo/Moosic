//Importing react files
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './open';

//Creating react root 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="intro-open">
      <h1>Toufify </h1>
      <p>A short “about” blurb that says what the site offers</p>
      <a href="/login">Login</a>
    </div>
    <App/>
  </React.StrictMode>
);





