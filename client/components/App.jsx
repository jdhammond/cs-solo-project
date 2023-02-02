import { update } from 'lodash';
import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';

const App = () => {
  const questionsList = [];
  const allUsers = [];

  const [questions, updateQandA] = React.useState(questionsList);
  const [userList, updateUserList] = React.useState(allUsers);
  const [user, updateUser] = React.useState(currentUser);

  let currentUser = {
    _id: '63db155d892950ccafb0cce3',
    name: 'abc',
    admin: true,
    anonymous: false,
    avatar: null,
    answers: {},
  };

  // on initial load, grab questions from db
  // empty array as 2nd parameter means this will only run once, on load

  useEffect(() => {
    fetch('/users/')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        updateUserList(data);
      })
      .catch((err) => console.log(err));
    fetch('/questions/')
      .then((res) => res.json())
      .then((data) => {
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

  const deleteQuestion = async (e, id) => {
    console.log(e);
    console.log(id);
    await fetch(`/questions/${id}`, {
      method: 'DELETE',
    });
    updateQandA(questions.filter((el) => el.questionId !== id));
  };

  // Add a question <== currently new question DOESN'T appear right away
  const submitQuestion = async () => {
    const qInput = document.querySelector('#new-question-text');
    // make new question
    const newQuestion = {
      text: qInput.value,
      answers: [],
    };
    qInput.value = '';
    await fetch('/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    }).then((res) => {
      console.log(`question added: ${res}`);
    });
    //updateQandA([...questions.concat(newQuestion)]);
  };

  const saveToDB = async () => {
    console.log(JSON.stringify({ user: currentUser, questions: questions }));
    await fetch('/questions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: currentUser, questions: questions }),
    }).then((res) => {
      console.log(`body sent to server: ${JSON.stringify(res)}`);
    });
  };

  return (
    <div>
      <UserSelect userList={userList} />
      <QuestionBox
        questionsList={questions}
        handleChange={handleChange}
        deleteQuestion={deleteQuestion}
      />
      <QuestionCreator submitQuestion={submitQuestion} />
      <NavButtons saveToDB={saveToDB} />
    </div>
  );
};

class QuestionBox extends Component {
  render() {
    const cards = [];
    for (let q of this.props.questionsList) {
      cards.push(
        <QuestionCard
          id={q.questionId}
          question={q.questionText}
          answer={q.questionAnswer}
          handleChange={(e) => this.props.handleChange(e, q.questionId)}
          deleteQuestion={(e) => this.props.deleteQuestion(e, q.questionId)}
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
          id={`card${this.props.id}`}
          type='range'
          min='-10'
          max='10'
          step='1'
          value={this.props.answer === null ? 0 : this.props.answer}
          onChange={this.props.handleChange}
        />
        <button
          id={`delete${this.props.id}`}
          onClick={this.props.deleteQuestion}
          className='deleteX'
        >
          X
        </button>
      </div>
    );
  }
}

class UserSelect extends Component {
  render() {
    return <div>{'hello'}</div>;
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

function NavButtons(props) {
  return (
    <div>
      <button onClick={props.saveToDB}>Save Answers</button>
      <button>Visualize</button>
    </div>
  );
}

export default App;
