
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
const { getProperty, requireProperty } = require ( "property-tools" );


////////////////////////////////////////////////////////////////////////////////
//
//  Counter for the socket connections.
//
////////////////////////////////////////////////////////////////////////////////

let nextID = 0;


////////////////////////////////////////////////////////////////////////////////
//
//  Get the arguments.
//
////////////////////////////////////////////////////////////////////////////////

const port = parseInt ( getProperty ( process.argv, 2, 8080 ) );
console.log ( "Using port", port );


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

server.on ( "connection", function connection ( socket )
{
  // Make sure this property is not taken.
  if ( "isAlive" in socket )
  {
    throw new Error ( "Use a property name other than isAlive" );
  }

  // Initialize.
  socket.id = nextID++;
  socket.isAlive = true;

  console.log ( "In connection handler, socket id:", socket.id );

  // This gets called when the client responds to a ping.
  socket.on ( "pong", function()
  {
    console.log ( "In pong() handler, socket id:", this.id );
    this.isAlive = true;
  }.bind ( socket ) );

  // This gets called when the client is closed.
  socket.on ( "close", function()
  {
    console.log ( "In close() handler, socket id:", this.id );
    this.isAlive = false;
  }.bind ( socket ) );

  // This gets called when we receive a message.
  socket.on ( "message", function ( message )
  {
    console.log ( "Received message:", message );
  } );

  // Let the client know it is connected.
  socket.send ( "Connected to the server at " + Date.now() );
} );


////////////////////////////////////////////////////////////////////////////////
//
//  A function that does nothing.
//
////////////////////////////////////////////////////////////////////////////////

function doNothing()
{
}


////////////////////////////////////////////////////////////////////////////////
//
//  Ping all the clients.
//
////////////////////////////////////////////////////////////////////////////////

function pingAllClients()
{
  // For each client ...
  server.clients.forEach ( function each ( socket )
  {
    console.log ( "In pingAllClients(), socket id:", socket.id );

    // Is it no longer living?
    if ( false === requireProperty ( socket, "isAlive" ) )
    {
      console.log ( "In pingAllClients(), terminating" );

      // It's not alive so terminate it.
      socket.terminate();
    }

    // Otherwise, it is alive.
    else
    {
      console.log ( "In pingAllClients(), still alive" );

      // This will get reset to true in the "pong" handler.
      socket.isAlive = false;

      // Ping the client. If everything is connected this will result
      // in the "pong" handler being called.
      socket.ping ( doNothing );
    }
  } );
}


////////////////////////////////////////////////////////////////////////////////
//
//  Ping all the clients every few seconds.
//
////////////////////////////////////////////////////////////////////////////////

const interval = setInterval ( pingAllClients, 3000 );


////////////////////////////////////////////////////////////////////////////////
//
//  TODO: Is this function ever called?
//
////////////////////////////////////////////////////////////////////////////////

server.on ( "close", function close()
{
  // We don't want to ping the clients any more.
  clearInterval ( interval );

  console.log ( "In server close handler" );
} );
