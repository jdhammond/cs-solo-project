import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';

const App = () => {
  // state
  let currentUser = {
    name: 'jdh',
    anonymous: false,
    avatar: null,
  };
  const questionsList = [
    {
      questionId: 0,
      questionText: 'Are you a cat person or a dog person?',
      questionAnswer: null,
    },
    {
      questionId: 1,
      questionText: 'Heist or pyramid scheme?',
      questionAnswer: 9,
    },
    {
      questionId: 2,
      questionText: 'Redux or self-immolation?',
      questionAnswer: null,
    },
  ];

  const [questions, updateQandA] = React.useState(questionsList);

  useEffect(() => {
    console.log('answer updated');
    // const updateAnswer = (answer) => {
  });

  // When an answer is changed, update state
  const handleChange = (e, id) => {
    // make new object
    const newQandA = [...questions];
    newQandA[id].questionAnswer = e.target.value;
    console.log(newQandA);
    // replace old object
    updateQandA(newQandA);
  };

  const submitQuestion = () => {
    const qInput = document.querySelector('#new-question-text');
    // make new object
    // make new question
    const newQuestion = {
      questionId: questions.length,
      questionText: qInput.value,
      questionAnswer: null,
    };
    const newQandA = [...questions].concat(newQuestion);
    console.log(newQandA);
    updateQandA(newQandA);
  };

  return (
    <div>
      {'Hello'}
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
          type='text'
          placeholder={this.props.answer === null ? '' : this.props.answer}
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
