const path = require('path');
const express = require('express');

const app = express();
const routes = require('./routes');
const PORT = 3000;

// parse request body
app.use(express.json());

// load CSS at some point

app.use(
  '/index',
  express.static(
    path.resolve('/Users/jdh/Documents/codesmith/webpack-test/index.html')
  )
);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Can't find that one");
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  // create specific error object
  const errorObj = Object.assign(defaultErr, err);
  // log the error
  console.log(errorObj.log);
  // respond to request with appropriate status code and error message as JSON
  return res.status(errorObj.status).json(errorObj.message);
});

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
