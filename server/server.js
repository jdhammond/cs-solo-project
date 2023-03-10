const path = require('path');
const express = require('express');

const app = express();
const controllers = require('./controllers');
const PORT = 3000;
// parse request body

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  '/index',
  express.static(
    path.resolve('/Users/jdh/Documents/codesmith/webpack-test/index.html')
  )
);

// app.get(
//   '/index',
//   express.static(
//     path.resolve('/Users/jdh/Documents/codesmith/webpack-test/styles.css')
//   )
// );

app.get('/users', controllers.getAllUsers, (req, res) => {
  return res.status(200).json(res.locals.users);
});

app.get('/questions', controllers.getQuestions, (req, res) => {
  return res.status(200).json(res.locals.data);
});

app.post('/questions', controllers.addQuestion, (req, res) => {
  return res.status(200).send('Question stored!');
});

app.post('/readquestions', controllers.getAnswers, (req, res) => {
  return res.status(200).send(res.locals.answers);
});

app.post('/users', controllers.addPerson, (req, res) => {
  return res.status(200).send('Person stored!');
});

app.post('/visfind', controllers.getThreeAnswers, (req, res) => {
  return res.status(200).send(res.locals.answers);
});

app.patch('/questions', controllers.updateAnswers, (req, res) => {
  return res.status(200).send('Answers logged to DB.');
});

app.delete('/questions/:id', controllers.deleteQuestion, (req, res) => {
  return res.status(200).send('question deleted!');
});

//404 handler
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
