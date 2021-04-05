
///////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2021, Perry L Miller IV
//  All rights reserved.
//  MIT License: https://opensource.org/licenses/mit-license.html
//
///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
//  Read the given media files and update the database.
//
////////////////////////////////////////////////////////////////////////////////

// const fs = require ( "fs" );
// const sqlite = require ( "sqlite3" );
const yargs = require ( "yargs/yargs" );
// const { getProperty, requireProperty } = require ( "property-tools" );


////////////////////////////////////////////////////////////////////////////////
//
//  Get the arguments.
//
////////////////////////////////////////////////////////////////////////////////

const argv = yargs ( process.argv.slice ( 2 ) )
  .usage ( "Usage: $0 -d <database> -f <folder 1> ... -f [folder N]" )
  .alias ( "v", "version" )
  .describe ( "d", "Database file name" )
  .alias ( "d", "database" )
  .describe ( "f", "Folder containing media files" )
  .alias ( "f", "folder" )
  .demandOption ( [ "d", "f" ] )
  .help ( "h" )
  .alias ( "h", "help" )
  .argv;
