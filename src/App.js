import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
// import createBox from './components/BoxForm'
import { Provider } from 'react-redux';
import Tree from './components/Tree'
import TreeTemplate from 'react-ui-tree'

// var bootstrap = require('react-bootstrap')

import { initStore } from './store/store'
const store = initStore();

class App extends Component {





    render() {
        return (
            <Provider store={store}>
                <Tree/>

            </Provider>
        );
    }
}

export default App;
