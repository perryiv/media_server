
///////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2019, Perry L Miller IV
//  All rights reserved.
//  MIT License: https://opensource.org/licenses/mit-license.html
//
///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
//  Main file for the server.
//
////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { getProperty } from "property-tools";

import logo from "./logo.svg";
import "./App.css";


function makeConnection()
{
  const ws = new WebSocket ( "ws://" + window.location.hostname + ":" + 8080 );

  ws.onopen = function ( event )
  {
    console.log ( "WebSocket is open now:", event );
    ws.send ( Date.now() );
  };

  ws.onclose = function close ( event )
  {
    console.log ( "WebSocket is disconnected:", event );
  };

  ws.onerror = function ( event )
  {
    console.error ( "WebSocket error observed:", event );
  };

  ws.onmessage = function incoming ( event )
  {
    const data = getProperty ( event, "data", null );
    console.log ( "WebSocket message received:", data );
  };

  return ws;
}


function App()
{
  const [ connection, setConnection ] = useState ( null );

  useEffect ( () =>
  {
    const ws = makeConnection();
    setConnection ( ws );

    return function cleanup()
    {
      console.error ( "In cleanup()" );
      ws.close();
    };
  }, [] );

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
        <p>Connected? { ( ( null != connection ) ? "yes" : "no" ) }</p>
      </header>
    </div>
  );
}

export default App;
