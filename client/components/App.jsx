import React, { Component } from 'react';
import { render } from 'react-dom';
import GridLayout from "react-grid-layout";

class App extends Component {
  
  render() {
    

    return (
      <div>
        {"Hello"}
        <div id="board">
          {"Hello world"}
        </div>
        <button id="reset" onClick={() => console.log('button')}>Reset board</button>
      </div>
    );
  }
}

export default App;
