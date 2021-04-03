
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

const WebSocket = require ( "ws" );
const { getProperty } = require ( "property-tools" );


////////////////////////////////////////////////////////////////////////////////
//
//  Get the arguments.
//
////////////////////////////////////////////////////////////////////////////////

const port = parseInt ( getProperty ( process.argv, 2, 8080 ) );
console.log ( "Port:", port );


////////////////////////////////////////////////////////////////////////////////
//
//  Make the server.
//
////////////////////////////////////////////////////////////////////////////////

const server = new WebSocket.Server ( {
  port: port,
  perMessageDeflate: false
} );


////////////////////////////////////////////////////////////////////////////////
//
//  Called when there is a connection.
//
////////////////////////////////////////////////////////////////////////////////

server.on ( "connection", function connection ( ws )
{
  ws.on ( "message", function incoming ( message )
  {
    console.log ( "received: %s", message );
  } );

  ws.send ( "This is sent by the server" );
} );


////////////////////////////////////////////////////////////////////////////////
//
//  Called when the connection is closed.
//
////////////////////////////////////////////////////////////////////////////////

server.on ( "close", function close()
{
  console.log ( "Connection closed" );
} );