There is an example to access the Google Calendar at:
  https://developers.google.com/calendar/quickstart/nodejs

This example uses a chain of callback functions, which makes it
  hard to work with or customize.

Thels has taken the example code, and restructured this code
  into individual functions that can be called separately,
  and which return a Promise (where required).

The original code (for testing purposes) is found in src/example.js
The restructured code is found in src/google.js

Note that the functionality of each piece of code has not yet changed.
Credentials and tokens are still read from and written to json files.
Also, if a new token needs to be generated, the console is required.