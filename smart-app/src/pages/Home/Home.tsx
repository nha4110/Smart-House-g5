import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Smart Home React App</h1>
      </header>

      <main className="home-main">

        <div className="info-box">
          <h2>📘 What is React?</h2>
          <p>
            React is a JavaScript library for building user interfaces. It lets you
            create reusable UI components and efficiently update the DOM.
          </p>
          <p>
            To get started, edit files in the <code>src/</code> folder. Components like this one live in
            <code>src/pages/</code>.
          </p>
        </div>

        <div className="info-box test-box">
          <h2>🧪 Test Page</h2>
          <p>You can edit and do anything to this page. Feel free to experiment!</p>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Smart Home Group 5</p>
      </footer>
    </div>
  );
};

export default Home;
