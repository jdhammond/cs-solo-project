const express = require('express');
const router = express.Router();
const db = require('./models.js');

const controllers = {};

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

module.exports = controllers;
