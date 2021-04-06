
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

const fs = require ( "fs" );
const FileHound = require ( "filehound" );
const lodash = require ( "lodash" );
const sqlite = require ( "sqlite3" ).verbose();
const yargs = require ( "yargs/yargs" );
const { getProperty, requireProperty } = require ( "property-tools" );


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


////////////////////////////////////////////////////////////////////////////////
//
//  Process the folder.
//
////////////////////////////////////////////////////////////////////////////////

function processFolder ( input )
{
  // Get the input.
  const folder = requireProperty ( input, "folder" );
  let answer = requireProperty ( input, "paths" );

  // Look for all the files and return a promise.
  let promise = FileHound.create()
  .paths ( folder )
  .find();

  // This gets called when it's done.
  promise = promise.then ( function ( paths )
  {
    // Append the elements of the array, not the array itself.
    answer.push ( ...paths );
  } );

  // Return the promise.
  return promise;
}


////////////////////////////////////////////////////////////////////////////////
//
//  Run the program.
//
////////////////////////////////////////////////////////////////////////////////

function run()
{
  // Get the input.
  const database = getProperty ( argv, "database", null );
  let folders = getProperty ( argv, "folder", null );

  // Check for errors.
  if ( true == lodash.isArray ( database ) )
  {
    console.log ( "Database name is an array" );
    return 1;
  }
  if ( false == lodash.isString ( database ) )
  {
    console.log ( "Database name is not a string" );
    return 1;
  }

  // Make sure this is an array.
  if ( false == lodash.isArray ( folders ) )
  {
    folders = [ folders ];
  }

  // Open the database.
  var db = new sqlite.Database ( "media_server_database.sqlite" );

  // Create the necessary tables if this is the first time.
  db.serialize ( function()
  {
    db.run (
      "CREATE TABLE IF NOT EXISTS mime_type ( " +
        "id INTEGER PRIMARY KEY, " +
        "type TEXT NOT NULL UNIQUE " +
      ");"
    );

    db.run (
      "CREATE TABLE IF NOT EXISTS all_files ( " +
        "id INTEGER PRIMARY KEY, " +
        "path TEXT NOT NULL UNIQUE, " +
        "checksum TEXT NOT NULL UNIQUE, " +
        "mime_type_id INTEGER NOT NULL " +
      ");"
    );
  } );

  // This will hold all the promises.
  let promises = [];

  // This will hold all the file paths.
  let paths = [];

  // Loop through the folder names.
  for ( let i = 0; i < folders.length; ++i )
  {
    // Process the folder.
    promises.push ( processFolder ( {
      paths: paths,
      folder: folders[i]
    } ) );
  }

  // Wait for the above promises.
  Promise.all ( promises )
  .then ( function()
  {
    console.log ( paths );
  } );

  // Close the database before we return.
  db.close();

}


////////////////////////////////////////////////////////////////////////////////
//
//  The main function.
//
////////////////////////////////////////////////////////////////////////////////

( function()
{
  try
  {
    run();
  }
  catch ( error )
  {
    console.log ( "Exception caught:", error );
  }
} ) ();
