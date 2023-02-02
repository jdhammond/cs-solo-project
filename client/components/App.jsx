import { update } from 'lodash';
import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';

const App = () => {
  // state
  let currentUser = {
    name: 'jdh',
    admin: true,
    anonymous: false,
    avatar: null,
  };
  const questionsList = [
    // {
    //   questionId: 0,
    //   questionText: 'Are you a cat person or a dog person?',
    //   questionAnswer: null,
    // },
    // {
    //   questionId: 1,
    //   questionText: 'Heist or pyramid scheme?',
    //   questionAnswer: 9,
    // },
    // {
    //   questionId: 2,
    //   questionText: 'Redux or self-immolation?',
    //   questionAnswer: null,
    // },
  ];

  const [questions, updateQandA] = React.useState(questionsList);

  // on initial load, grab questions from db
  // empty array as 2nd parameter means this will only run once, on load
  useEffect(() => {
    fetch('/questions/')
      .then((res) => res.json())
      .then((data) => {
        console.log('data is ' + JSON.stringify(data));
        const newQuestionsList = [];
        for (let el of data) {
          newQuestionsList.push({
            questionId: el._id,
            questionText: el.text,
            questionAnswer: null,
          });
        }
        updateQandA(newQuestionsList);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log('answer updated');
    // const updateAnswer = (answer) => {
  });

  // When an answer is changed, update state
  const handleChange = (e, id) => {
    // console.log(id);
    // make new object
    const newQandA = [...questions];
    for (const el of newQandA) {
      if (el.questionId === id) el.questionAnswer = e.target.value;
    }
    //newQandA[id].questionAnswer = e.target.value;
    // console.log(newQandA);
    // replace old object
    updateQandA(newQandA);
  };

  // Add a question
  const submitQuestion = async () => {
    const qInput = document.querySelector('#new-question-text');
    // make new question
    const newQuestion = {
      questionId: questions.length,
      questionText: qInput.value,
      questionAnswer: null,
    };
    qInput.value = '';
    await fetch('/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    }).then((res) => {
      console.log(`question added: ${res}`);
    });
    updateQandA([...questions.concat(newQuestion)]);
  };

  return (
    <div>
      <QuestionBox questionsList={questions} handleChange={handleChange} />
      <QuestionCreator submitQuestion={submitQuestion} />
    </div>
  );
};

class QuestionBox extends Component {
  render() {
    const cards = [];
    for (let q of this.props.questionsList) {
      cards.push(
        <QuestionCard
          question={q.questionText}
          answer={q.questionAnswer}
          handleChange={(e) => this.props.handleChange(e, q.questionId)}
        />
      );
    }
    return <div className='questionBox'>{cards}</div>;
  }
}

class QuestionCard extends Component {
  render() {
    return (
      <div className='question-card'>
        <div className='question-text'>{this.props.question}</div>
        <input
          id='question-answer-1'
          type='range'
          min='-10'
          max='10'
          step='1'
          value={this.props.answer === null ? 0 : this.props.answer}
          onChange={this.props.handleChange}
        />
      </div>
    );
  }
}

class QuestionCreator extends Component {
  render() {
    return (
      <div className='new-question'>
        <div>Contribute a question</div>
        <input
          type='text'
          id='new-question-text'
          placeholder='Contribute a question'
        />
        <button onClick={this.props.submitQuestion}>Submit</button>
      </div>
    );
  }
}

export default App;
