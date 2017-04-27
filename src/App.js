import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import createBox from './components/createBox'
// var bootstrap = require('react-bootstrap')




class App extends Component {

    addBoxDetails = (details) => {

    }



    render() {
        return (
            <div className="App">
                <createBox addBoxDetails={this.addBoxDetails.bind(this)}/>
            </div>
        );
    }
}

export default App;
