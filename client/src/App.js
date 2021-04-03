
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

import React from "react";
import { getProperty } from "property-tools";
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


class App extends React.Component
{
  constructor ( props )
  {
    super ( props );
    this.state = {
      connection: null
    };
  }

  componentDidMount()
  {
    this.setState ( { connection: makeConnection() } );
  }

  componentWillUnmount()
  {
    if ( null != this.state.connection )
    {
      this.state.connection.close();
    }
    this.setState ( { connection: null } );
  }

  render()
  {
    const ws = this.state.connection;
    const isConnected = ( ( null == ws ) ? false : ( 1 === ws.readyState ) );
    return (
      <div className="App">
        <header className="App-header">
          <p>Connected? { ( isConnected ? "no" : "yes" ) }</p>
        </header>
      </div>
    );
  }
}

export default App;
