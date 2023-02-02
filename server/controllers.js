const express = require('express');
const router = express.Router();
const db = require('./models.js');

const controllers = {};

controllers.getAllUsers = async (req, res, next) => {
  console.log('hello from getallusers');
  try {
    const data = await db.Person.find({});
    //console.log(data);
    res.locals.users = data;
    return next();
  } catch (err) {
    return next({ log: err });
  }
};

// get question and answer data
controllers.getQuestions = async (req, res, next) => {
  console.log('hello from getquestions');
  try {
    const data = await db.Question.find({});
    //console.log(data);
    res.locals.data = data;
    return next();
  } catch (err) {
    return next({ log: err });
  }
};

controllers.addQuestion = async (req, res, next) => {
  console.log('hello from addquestions');
  try {
    console.log(req.body);
    await db.Question.create(({ text, answers } = req.body));
    return next();
  } catch {
    return next(err);
  }
};

controllers.addPerson = async (req, res, next) => {
  console.log('hello from addperson');
  try {
    console.log(req.body);
    await db.Person.create({
      name: req.body.name,
      anonymous: req.body.anonymous,
      avatar: req.body.avatar,
    });
    return next();
  } catch {
    return next(err);
  }
};

controllers.updateAnswers = async (req, res, next) => {
  console.log('hello from updateAnswers');
  try {
    //console.log(req.body);
    // loop through the question answers provided, pushing to array
    for (const el of req.body.questions) {
      const question = await db.Question.findOne({ _id: el.questionId });
      question.answers.push({
        answer: el.questionAnswer,
        respondent: req.body.user._id,
      });
      console.log('saved answer to ' + el.questionText);
      await question.save();
    }
    //await user.save();
    return next();
  } catch (err) {
    console.log(err);
    return next({ err });
  }
};

controllers.getAnswers = async (req, res, next) => {
  console.log('hello from getanswers');
  console.log(JSON.stringify(req.body));
  try {
    const answers = {};
    for (const el of req.body.questions) {
      const currentQuestion = await db.Question.findOne({ _id: el.questionId });
      //console.log(currentQuestion);
      // find within array of answers to the question one whose respondent id matches the id of the user selected on the front end
      const answer =
        currentQuestion.answers
          .reverse()
          .find((el) => el.respondent.toString() === req.body.userId) ?? null;
      if (answer) {
        // has the inefficient but otherwise desirable effect of overwriting all but the most recent answer for a given question
        answers[el.questionId] = answer.answer;
      }
    }
    //console.log(JSON.stringify(answers));
    res.locals.answers = answers;
    console.log('user: ' + req.body.userId);
    console.log('res.locals: ' + JSON.stringify(res.locals.answers));
    return next();
  } catch (err) {
    console.log(err);
    return next({ err });
  }
};

controllers.deleteQuestion = async (req, res, next) => {
  console.log('hello from deletequestion');
  console.log(req.params.id);
  try {
    const deleted = await db.Question.findByIdAndDelete({ _id: req.params.id });
    console.log('deleted ' + deleted);
    return next();
  } catch (err) {
    return next({ err });
  }
};

module.exports = controllers;
