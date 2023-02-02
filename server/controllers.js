const express = require('express');
const router = express.Router();
const db = require('./models.js');

const controllers = {};

// get question and answer data
controllers.getQuestions = async (req, res, next) => {
  console.log('hello from getquestions');
  try {
    const data = await db.Question.find({});
    console.log(data);
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

module.exports = controllers;
