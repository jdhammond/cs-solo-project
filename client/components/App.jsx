// import { application } from 'express';
import { update } from 'lodash';
import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';
import Visualizer from './Visualizer.jsx';

const App = () => {
  const questionsList = [];
  const allUsers = [];
  let user = {};

  const [questions, updateQandA] = React.useState(questionsList);
  const [userList, updateUserList] = React.useState(allUsers);
  let [currentUser, updateUser] = React.useState(user);
  const [visQuestions, updateVisQuestions] = React.useState([]);

  // on initial load, grab questions from db
  // empty array as 2nd parameter means this will only run once, on load
  useEffect(() => {
    fetch('/users/')
      .then((res) => res.json())
      .then((data) => {
        const newUsersList = [];
        for (let el of data) {
          newUsersList.push(el);
        }
        updateUserList(newUsersList);
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
  }, [questions.length]);

  // when new user is selected, update sliders to reflect their opinions
  // useEffect(() => {
  //   console.log('user was changed');
  //   // loop through the questions on the page
  //   // extract from each one's answer array the current user's answer, if any
  //   // update the value of that slider (questionAnswer) w/newQandA
  //   const newQuestions = [...questions];

  // }, [currentUser]);

  // v broken useeffect conditional vv
  // useEffect(() => {
  //   console.log('current user has changed to ' + currentUser.name);
  //   let getAnswers = async (userId, questions) => {
  //     await fetch('/readquestions', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         userId,
  //         questions,
  //       }),
  //     })
  //       .then((res) => {
  //         console.log('res: ' + res);
  //         return res.json();
  //       })
  //       .then((data) => {
  //         console.log('data from db: ' + data);
  //         return data;
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   getAnswers(currentUser._id, questions);
  // }, [currentUser.name]);

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

  // const handleCheck = (e, id) => {
  //   console.log(e.target.value, id);
  //   const newVisQuestions = [...visQuestions];
  //   const targetQuestion = questions.find((el) => el.questionId === id);
  //   if (e.target.value === 'on') {
  //     newVisQuestions.push(targetQuestion);
  //   } else {
  //     const removeIndex = questions.indexOf(targetQuestion);
  //     newVisQuestions.splice(removeIndex, 1);
  //   }
  //   updateVisQuestions(newVisQuestions);
  //   console.log(visQuestions);
  // };

  const changeUser = async (e) => {
    // use the value of the dropdown selection
    // find user with the matching id
    // set current user to that

    // store current user's answers to DB ???? <===
    console.log(e.target.value);
    console.log('prev user ' + JSON.stringify(currentUser));
    const foundUser = userList.find((el) => el._id === e.target.value);
    updateUser(Object.assign(currentUser, foundUser));
    console.log('user now ' + JSON.stringify(currentUser));
    //console.log('currentUser ' + JSON.stringify(currentUser));
    //console.log('user: ' + user), console.log('currentUser: ' + currentUser);
    getAnswers(currentUser._id, questions);
  };

  const getThreeAnswersFromAll = async (userList, questionArray) => {
    console.log('userList: ' + userList);
    await fetch('/visfind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions: questionArray,
        users: userList,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data from db: ' + JSON.stringify(data));
      });
  };

  const getAnswers = async (userId, questions) => {
    await fetch('/readquestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        questions,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data from db: ' + JSON.stringify(data));
        console.log(questions);
        const newQandA = [...questions];
        for (const el of newQandA) {
          console.log(el.questionId);
          // if there exists in the reteruned data an answer to a question whose id matches a question on the screen,
          // restored that answer; or null if there's no
          if (data[el.questionId]) {
            el.questionAnswer = data[el.questionId];
          } else {
            el.questionAnswer = null;
          }
        }
        console.log('updated answers ' + JSON.stringify(newQandA));
        updateQandA(newQandA);
      })
      .catch((err) => console.log(err));
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
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`body sent to server: ${JSON.stringify(data)}`);
      });
  };

  return (
    <div>
      <UserSelect userList={userList} changeUser={changeUser} />
      <QuestionBox
        questionsList={questions}
        handleChange={handleChange}
        deleteQuestion={deleteQuestion}
        // handleCheck={handleCheck}
      />
      <QuestionCreator submitQuestion={submitQuestion} />
      <NavButtons
        saveToDB={saveToDB}
        getVis={() =>
          getThreeAnswersFromAll(userList, [
            questions[0],
            questions[1],
            questions[2],
          ])
        }
      />
      <Visualizer visQuestions={visQuestions} />
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
          handleCheck={(e) => this.props.handleCheck(e, q.questionId)}
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
        {/* <input
          id={`check${this.props.id}`}
          onChange={this.props.handleCheck} // <== click or change?
          type='checkbox'
        /> */}
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
    //make a dropdown out of this; set useeffect to snap the sliders to a user's answers when user changes
    //also think instant update of added queestion
    //login?
    //visuals! 3js?

    const usernames = [];
    this.props.userList.forEach((el) => {
      usernames.push(<option value={el._id}>{el.name}</option>);
    });

    return (
      <div>
        <select
          name='user'
          id='user'
          onChange={(e) => this.props.changeUser(e)}
        >
          {usernames}
        </select>
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

function NavButtons(props) {
  return (
    <div>
      <button onClick={props.saveToDB}>Save Answers</button>
      <button onClick={props.getVis}>Visualize</button>
    </div>
  );
}

export default App;
