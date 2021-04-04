
///////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2019, Perry L Miller IV
//  All rights reserved.
//  MIT License: https://opensource.org/licenses/mit-license.html
//
///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
//  Module that makes a connection to a WebSocket server.
//
////////////////////////////////////////////////////////////////////////////////

const { getProperty, requireProperty } = require ( "property-tools" );


////////////////////////////////////////////////////////////////////////////////
//
//  Constructor.
//
////////////////////////////////////////////////////////////////////////////////

const Socket = function ( input )
{
  this._connection = null;
  this._protocol = getProperty ( input, "protocol", "ws://" );
  this._hostname = getProperty ( input, "hostname", window.location.hostname );
  this._port = getProperty ( input, "port", 8080 );
  this._onOpen = getProperty ( input, "onOpen", null );
  this._onClose = getProperty ( input, "onClose", null );
  this._onError = getProperty ( input, "onError", null );
  this._onMessage = getProperty ( input, "onMessage", null );
  this._shouldClose = false;
};


////////////////////////////////////////////////////////////////////////////////
//
//  Destroy the socket object.
//
////////////////////////////////////////////////////////////////////////////////

Socket.prototype.destroy = function()
{
  // Make sure we're closed.
  this.close();

  // We're done with these.
  this._connection = null;
  this._protocol = null;
  this._hostname = null;
  this._port = null;
  this._onOpen = null;
  this._onClose = null;
  this._onError = null;
  this._onMessage = null;
  this._shouldClose = null;
};


////////////////////////////////////////////////////////////////////////////////
//
//  Helper function.
//
////////////////////////////////////////////////////////////////////////////////

function callFunction ( fun, data )
{
  if ( fun )
  {
    return fun ( data );
  }
  return null;
}


////////////////////////////////////////////////////////////////////////////////
//
//  Open the connection to the server.
//
////////////////////////////////////////////////////////////////////////////////

Socket.prototype.open = function()
{
  // Shortcuts.
  const protocol = requireProperty ( this, "_protocol" );
  const hostname = requireProperty ( this, "_hostname" );
  const port = requireProperty ( this, "_port" );
  const onOpen = requireProperty ( this, "_onOpen" );
  const onClose = requireProperty ( this, "_onClose" );
  const onError = requireProperty ( this, "_onError" );
  const onMessage = requireProperty ( this, "_onMessage" );

  // Do nothing if we're already open.
  if ( this._connection )
  {
    return;
  }

  // Make the WebSocket object and hook up the callbacks.
  let ws = new WebSocket ( protocol + hostname + ":" + port );

  // Called when the socket opens.
  ws.onopen = function ( event )
  {
    this._connection = ws;
    callFunction ( onOpen, event );
  }.bind ( this );

  // Called when the socket closes.
  ws.onclose = function close ( event )
  {
    // Always reset this.
    this._connection = null;

    // Are we supposed to close?
    if ( false === this._shouldClose )
    {
      this._scheduleOpen();
    }

    // Otherwise, we are supposed to close.
    else
    {
      callFunction ( onClose, event );
    }
  }.bind ( this );

  // Called when there is an error.
  ws.onerror = function ( event )
  {
    callFunction ( onError, event );
  };

  // Called when we receive a message.
  ws.onmessage = function incoming ( event )
  {
    callFunction ( onMessage, event );
  };
}


////////////////////////////////////////////////////////////////////////////////
//
//  Schedule an attempt to open the socket.
//
////////////////////////////////////////////////////////////////////////////////

Socket.prototype._scheduleOpen = function()
{
  // Try to open again.
  setTimeout ( function()
  {
    this.open();
  }.bind ( this ), 1000 );
}


////////////////////////////////////////////////////////////////////////////////
//
//  Close the connection to the server.
//
////////////////////////////////////////////////////////////////////////////////

Socket.prototype.close = function()
{
  // Shortcut.
  let connection = this._connection;

  // Do nothing if we're already closed.
  if ( !connection )
  {
    return;
  }

  // If we get to here then close the connection.

  // We are supposed to close.
  this._shouldClose = true;

  // Do this before we close below.
  this._connection = null;

  // Close it.
  connection.close();
}


////////////////////////////////////////////////////////////////////////////////
//
//  Return true if the connection is open.
//
////////////////////////////////////////////////////////////////////////////////

Socket.prototype.isOpen = function()
{
  const connection = this._connection;
  return ( ( connection ) ? ( 1 === connection.readyState ) : false );
}


////////////////////////////////////////////////////////////////////////////////
//
//  The end of this module.
//
////////////////////////////////////////////////////////////////////////////////

module.exports = Socket;
