import React from 'react';
import logo from './logo.svg';
import './App.css';
import { UserFeed } from './UserFeed';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <UserFeed userID={'0'} filter={'date'}/>
      </header>
    </div>
  );
}

export default App;
