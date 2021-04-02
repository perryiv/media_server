import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

function App()
{
  const [ count, setCount ] = useState ( 0 );

  useEffect ( () =>
  {
    document.title = `You clicked ${count} times`;
  } );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload wow.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </header>
    </div>
  );
}

export default App;
